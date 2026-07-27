import { acquireReplicationLock, localReplicationKey, mountEncryptedReplicaVolume, verifyReplicaReadOnly } from "../nexx-core/packages/local-replication/src/index.ts";

type NonProductionTarget = "development" | "staging";

async function main() {
  const target = process.env.NEXX_CORE_LOCAL_REPLICATION_TARGET;
  if (target !== "development" && target !== "staging") {
    throw new Error("Set NEXX_CORE_LOCAL_REPLICATION_TARGET to development or staging to query the local replica.");
  }
  if (process.env.VERCEL_ENV === "production" || process.env.NEXX_CORE_ENVIRONMENT === "production") {
    throw new Error("Founder-owned local replica queries are blocked in production.");
  }
  if (process.env.NEXX_CORE_ENVIRONMENT && process.env.NEXX_CORE_ENVIRONMENT !== (target as NonProductionTarget)) {
    throw new Error("NEXX_CORE_ENVIRONMENT must match the local replication target.");
  }
  const lock = await acquireReplicationLock();
  let volume: Awaited<ReturnType<typeof mountEncryptedReplicaVolume>> | undefined;
  try {
    volume = await mountEncryptedReplicaVolume();
    await localReplicationKey();
    const summary = await verifyReplicaReadOnly({ dataDirectory: volume.dataDirectory });
    console.info("[nexx-core] local event summary");
    console.table(summary.events);
    console.info("[nexx-core] local payment-fact summary");
    console.table(summary.paymentFacts);
  } finally {
    await lock.release();
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] local replica query failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
