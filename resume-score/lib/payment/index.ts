import type { PaidReportPlan } from "@/lib/report-plan";
import {
  createPolarCheckout,
  getPolarOrderReportId,
  getPolarPlanForProductId,
  isPaidPolarOrder,
  type PolarOrderRecord
} from "@/lib/polar";
import {
  getReport,
  hasPersistentReportStore,
  markReportPaidFromPolar,
  markReportPolarCheckoutCreated,
  prepareReportForPurchase
} from "@/lib/report-store";
import { runVerifiedPaidReportAnalysis } from "@/lib/paid-report-analysis";

export type CheckoutRequest = {
  reportId: string;
  plan: PaidReportPlan;
};

export type PolarPayment = {
  reportId: string;
  orderId: string;
  purchasedPlan: PaidReportPlan;
  customerEmail?: string;
  amount: number;
  currency: string;
  createdAt: string;
};

export async function createCheckout({ reportId, plan }: CheckoutRequest) {
  await prepareReportForPurchase(reportId, plan);
  if (process.env.NODE_ENV === "production" && !hasPersistentReportStore()) {
    throw new Error("Production report storage is not configured, so payment cannot be accepted safely.");
  }

  const checkout = await createPolarCheckout({ reportId, plan });
  await markReportPolarCheckoutCreated(reportId, checkout.checkoutId);

  return { provider: "polar" as const, checkoutUrl: checkout.checkoutUrl, checkoutId: checkout.checkoutId };
}

export function getPaymentFromPolarOrder(order: PolarOrderRecord): PolarPayment {
  const reportId = getPolarOrderReportId(order);
  const purchasedPlan = getPolarPlanForProductId(order.productId);
  if (!reportId || !purchasedPlan || !isPaidPolarOrder(order)) {
    throw new Error("Polar order is not an eligible completed payment.");
  }

  return {
    reportId,
    orderId: order.id,
    purchasedPlan,
    customerEmail: order.customer.email || undefined,
    amount: order.totalAmount,
    currency: order.currency,
    createdAt: order.createdAt.toISOString()
  };
}

export async function unlockPolarEntitlement(payment: PolarPayment) {
  const existingReport = await getReport(payment.reportId);
  if (!existingReport) throw new Error("Matching report was not found.");
  if (existingReport.requestedPlan !== payment.purchasedPlan) {
    throw new Error("Payment plan does not match the requested report plan.");
  }

  const alreadyUnlocked =
    existingReport.paid &&
    existingReport.accessPlan === payment.purchasedPlan &&
    existingReport.polarOrderId === payment.orderId;

  const report = await markReportPaidFromPolar(payment.reportId, payment);
  if (!report) throw new Error("Matching report was not found.");
  const analysis = await runVerifiedPaidReportAnalysis(payment.reportId);
  return { report, alreadyUnlocked, analysis };
}
