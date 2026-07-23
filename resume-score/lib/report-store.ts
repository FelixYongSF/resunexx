import type { StoredReport } from "@/lib/report-schema";
import { isPaidReportPlan, preparePendingReportPlan, shouldApplyPurchasedPlan, type PaidReportPlan } from "@/lib/report-plan";
import { hasRedisConfig, redisCommand } from "@/lib/redis";
import { canResumePendingCheckout } from "@/lib/payment-flow";

const PROCESSING_REPORT_TTL_SECONDS = configuredTtl("REPORT_PROCESSING_TTL_SECONDS", 60 * 60);
const FREE_REPORT_TTL_SECONDS = configuredTtl("REPORT_FREE_TTL_SECONDS", 24 * 60 * 60);
const PAID_REPORT_TTL_SECONDS = configuredTtl("REPORT_PAID_TTL_SECONDS", 30 * 24 * 60 * 60);

export function hasPersistentReportStore() {
  return hasRedisConfig();
}

export async function saveReport(report: StoredReport) {
  await redisCommand<"OK">([
    "SET",
    `report:${report.id}`,
    JSON.stringify(report),
    "EX",
    getReportTtlSeconds(report)
  ]);
}

export async function getReport(id: string) {
  const value = await redisCommand<string | null>(["GET", `report:${id}`]);
  if (!value) return null;
  const report = JSON.parse(value) as Partial<StoredReport>;
  const accessPlan = report.accessPlan || (report.paid ? "standard" : "free");
  return {
    ...report,
    requestedPlan: report.requestedPlan || "free",
    accessPlan,
    paymentStatus: report.paymentStatus || (report.paid ? "paid" : "unpaid"),
    analysisStatus: report.analysisStatus || (report.report ? "completed" : "failed"),
    eliteEnhancementStatus: report.eliteEnhancementStatus || (accessPlan === "full" ? "completed" : "not_started")
  } as StoredReport;
}

export async function markReportAnalysisFailed(id: string, error: string) {
  const report = await getReport(id);
  if (!report) return null;

  const updated: StoredReport = {
    ...report,
    analysisStatus: "failed",
    analysisError: error,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  return updated;
}

export async function prepareReportForPurchase(id: string, plan: PaidReportPlan) {
  const report = await getReport(id);
  if (!report) throw new Error("Report not found.");

  if (canResumePendingCheckout(report, plan)) return report;
  if (report.analysisStatus === "awaiting_payment") {
    throw new Error("This pending upload belongs to a different plan. Please return to the selected report plan.");
  }

  const prepared = buildPendingPurchaseReport(report, plan);
  if (prepared === report) return report;

  await saveReport(prepared);
  return prepared;
}

export async function claimPaidReportAnalysis(id: string) {
  const locked = await redisCommand<"OK" | null>([
    "SET",
    `report-analysis-lock:${id}`,
    "1",
    "NX",
    "EX",
    120
  ]);
  if (locked !== "OK") return null;

  const report = await getReport(id);
  if (!report || report.analysisStatus !== "awaiting_payment") {
    await redisCommand<number>(["DEL", `report-analysis-lock:${id}`]);
    return null;
  }

  const claimed: StoredReport = {
    ...report,
    analysisStatus: "processing",
    analysisError: undefined,
    updatedAt: new Date().toISOString()
  };
  await saveReport(claimed);
  return claimed;
}

export async function completePaidReportAnalysis(id: string, generatedReport: NonNullable<StoredReport["report"]>) {
  const report = await getReport(id);
  if (!report) throw new Error("Report not found.");

  const completed: StoredReport = {
    ...report,
    analysisInputText: undefined,
    analysisStatus: "completed",
    analysisError: undefined,
    analysisMode: "openai",
    report: generatedReport,
    eliteEnhancementStatus: report.requestedPlan === "full" ? "completed" : "not_started",
    updatedAt: new Date().toISOString()
  };
  await saveReport(completed);
  await redisCommand<number>(["DEL", `report-analysis-lock:${id}`]);
  return completed;
}

export async function markEliteEnhancementProcessing(id: string, targetRole: string, jobDescription?: string) {
  const report = await getReport(id);
  if (!report || report.analysisStatus !== "completed" || !report.report) {
    throw new Error("Completed report not found.");
  }

  const updated: StoredReport = {
    ...report,
    targetRole,
    jobDescription,
    eliteEnhancementStatus: "processing",
    eliteEnhancementError: undefined,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  return updated;
}

export async function completeEliteEnhancement(id: string, enhancedReport: NonNullable<StoredReport["report"]>) {
  const report = await getReport(id);
  if (!report) throw new Error("Report not found.");

  const updated: StoredReport = {
    ...report,
    report: enhancedReport,
    eliteEnhancementStatus: "completed",
    eliteEnhancementError: undefined,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  await redisCommand<number>(["DEL", `report-elite-lock:${id}`]);
  return updated;
}

export async function saveEliteTargetContext(id: string, targetRole: string, jobDescription?: string) {
  const report = await getReport(id);
  if (!report) throw new Error("Report not found.");

  const updated: StoredReport = {
    ...report,
    targetRole,
    jobDescription,
    eliteEnhancementStatus: report.eliteEnhancementStatus === "completed" ? "completed" : "not_started",
    eliteEnhancementError: undefined,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  return updated;
}

export async function claimPaidEliteEnhancement(id: string) {
  const locked = await redisCommand<"OK" | null>([
    "SET",
    `report-elite-lock:${id}`,
    "1",
    "NX",
    "EX",
    120
  ]);
  if (locked !== "OK") return null;

  const report = await getReport(id);
  if (!report || !report.paid || report.accessPlan !== "full" || !report.report || !report.targetRole || report.eliteEnhancementStatus === "completed") {
    await redisCommand<number>(["DEL", `report-elite-lock:${id}`]);
    return null;
  }

  const claimed: StoredReport = {
    ...report,
    eliteEnhancementStatus: "processing",
    eliteEnhancementError: undefined,
    updatedAt: new Date().toISOString()
  };
  await saveReport(claimed);
  return claimed;
}

export async function markEliteEnhancementFailed(id: string, error: string) {
  const report = await getReport(id);
  if (!report) return null;

  const updated: StoredReport = {
    ...report,
    eliteEnhancementStatus: "failed",
    eliteEnhancementError: error,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  return updated;
}

export function buildPendingPurchaseReport(report: StoredReport, plan: PaidReportPlan): StoredReport {
  return preparePendingReportPlan(report, plan);
}

export async function markReportPolarCheckoutCreated(id: string, checkoutId: string) {
  const report = await getReport(id);
  if (!report) throw new Error("Report not found.");

  await saveReport({
    ...report,
    paymentProvider: "polar",
    polarCheckoutId: checkoutId,
    updatedAt: new Date().toISOString()
  });
}

export async function recordPolarOrder(
  id: string,
  order: {
    orderId: string;
    customerEmail?: string;
    amount: number;
    currency: string;
    createdAt: string;
  }
) {
  const report = await getReport(id);
  if (!report) throw new Error("Report not found.");

  const updated: StoredReport = {
    ...report,
    paymentProvider: "polar",
    polarOrderId: order.orderId,
    paymentCustomerEmail: order.customerEmail,
    paymentAmount: order.amount,
    paymentCurrency: order.currency,
    paymentCreatedAt: order.createdAt,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  await redisCommand<"OK">(["SET", `polar-order:${order.orderId}`, id, "EX", PAID_REPORT_TTL_SECONDS]);
  return updated;
}

export async function markReportPaidFromPolar(
  id: string,
  payment: {
    orderId: string;
    purchasedPlan: PaidReportPlan;
    customerEmail?: string;
    amount: number;
    currency: string;
    createdAt: string;
  }
) {
  const report = await getReport(id);
  if (!report) return null;
  if (report.requestedPlan !== payment.purchasedPlan || !isPaidReportPlan(report.requestedPlan)) {
    throw new Error("Paid transaction does not match the report's requested plan.");
  }
  const existingPlan = report.accessPlan || (report.paid ? "standard" : "free");
  if (!shouldApplyPurchasedPlan(existingPlan, payment.purchasedPlan)) {
    return report.polarOrderId === payment.orderId ? report : null;
  }

  const updated = {
    ...report,
    paid: true,
    paymentStatus: "paid" as const,
    analysisStatus: report.analysisStatus,
    accessPlan: payment.purchasedPlan,
    purchasedPlan: payment.purchasedPlan,
    paymentProvider: "polar" as const,
    polarOrderId: payment.orderId,
    paymentCustomerEmail: payment.customerEmail,
    paymentAmount: payment.amount,
    paymentCurrency: payment.currency,
    paymentCreatedAt: payment.createdAt,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  await redisCommand<"OK">(["SET", `polar-order:${payment.orderId}`, id, "EX", PAID_REPORT_TTL_SECONDS]);
  return updated;
}

export async function getReportIdByPolarOrderId(orderId: string) {
  return redisCommand<string | null>(["GET", `polar-order:${orderId}`]);
}

export async function markReportRefundedFromPolar(orderId: string, refundedAt: string) {
  const reportId = await getReportIdByPolarOrderId(orderId);
  if (!reportId) return null;
  const report = await getReport(reportId);
  if (!report || report.polarOrderId !== orderId) return null;

  const updated: StoredReport = {
    ...report,
    paid: false,
    paymentStatus: "refunded",
    accessPlan: "free",
    purchasedPlan: undefined,
    paymentRefundedAt: refundedAt,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  return updated;
}

function getReportTtlSeconds(report: StoredReport) {
  if (report.paid || report.accessPlan === "standard" || report.accessPlan === "full") {
    return PAID_REPORT_TTL_SECONDS;
  }
  if (report.analysisStatus === "awaiting_payment" || report.analysisStatus === "processing") return PROCESSING_REPORT_TTL_SECONDS;
  return FREE_REPORT_TTL_SECONDS;
}

function configuredTtl(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}
