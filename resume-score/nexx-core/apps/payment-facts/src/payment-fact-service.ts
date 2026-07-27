import { CORE_ENVIRONMENTS } from "../../../packages/contracts/src/index.ts";
import { type PaymentFactStore } from "./payment-fact-store.ts";
import { POLAR_PAYMENT_FACT_TYPES, type PaymentFactReconciliation, type PaymentFactRecordResult, type VerifiedPolarPaymentFact } from "./types.ts";

const OPAQUE_REFERENCE = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{7,127}$/;
const NON_PRODUCTION_ENVIRONMENTS = new Set(["development", "test", "staging"]);

function assertVerifiedDevelopmentFact(fact: VerifiedPolarPaymentFact): void {
  if (fact.signatureVerified !== true) throw new Error("Only signature-verified payment facts may be recorded.");
  if (!CORE_ENVIRONMENTS.includes(fact.environment) || !NON_PRODUCTION_ENVIRONMENTS.has(fact.environment)) {
    throw new Error("Payment-fact recording is permitted only in development, test, or staging during Phase 1.");
  }
  if (!POLAR_PAYMENT_FACT_TYPES.includes(fact.factType)) throw new Error("Unsupported Polar payment fact type.");
  if (fact.productKey !== "resunexx" || !["standard", "full"].includes(fact.planKey)) {
    throw new Error("Payment fact does not match an approved ResuNexx paid plan.");
  }
  if (![fact.providerEventId, fact.providerOrderRef, fact.providerTransactionRef, fact.providerRefundRef].filter(Boolean).every((value) => OPAQUE_REFERENCE.test(value!))) {
    throw new Error("Payment fact contains an invalid provider reference.");
  }
  if (!Number.isFinite(Date.parse(fact.occurredAt)) || (fact.amountMinor !== undefined && (!Number.isInteger(fact.amountMinor) || fact.amountMinor < 0))) {
    throw new Error("Payment fact has an invalid timestamp or amount.");
  }
}

export class PaymentFactService {
  private readonly store: PaymentFactStore;

  constructor(store: PaymentFactStore) {
    this.store = store;
  }

  async recordVerifiedPolarFact(fact: VerifiedPolarPaymentFact): Promise<PaymentFactRecordResult> {
    assertVerifiedDevelopmentFact(fact);
    return { status: await this.store.appendVerifiedFact(fact), providerEventId: fact.providerEventId };
  }

  async reconcileOrder(providerOrderRef: string, expectedProviderEventIds: readonly string[]): Promise<PaymentFactReconciliation> {
    if (!OPAQUE_REFERENCE.test(providerOrderRef)) throw new Error("Invalid provider order reference.");
    const [types, recordedIds] = await Promise.all([
      this.store.listFactTypesForOrder(providerOrderRef),
      this.store.listProviderEventIdsForOrder(providerOrderRef)
    ]);
    const paymentState = types.includes("order_refunded")
      ? "refunded"
      : types.includes("order_paid")
        ? "paid"
        : types.includes("order_created")
          ? "created"
          : "unknown";
    return {
      providerOrderRef,
      recordedFactTypes: types,
      paymentState,
      missingProviderEventIds: expectedProviderEventIds.filter((eventId) => !recordedIds.includes(eventId))
    };
  }
}
