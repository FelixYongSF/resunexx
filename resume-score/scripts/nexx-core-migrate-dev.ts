import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postgres from "postgres";

const migrationsDirectory = join(process.cwd(), "nexx-core/packages/db/migrations");

type NonProductionTarget = "development" | "staging";

function requireNonProductionTarget(): NonProductionTarget {
  const target = process.env.NEXX_CORE_MIGRATION_TARGET;
  if (target !== "development" && target !== "staging") {
    throw new Error("Set NEXX_CORE_MIGRATION_TARGET to development or staging to run Nexx Core migrations.");
  }
  if (process.env.VERCEL_ENV === "production" || process.env.NEXX_CORE_ENVIRONMENT === "production") {
    throw new Error("Nexx Core migrations are blocked in production.");
  }
  if (process.env.NEXX_CORE_ENVIRONMENT && process.env.NEXX_CORE_ENVIRONMENT !== target) {
    throw new Error("NEXX_CORE_ENVIRONMENT must match the non-production migration target.");
  }
  return target;
}

function databaseUrl(target: NonProductionTarget) {
  const url = target === "staging"
    ? process.env.NEXX_CORE_STAGING_DATABASE_URL
    : process.env.NEXX_CORE_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error(`A ${target} Nexx Core database connection is required.`);
  return url;
}

async function main() {
  const target = requireNonProductionTarget();
  const sql = postgres(databaseUrl(target), { ssl: "require", max: 1 });

  try {
    await sql`CREATE SCHEMA IF NOT EXISTS core_registry`;
    await sql`
      CREATE TABLE IF NOT EXISTS core_registry.schema_migrations (
        migration_name text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    const [migrationState] = await sql<{ migration_count: number; has_products_table: boolean }[]>`
      SELECT
        (SELECT count(*)::int FROM core_registry.schema_migrations) AS migration_count,
        to_regclass('core_registry.products') IS NOT NULL AS has_products_table
    `;
    if (migrationState?.migration_count === 0 && migrationState.has_products_table) {
      throw new Error(
        "Refusing to apply migrations: this database already contains Nexx Core tables but has no migration ledger. Use a new empty non-production database or establish an explicitly reviewed baseline."
      );
    }

    const migrations = (await readdir(migrationsDirectory))
      .filter((file) => /^\d{3}_.+\.sql$/.test(file))
      .sort();

    for (const migrationName of migrations) {
      const applied = await sql<{ exists: boolean }[]>`
        SELECT EXISTS(
          SELECT 1 FROM core_registry.schema_migrations WHERE migration_name = ${migrationName}
        ) AS exists
      `;
      if (applied[0]?.exists) continue;

      const migrationSql = await readFile(join(migrationsDirectory, migrationName), "utf8");
      await sql.begin(async (transaction) => {
        await transaction.unsafe(migrationSql);
        await transaction`
          INSERT INTO core_registry.schema_migrations (migration_name)
          VALUES (${migrationName})
        `;
      });
      console.info(`[nexx-core] applied ${migrationName}`);
    }

    const current = await sql<{ migration_name: string }[]>`
      SELECT migration_name FROM core_registry.schema_migrations ORDER BY migration_name
    `;
    console.info(`[nexx-core] ${target} migration verification passed (${current.length} migrations).`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] non-production migration failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
