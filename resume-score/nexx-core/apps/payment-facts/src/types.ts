import type { CoreEnvironment } from "../../../packages/contracts/src/index.ts";

export const POLAR_PAYMENT_FACT_TYPES = [
  "order_created",
  "order_paid",
  "order_refunded",
  "refund_created",
  "refund_updated"
] as const;

export type PolarPaymentFactType = (typeof POLAR_PAYMENT_FACT_TYPES)[number];
export type PaymentPlanKey = "standard" | "full";

/** A minimized fact produced only after a provider webhook has been verified. */
export type VerifiedPolarPaymentFact = Readonly<{
  providerEventId: string;
  productKey: "resunexx";
  environment: CoreEnvironment;
  factType: PolarPaymentFactType;
  providerOrderRef: string;
  providerTransactionRef?: string;
  providerRefundRef?: string;
  planKey: PaymentPlanKey;
  currency?: "usd";
  amountMinor?: number;
  occurredAt: string;
  receivedAt?: string;
  signatureVerified: true;
  adapterVersion: "polar-payment-facts-v1";
}>;

export type PaymentFactRecordResult = Readonly<{
  status: "recorded" | "duplicate";
  providerEventId: string;
}>;

export type PaymentFactReconciliation = Readonly<{
  providerOrderRef: string;
  recordedFactTypes: readonly PolarPaymentFactType[];
  paymentState: "created" | "paid" | "refunded" | "unknown";
  missingProviderEventIds: readonly string[];
}>;
