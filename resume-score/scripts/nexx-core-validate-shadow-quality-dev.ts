import postgres from "postgres";
import type { CoreEventInput } from "../nexx-core/packages/contracts/src/index.ts";
import { SHADOW_EVENT_NAMES, evaluateShadowModeDataQuality, type ShadowEventName } from "../nexx-core/packages/quality/src/index.ts";
import { acquireReplicationLock, localEventCountsByName, mountEncryptedReplicaVolume, openLocalReplica } from "../nexx-core/packages/local-replication/src/index.ts";

type NonProductionTarget = "development" | "staging";

function requireNonProductionTarget(): NonProductionTarget {
  const target = process.env.NEXX_CORE_SHADOW_TARGET;
  if (target !== "development" && target !== "staging") {
    throw new Error("Set NEXX_CORE_SHADOW_TARGET to development or staging before validating Shadow Mode data.");
  }
  if (process.env.VERCEL_ENV === "production" || process.env.NEXX_CORE_ENVIRONMENT === "production") {
    throw new Error("Shadow Mode data validation is blocked in production.");
  }
  if (process.env.NEXX_CORE_ENVIRONMENT && process.env.NEXX_CORE_ENVIRONMENT !== target) {
    throw new Error("NEXX_CORE_ENVIRONMENT must match the Shadow Mode validation target.");
  }
  return target;
}

function databaseUrl(target: NonProductionTarget): string {
  const value = target === "staging"
    ? process.env.NEXX_CORE_STAGING_DATABASE_URL
    : process.env.NEXX_CORE_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!value) throw new Error(`A ${target} Nexx Core database connection is required for Shadow Mode validation.`);
  return value;
}

type StoredShadowEvent = Readonly<{
  event_id: string;
  idempotency_key: string;
  event_name: string;
  event_version: number;
  occurred_at: string;
  product_key: string;
  environment: NonProductionTarget;
  source: CoreEventInput["source"];
  product_contract_version: string;
  privacy_policy_version: string;
  consent_policy_version: string | null;
  actor_ref: string | null;
  session_id: string | null;
  journey_id: string | null;
  correlation_id: string | null;
  causation_id: string | null;
  entity_refs: Record<string, string> | null;
  properties: Record<string, string | number | boolean | null> | null;
}>;

function asCoreEvent(row: StoredShadowEvent): CoreEventInput {
  return {
    eventId: row.event_id,
    idempotencyKey: row.idempotency_key,
    eventName: row.event_name,
    eventVersion: row.event_version as 1,
    occurredAt: row.occurred_at,
    productKey: row.product_key,
    environment: row.environment,
    source: row.source,
    productContractVersion: row.product_contract_version,
    privacyPolicyVersion: row.privacy_policy_version,
    consentPolicyVersion: row.consent_policy_version ?? undefined,
    actorRef: row.actor_ref ?? undefined,
    sessionId: row.session_id ?? undefined,
    journeyId: row.journey_id ?? undefined,
    correlationId: row.correlation_id ?? undefined,
    causationId: row.causation_id ?? undefined,
    entityRefs: row.entity_refs ?? undefined,
    properties: row.properties ?? undefined,
  };
}

async function main() {
  const target = requireNonProductionTarget();
  const sql = postgres(databaseUrl(target), { ssl: "require", max: 1 });
  const lock = await acquireReplicationLock();
  let volume: Awaited<ReturnType<typeof mountEncryptedReplicaVolume>> | undefined;
  try {
    const rows = await sql<StoredShadowEvent[]>`
      SELECT
        event.event_id::text, event.idempotency_key, event.event_name, event.event_version,
        event.occurred_at::text, product.product_key, event.environment, event.source,
        event.product_contract_version, event.privacy_policy_version, event.consent_policy_version,
        event.actor_ref, event.session_id, event.journey_id, event.correlation_id, event.causation_id,
        event.entity_refs, event.properties
      FROM core_raw.core_events AS event
      JOIN core_registry.products AS product ON product.product_id = event.product_id
      WHERE product.organization_key = 'nexx'
        AND product.product_key = 'resunexx'
        AND event.environment = ${target}
        AND event.event_name IN ('page.viewed', 'artifact_upload.started', 'cta.clicked', 'assessment.completed')
      ORDER BY event.received_at ASC, event.event_id ASC
    `;

    volume = await mountEncryptedReplicaVolume();
    const replica = await openLocalReplica(volume.dataDirectory);
    let replicaRawCounts: Readonly<Record<string, number>>;
    try {
      replicaRawCounts = await localEventCountsByName(replica, SHADOW_EVENT_NAMES);
    } finally {
      await replica.close();
    }
    const replicaCounts = Object.fromEntries(SHADOW_EVENT_NAMES.map((eventName) => [eventName, replicaRawCounts[eventName] ?? 0])) as Record<ShadowEventName, number>;
    const result = evaluateShadowModeDataQuality({ sourceEvents: rows.map(asCoreEvent), replicaCounts, allowedEnvironment: target });
    if (!result.passed) throw new Error(`Shadow Mode data quality validation failed: ${result.failures.join(" ")}`);
    console.info("[nexx-core] Shadow Mode data-quality validation passed.");
    console.info(`[nexx-core] inspected ${result.inspectedEventCount} minimal ${target} events; source and encrypted local replica counts match.`);
    console.table(SHADOW_EVENT_NAMES.map((eventName) => ({ event: eventName, source: result.sourceCounts[eventName], encrypted_local_replica: result.replicaCounts[eventName] })));
  } finally {
    await sql.end({ timeout: 5 });
    await lock.release();
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] Shadow Mode data-quality validation failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
