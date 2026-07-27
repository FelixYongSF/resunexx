import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { ensureDevelopmentProductRegistration } from "../nexx-core/apps/ingest-api/src/index.ts";
import { PaymentFactService, PostgresPaymentFactStore, type VerifiedPolarPaymentFact } from "../nexx-core/apps/payment-facts/src/index.ts";

function requireDevelopmentOnly() {
  if (process.env.NEXX_CORE_PAYMENT_FACTS_TARGET !== "development" || process.env.VERCEL_ENV === "production" || process.env.NEXX_CORE_ENVIRONMENT === "production") {
    throw new Error("Development-only payment-fact verification is blocked outside the approved local scope.");
  }
}

function syntheticFact(overrides: Partial<VerifiedPolarPaymentFact> = {}): VerifiedPolarPaymentFact {
  const orderRef = `ord_dev_${randomUUID().replaceAll("-", "")}`;
  return {
    providerEventId: `evt_dev_${randomUUID().replaceAll("-", "")}`,
    productKey: "resunexx",
    environment: "development",
    factType: "order_created",
    providerOrderRef: orderRef,
    planKey: "standard",
    currency: "usd",
    amountMinor: 499,
    occurredAt: new Date().toISOString(),
    signatureVerified: true,
    adapterVersion: "polar-payment-facts-v1",
    ...overrides
  };
}

async function main() {
  requireDevelopmentOnly();
  const databaseUrl = process.env.NEXX_CORE_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("NEXX_CORE_DATABASE_URL is required for verification.");
  const sql = postgres(databaseUrl, { ssl: "require", max: 1 });
  try {
    await ensureDevelopmentProductRegistration(sql);
    const service = new PaymentFactService(new PostgresPaymentFactStore(sql));
    const created = syntheticFact();
    const paid = syntheticFact({
      providerEventId: `evt_dev_paid_${randomUUID().replaceAll("-", "")}`,
      providerOrderRef: created.providerOrderRef,
      providerTransactionRef: `txn_dev_${randomUUID().replaceAll("-", "")}`,
      factType: "order_paid"
    });
    const refunded = syntheticFact({
      providerEventId: `evt_dev_refund_${randomUUID().replaceAll("-", "")}`,
      providerOrderRef: created.providerOrderRef,
      providerRefundRef: `ref_dev_${randomUUID().replaceAll("-", "")}`,
      factType: "order_refunded"
    });

    const createdResult = await service.recordVerifiedPolarFact(created);
    const paidResult = await service.recordVerifiedPolarFact(paid);
    const replayResult = await service.recordVerifiedPolarFact(paid);
    const refundResult = await service.recordVerifiedPolarFact(refunded);
    const reconciliation = await service.reconcileOrder(created.providerOrderRef, [created.providerEventId, paid.providerEventId, refunded.providerEventId]);
    if (createdResult.status !== "recorded" || paidResult.status !== "recorded" || replayResult.status !== "duplicate" || refundResult.status !== "recorded" || reconciliation.paymentState !== "refunded" || reconciliation.missingProviderEventIds.length !== 0) {
      throw new Error("Development payment-fact verification did not meet acceptance criteria.");
    }
    console.info("[nexx-core] development payment-fact verification passed: immutable, replay-protected, reconciled.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] development payment-fact verification failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
