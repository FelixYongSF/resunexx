import postgres from "postgres";
import type { ReplicaPayload, ReplicationWatermark } from "./types.ts";

function assertReplicationEnvironment(
  environment: string | undefined,
  allowProduction: boolean | undefined
): asserts environment is "development" | "test" | "staging" | "production" {
  if (environment === "production" && allowProduction === true) return;
  if (environment === "development" || environment === "test" || environment === "staging") return;
  throw new Error("Founder-owned replication requires a permitted environment and explicit production approval.");
}

export async function readSourceDelta(args: Readonly<{
  databaseUrl: string;
  environment: string | undefined;
  allowProduction?: boolean;
  watermark?: ReplicationWatermark;
}>): Promise<ReplicaPayload> {
  assertReplicationEnvironment(args.environment, args.allowProduction);
  const sql = postgres(args.databaseUrl, { ssl: "require", max: 1 });
  try {
    const registry = await sql<Readonly<Record<string, unknown>>[]>`
      SELECT product_id::text, organization_key, product_key, display_name, created_at::text, retired_at::text
      FROM core_registry.products
      ORDER BY product_key
    `;
    const receivedAt = args.watermark?.receivedAt ?? "1970-01-01T00:00:00.000Z";
    const rows = await sql<Readonly<Record<string, unknown>>[]>`
      SELECT
        event_id::text AS event_id,
        to_char(received_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS received_at,
        event_name,
        jsonb_build_object(
          'event_id', event_id::text,
          'idempotency_key', idempotency_key,
          'product_id', product_id::text,
          'environment', environment,
          'event_name', event_name,
          'event_version', event_version,
          'product_contract_version', product_contract_version,
          'source', source,
          'occurred_at', occurred_at::text,
          'received_at', received_at::text,
          'actor_ref', actor_ref,
          'session_id', session_id,
          'journey_id', journey_id,
          'correlation_id', correlation_id,
          'causation_id', causation_id,
          'entity_refs', entity_refs,
          'properties', properties,
          'privacy_policy_version', privacy_policy_version,
          'consent_policy_version', consent_policy_version,
          'data_classification', data_classification,
          'retention_class', retention_class
        ) AS payload
      FROM core_raw.core_events
      WHERE environment = ${args.environment}
        AND (
          received_at >= ${receivedAt}::timestamptz - interval '5 minutes'
        )
      ORDER BY received_at ASC, event_id::text ASC
    `;
    const events = rows.map((row) => ({
      eventId: String(row.event_id),
      receivedAt: String(row.received_at),
      eventName: String(row.event_name),
      payload: row.payload as Readonly<Record<string, unknown>>,
    }));
    const paymentFactRows = await sql<Readonly<Record<string, unknown>>[]>`
      SELECT
        provider_event_id,
        to_char(received_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS received_at,
        fact_type,
        jsonb_build_object(
          'provider_event_id', provider_event_id,
          'provider_name', provider_name,
          'environment', environment,
          'fact_type', fact_type,
          'provider_order_ref', provider_order_ref,
          'provider_transaction_ref', provider_transaction_ref,
          'provider_refund_ref', provider_refund_ref,
          'plan_key', plan_key,
          'currency', currency,
          'amount_minor', amount_minor,
          'occurred_at', occurred_at::text,
          'received_at', received_at::text,
          'signature_verified', signature_verified,
          'adapter_version', adapter_version
        ) AS payload
      FROM core_raw.provider_payment_facts
      WHERE environment = ${args.environment}
      ORDER BY received_at ASC, provider_event_id ASC
    `;
    const paymentFacts = paymentFactRows.map((row) => ({
      providerEventId: String(row.provider_event_id),
      receivedAt: String(row.received_at),
      factType: String(row.fact_type),
      payload: row.payload as Readonly<Record<string, unknown>>,
    }));
    const last = events.at(-1);
    return {
      exportedAt: new Date().toISOString(),
      registry,
      events,
      paymentFacts,
      nextWatermark: last ? { receivedAt: last.receivedAt, eventId: last.eventId } : args.watermark,
    };
  } finally {
    await sql.end({ timeout: 5 });
  }
}
