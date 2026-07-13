import {
  appUrl,
  assertPaddleCheckoutConfig,
  getPaddleEnvironment,
  getPaddlePriceIdFromTransaction,
  getPaddleTransaction,
  getPaidPlanFromPaddleTransaction,
  isPaidPaddleTransaction
} from "@/lib/paddle";
import { getConfiguredPaddlePriceId, hasPlanAccess, type PaidReportPlan } from "@/lib/report-plan";
import { getReport, hasPersistentReportStore, markReportPaid } from "@/lib/report-store";

export type CheckoutRequest = {
  reportId: string;
  plan: PaidReportPlan;
};

export type VerifiedPayment = {
  reportId: string;
  transactionId: string;
  purchasedPlan: PaidReportPlan;
  paddlePriceId: string;
};

export async function createCheckout({ reportId, plan }: CheckoutRequest) {
  const report = await getReport(reportId);
  if (!report) throw new Error("Report not found.");
  if (report.requestedPlan !== plan) {
    throw new Error("This report was created for a different plan. Return to pricing to choose a new plan.");
  }

  const currentPlan = report.accessPlan || (report.paid ? "standard" : "free");
  if (hasPlanAccess(currentPlan, plan)) throw new Error("This report plan is already unlocked.");

  assertPaddleCheckoutConfig(plan);
  if (process.env.NODE_ENV === "production" && !hasPersistentReportStore()) {
    throw new Error("Production report storage is not configured, so payment cannot be accepted safely.");
  }

  return {
    provider: "paddle" as const,
    environment: getPaddleEnvironment(),
    clientToken: process.env.PADDLE_CLIENT_TOKEN || "",
    priceId: getConfiguredPaddlePriceId(plan),
    successUrl: `${appUrl()}/success?report_id=${reportId}`,
    customData: { reportId, selectedPlan: plan }
  };
}

export async function verifyTransaction(transactionId: string, expectedReportId?: string): Promise<VerifiedPayment> {
  const transaction = await getPaddleTransaction(transactionId);
  const reportId = transaction.custom_data?.reportId;
  const purchasedPlan = getPaidPlanFromPaddleTransaction(transaction);
  const paddlePriceId = getPaddlePriceIdFromTransaction(transaction);

  if (!reportId || (expectedReportId && reportId !== expectedReportId)) {
    throw new Error("Paddle transaction does not match this report.");
  }
  if (!purchasedPlan || !paddlePriceId || !isPaidPaddleTransaction(transaction, reportId)) {
    throw new Error("Paddle transaction is not an eligible completed payment.");
  }

  return { reportId, transactionId: transaction.id, purchasedPlan, paddlePriceId };
}

export async function unlockEntitlement(payment: VerifiedPayment) {
  const existingReport = await getReport(payment.reportId);
  if (!existingReport) throw new Error("Matching report was not found.");
  if (existingReport.requestedPlan !== payment.purchasedPlan) {
    throw new Error("Payment plan does not match the requested report plan.");
  }

  const currentPlan = existingReport.accessPlan || (existingReport.paid ? "standard" : "free");
  if (hasPlanAccess(currentPlan, payment.purchasedPlan)) {
    return { report: existingReport, alreadyUnlocked: true };
  }

  const report = await markReportPaid(
    payment.reportId,
    payment.transactionId,
    payment.purchasedPlan,
    payment.paddlePriceId
  );
  if (!report) throw new Error("Matching report was not found.");

  return { report, alreadyUnlocked: false };
}
