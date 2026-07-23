import type { PaidReportPlan, ReportPlan } from "@/lib/report-plan";

type PendingReport = {
  paid: boolean;
  paymentStatus: "unpaid" | "not_required" | "pending" | "paid" | "refunded";
  requestedPlan: ReportPlan;
  accessPlan: ReportPlan;
  analysisStatus: "awaiting_payment" | "processing" | "completed" | "failed";
  analysisInputText?: string;
};

export function getUploadSubmissionMode(plan: ReportPlan) {
  return plan === "free" ? "analyze" : "prepare_checkout";
}

export function canResumePendingCheckout(report: PendingReport, plan: PaidReportPlan) {
  return (
    report.requestedPlan === plan &&
    report.paymentStatus === "pending" &&
    report.analysisStatus === "awaiting_payment" &&
    Boolean(report.analysisInputText)
  );
}

export function canRunVerifiedPaidAnalysis(report: PendingReport, plan: PaidReportPlan) {
  return (
    report.paid &&
    report.paymentStatus === "paid" &&
    report.requestedPlan === plan &&
    report.accessPlan === plan &&
    report.analysisStatus === "awaiting_payment" &&
    Boolean(report.analysisInputText)
  );
}
