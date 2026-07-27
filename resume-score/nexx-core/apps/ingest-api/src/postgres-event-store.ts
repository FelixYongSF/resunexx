import { randomUUID } from "node:crypto";
import type { Sql } from "postgres";
import type { AcceptedCoreEvent, EventRejection } from "../../../packages/contracts/src/index.ts";
import type { CoreEventStore } from "./event-store.ts";

type ExistingEvent = Readonly<{ event_id: string }>;

/**
 * Append-only Core store. Product data is never accepted here
 * until it has passed the shared privacy sanitizer.
 */
export class PostgresCoreEventStore implements CoreEventStore {
  private readonly sql: Sql;

  constructor(sql: Sql) {
    this.sql = sql;
  }

  async findByIdempotencyKey(event: Pick<AcceptedCoreEvent, "productKey" | "environment" | "idempotencyKey">): Promise<Pick<AcceptedCoreEvent, "eventId"> | undefined> {
    const rows = await this.sql<ExistingEvent[]>`
      SELECT event.event_id
      FROM core_raw.core_events AS event
      JOIN core_registry.products AS product ON product.product_id = event.product_id
      WHERE product.organization_key = 'nexx'
        AND product.product_key = ${event.productKey}
        AND event.environment = ${event.environment}
        AND event.idempotency_key = ${event.idempotencyKey}
      LIMIT 1
    `;
    return rows[0] ? { eventId: rows[0].event_id } : undefined;
  }

  async appendEvent(event: AcceptedCoreEvent): Promise<"inserted" | "duplicate"> {
    const rows = await this.sql<ExistingEvent[]>`
      INSERT INTO core_raw.core_events (
        event_id, idempotency_key, product_id, environment, event_name, event_version,
        product_contract_version, source, occurred_at, received_at, actor_ref, session_id,
        journey_id, correlation_id, causation_id, entity_refs, properties,
        privacy_policy_version, consent_policy_version, data_classification, retention_class
      )
      SELECT
        ${event.eventId}::uuid, ${event.idempotencyKey}, product.product_id, ${event.environment},
        ${event.eventName}, ${event.eventVersion}, ${event.productContractVersion}, ${event.source},
        ${event.occurredAt}::timestamptz, ${event.receivedAt}::timestamptz, ${event.actorRef ?? null},
        ${event.sessionId ?? null}, ${event.journeyId ?? null}, ${event.correlationId ?? null},
        ${event.causationId ?? null}, ${this.sql.json(event.entityRefs ?? {})},
        ${this.sql.json(event.properties ?? {})}, ${event.privacyPolicyVersion},
        ${event.consentPolicyVersion ?? null}, ${event.dataClassification}, ${event.retentionClass}
      FROM core_registry.products AS product
      WHERE product.organization_key = 'nexx' AND product.product_key = ${event.productKey}
      ON CONFLICT (product_id, environment, idempotency_key) DO NOTHING
      RETURNING event_id
    `;

    if (rows[0]) return "inserted";
    const productExists = await this.sql<{ product_id: string }[]>`
      SELECT product_id FROM core_registry.products
      WHERE organization_key = 'nexx' AND product_key = ${event.productKey}
      LIMIT 1
    `;
    if (!productExists[0]) throw new Error(`Registered product not found: ${event.productKey}`);
    return "duplicate";
  }

  async appendRejection(rejection: EventRejection): Promise<void> {
    await this.sql`
      INSERT INTO core_raw.event_rejections (
        rejection_id, product_key, environment, event_name, reason_code, safe_detail, received_at, retention_expires_at
      ) VALUES (
        ${rejection.rejectionId}::uuid, ${rejection.productKey ?? null}, ${rejection.environment ?? null},
        ${rejection.eventName ?? null}, ${rejection.reasonCode}, ${rejection.safeDetail ?? null},
        ${rejection.receivedAt}::timestamptz, ${new Date(Date.parse(rejection.receivedAt) + 30 * 24 * 60 * 60 * 1000).toISOString()}::timestamptz
      )
    `;
  }
}

export async function ensureProductRegistration(
  sql: Sql,
  environment: "development" | "staging" | "production",
  productKey = "resunexx"
): Promise<void> {
  const productRows = await sql<{ product_id: string }[]>`
    SELECT product_id FROM core_registry.products
    WHERE organization_key = 'nexx' AND product_key = ${productKey}
    LIMIT 1
  `;
  const productId = productRows[0]?.product_id ?? randomUUID();

  if (!productRows[0]) {
    await sql`
      INSERT INTO core_registry.products (product_id, organization_key, product_key, display_name)
      VALUES (${productId}::uuid, 'nexx', ${productKey}, ${`ResuNexx ${environment}`})
    `;
  }

  await sql`
    INSERT INTO core_registry.product_contract_versions (
      contract_version_id, product_id, contract_version, effective_at
    ) VALUES (
      ${randomUUID()}::uuid, ${productId}::uuid, 'nexx-core-event-v1', now()
    ) ON CONFLICT (product_id, contract_version) DO NOTHING
  `;
}

/** Backwards-compatible helper for existing local development commands. */
export async function ensureDevelopmentProductRegistration(sql: Sql, productKey = "resunexx"): Promise<void> {
  return ensureProductRegistration(sql, "development", productKey);
}

/** Backwards-compatible helper for the existing non-production commands. */
export async function ensureNonProductionProductRegistration(
  sql: Sql,
  environment: "development" | "staging",
  productKey = "resunexx"
): Promise<void> {
  return ensureProductRegistration(sql, environment, productKey);
}
