import assert from "node:assert/strict";
import test from "node:test";
import { PaymentFactService, type PaymentFactStore, type PolarPaymentFactType, type VerifiedPolarPaymentFact } from "../nexx-core/apps/payment-facts/src/index.ts";

class InMemoryPaymentFactStore implements PaymentFactStore {
  private readonly facts = new Map<string, VerifiedPolarPaymentFact>();

  async appendVerifiedFact(fact: VerifiedPolarPaymentFact): Promise<"recorded" | "duplicate"> {
    if (this.facts.has(fact.providerEventId)) return "duplicate";
    this.facts.set(fact.providerEventId, fact);
    return "recorded";
  }

  async listFactTypesForOrder(orderRef: string): Promise<readonly PolarPaymentFactType[]> {
    return [...this.facts.values()].filter((fact) => fact.providerOrderRef === orderRef).map((fact) => fact.factType);
  }

  async listProviderEventIdsForOrder(orderRef: string): Promise<readonly string[]> {
    return [...this.facts.values()].filter((fact) => fact.providerOrderRef === orderRef).map((fact) => fact.providerEventId);
  }
}

function paymentFact(overrides: Partial<VerifiedPolarPaymentFact> = {}): VerifiedPolarPaymentFact {
  return {
    providerEventId: "evt_synthetic_paid_0001",
    productKey: "resunexx",
    environment: "test",
    factType: "order_paid",
    providerOrderRef: "ord_synthetic_0001",
    providerTransactionRef: "txn_synthetic_0001",
    planKey: "standard",
    currency: "usd",
    amountMinor: 499,
    occurredAt: "2026-07-26T12:00:00.000Z",
    signatureVerified: true,
    adapterVersion: "polar-payment-facts-v1",
    ...overrides
  };
}

test("records a verified payment fact once and reconciles the paid order", async () => {
  const service = new PaymentFactService(new InMemoryPaymentFactStore());
  const fact = paymentFact();
  assert.equal((await service.recordVerifiedPolarFact(fact)).status, "recorded");
  assert.equal((await service.recordVerifiedPolarFact(fact)).status, "duplicate");
  const reconciliation = await service.reconcileOrder(fact.providerOrderRef, [fact.providerEventId]);
  assert.equal(reconciliation.paymentState, "paid");
  assert.deepEqual(reconciliation.missingProviderEventIds, []);
});

test("records an immutable refund fact without overwriting the paid fact", async () => {
  const service = new PaymentFactService(new InMemoryPaymentFactStore());
  const paid = paymentFact();
  const refunded = paymentFact({
    providerEventId: "evt_synthetic_refund_0001",
    factType: "order_refunded",
    providerRefundRef: "ref_synthetic_0001"
  });
  await service.recordVerifiedPolarFact(paid);
  await service.recordVerifiedPolarFact(refunded);
  const reconciliation = await service.reconcileOrder(paid.providerOrderRef, [paid.providerEventId, refunded.providerEventId]);
  assert.equal(reconciliation.paymentState, "refunded");
  assert.deepEqual(reconciliation.recordedFactTypes, ["order_paid", "order_refunded"]);
});

test("rejects unverified facts and production facts before persistence", async () => {
  const service = new PaymentFactService(new InMemoryPaymentFactStore());
  await assert.rejects(() => service.recordVerifiedPolarFact({ ...paymentFact(), signatureVerified: false } as never), /signature-verified/i);
  await assert.rejects(() => service.recordVerifiedPolarFact(paymentFact({ environment: "production" })), /development, test, or staging/i);
});
