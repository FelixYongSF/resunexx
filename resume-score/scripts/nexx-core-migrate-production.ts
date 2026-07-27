import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postgres from "postgres";

const migrationsDirectory = join(process.cwd(), "nexx-core/packages/db/migrations");

function requireProductionMigrationApproval(): string {
  if (process.env.VERCEL_ENV === "production") {
    throw new Error("Production migrations must run from the founder-controlled local machine, never inside Vercel.");
  }
  if (
    process.env.NEXX_CORE_MIGRATION_TARGET !== "production" ||
    process.env.NEXX_CORE_ENVIRONMENT !== "production" ||
    process.env.NEXX_CORE_PRODUCTION_MIGRATION_APPROVED !== "true"
  ) {
    throw new Error(
      "Production migration requires NEXX_CORE_MIGRATION_TARGET=production, NEXX_CORE_ENVIRONMENT=production, and NEXX_CORE_PRODUCTION_MIGRATION_APPROVED=true."
    );
  }
  if (!process.env.NEXX_CORE_DATABASE_URL) {
    throw new Error("NEXX_CORE_DATABASE_URL is required for the dedicated production Nexx Core database.");
  }
  return process.env.NEXX_CORE_DATABASE_URL;
}

async function main() {
  const sql = postgres(requireProductionMigrationApproval(), { ssl: "require", max: 1 });

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
        "Refusing to apply migrations: this database already contains Nexx Core tables but has no migration ledger. Use a new dedicated database or establish an explicitly reviewed baseline."
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
    console.info(`[nexx-core] production migration verification passed (${current.length} migrations).`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] production migration failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
