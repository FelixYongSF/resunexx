import { randomUUID } from "node:crypto";
import postgres from "postgres";

type NonProductionTarget = "development" | "staging";

function requireNonProductionTarget(): NonProductionTarget {
  const target = process.env.NEXX_CORE_MIGRATION_TARGET;
  if (target !== "development" && target !== "staging") {
    throw new Error("Set NEXX_CORE_MIGRATION_TARGET to development or staging to run the restore verification.");
  }
  if (process.env.VERCEL_ENV === "production" || process.env.NEXX_CORE_ENVIRONMENT === "production") {
    throw new Error("Nexx Core restore verification is blocked in production.");
  }
  if (process.env.NEXX_CORE_ENVIRONMENT && process.env.NEXX_CORE_ENVIRONMENT !== target) {
    throw new Error("NEXX_CORE_ENVIRONMENT must match the non-production restore target.");
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
  const probeId = randomUUID();

  try {
    try {
      await sql.begin(async (transaction) => {
        await transaction`
          INSERT INTO core_governance.restore_verification_runs (
            restore_verification_run_id, verification_kind, verified_at, safe_result
          ) VALUES (${probeId}::uuid, 'transaction_rollback', now(), 'passed')
        `;
        throw new Error("intentional_transaction_rollback");
      });
    } catch (error) {
      if (!(error instanceof Error) || error.message !== "intentional_transaction_rollback") throw error;
    }

    const retainedProbe = await sql<{ exists: boolean }[]>`
      SELECT EXISTS(
        SELECT 1 FROM core_governance.restore_verification_runs
        WHERE restore_verification_run_id = ${probeId}::uuid
      ) AS exists
    `;
    if (retainedProbe[0]?.exists) throw new Error("rollback probe remained after transaction rollback");

    await sql`
      INSERT INTO core_governance.restore_verification_runs (
        restore_verification_run_id, verification_kind, verified_at, safe_result
      ) VALUES (${randomUUID()}::uuid, 'transaction_rollback', now(), 'passed')
    `;
    console.info(`[nexx-core] ${target} transaction rollback verification passed.`);
    console.info("[nexx-core] note: Neon point-in-time restore remains a separate Gate B test.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] non-production restore verification failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
