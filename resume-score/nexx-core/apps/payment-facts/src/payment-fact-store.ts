import { randomUUID } from "node:crypto";
import type { Sql } from "postgres";
import type { PolarPaymentFactType, VerifiedPolarPaymentFact } from "./types.ts";

export interface PaymentFactStore {
  appendVerifiedFact(fact: VerifiedPolarPaymentFact): Promise<"recorded" | "duplicate">;
  listFactTypesForOrder(providerOrderRef: string): Promise<readonly PolarPaymentFactType[]>;
  listProviderEventIdsForOrder(providerOrderRef: string): Promise<readonly string[]>;
}

export class PostgresPaymentFactStore implements PaymentFactStore {
  private readonly sql: Sql;

  constructor(sql: Sql) {
    this.sql = sql;
  }

  async appendVerifiedFact(fact: VerifiedPolarPaymentFact): Promise<"recorded" | "duplicate"> {
    const rows = await this.sql<{ provider_event_id: string }[]>`
      INSERT INTO core_raw.provider_payment_facts (
        provider_fact_id, provider_event_id, provider_name, product_id, environment, fact_type,
        provider_order_ref, provider_transaction_ref, provider_refund_ref, plan_key, currency,
        amount_minor, occurred_at, received_at, signature_verified, adapter_version
      )
      SELECT
        ${randomUUID()}::uuid, ${fact.providerEventId}, 'polar', product.product_id,
        ${fact.environment}, ${fact.factType}, ${fact.providerOrderRef},
        ${fact.providerTransactionRef ?? null}, ${fact.providerRefundRef ?? null}, ${fact.planKey},
        ${fact.currency ?? null}, ${fact.amountMinor ?? null}, ${fact.occurredAt}::timestamptz,
        ${fact.receivedAt ?? new Date().toISOString()}::timestamptz, true, ${fact.adapterVersion}
      FROM core_registry.products AS product
      WHERE product.organization_key = 'nexx' AND product.product_key = ${fact.productKey}
      ON CONFLICT (provider_name, provider_event_id) DO NOTHING
      RETURNING provider_event_id
    `;

    if (rows[0]) return "recorded";
    const productRows = await this.sql<{ product_id: string }[]>`
      SELECT product_id FROM core_registry.products
      WHERE organization_key = 'nexx' AND product_key = ${fact.productKey}
      LIMIT 1
    `;
    if (!productRows[0]) throw new Error(`Registered development product not found: ${fact.productKey}`);
    return "duplicate";
  }

  async listFactTypesForOrder(providerOrderRef: string): Promise<readonly PolarPaymentFactType[]> {
    const rows = await this.sql<{ fact_type: PolarPaymentFactType }[]>`
      SELECT fact_type FROM core_raw.provider_payment_facts
      WHERE provider_name = 'polar' AND provider_order_ref = ${providerOrderRef}
      ORDER BY occurred_at ASC, provider_event_id ASC
    `;
    return rows.map((row) => row.fact_type);
  }

  async listProviderEventIdsForOrder(providerOrderRef: string): Promise<readonly string[]> {
    const rows = await this.sql<{ provider_event_id: string }[]>`
      SELECT provider_event_id FROM core_raw.provider_payment_facts
      WHERE provider_name = 'polar' AND provider_order_ref = ${providerOrderRef}
    `;
    return rows.map((row) => row.provider_event_id);
  }
}
