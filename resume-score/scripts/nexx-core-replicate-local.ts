import { acquireReplicationLock, localReplicationKey, mountEncryptedReplicaVolume, replicateLocal } from "../nexx-core/packages/local-replication/src/index.ts";

type NonProductionTarget = "development" | "staging";

function requireLocalNonProductionTarget(): NonProductionTarget {
  const target = process.env.NEXX_CORE_LOCAL_REPLICATION_TARGET;
  if (target !== "development" && target !== "staging") {
    throw new Error("Set NEXX_CORE_LOCAL_REPLICATION_TARGET to development or staging to run local replication.");
  }
  if (process.env.VERCEL_ENV === "production" || process.env.NEXX_CORE_ENVIRONMENT === "production") {
    throw new Error("Founder-owned local replication is blocked in production.");
  }
  if (process.env.NEXX_CORE_ENVIRONMENT && process.env.NEXX_CORE_ENVIRONMENT !== target) {
    throw new Error("NEXX_CORE_ENVIRONMENT must match the local replication target.");
  }
  return target;
}

async function main() {
  const target = requireLocalNonProductionTarget();
  const databaseUrl = target === "staging"
    ? process.env.NEXX_CORE_STAGING_DATABASE_URL
    : process.env.NEXX_CORE_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error(`A ${target} Nexx Core database connection is required.`);
  const lock = await acquireReplicationLock();
  let volume: Awaited<ReturnType<typeof mountEncryptedReplicaVolume>> | undefined;
  try {
    volume = await mountEncryptedReplicaVolume();
    const result = await replicateLocal({
      databaseUrl,
      environment: target,
      exportsDirectory: volume.exportsDirectory,
      dataDirectory: volume.dataDirectory,
      key: await localReplicationKey(),
      failAfterExport: process.env.NEXX_CORE_REPLICATION_FAIL_AFTER_EXPORT === "1",
    });
    console.info(`[nexx-core] local replication complete: ${result.eventCount} events, ${result.paymentFactCount} payment facts, ${result.registryCount} registry records, resumed=${result.resumedPendingExport}`);
  } finally {
    await lock.release();
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] local replication failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
