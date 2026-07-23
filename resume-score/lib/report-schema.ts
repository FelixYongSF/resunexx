import {
  buildFreePreview,
  ResumeReport,
  ScoringCategory,
  resumeReportJsonSchema
} from "@/lib/engines/resume";
import type { ReportPlan } from "@/lib/report-plan";

export type { Recommendation, ResumeReport, ScoringCategory, SectionFeedback } from "@/lib/engines/resume";

export type StoredReport = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fileName: string;
  resumeTextHash: string;
  resumeTextPreview: string;
  // Kept only while a paid checkout is pending so a verified payment can start analysis.
  // It is removed as soon as the report has been generated.
  analysisInputText?: string;
  paid: boolean;
  paymentStatus: "unpaid" | "not_required" | "pending" | "paid" | "refunded";
  requestedPlan: ReportPlan;
  accessPlan: ReportPlan;
  analysisStatus: "awaiting_payment" | "processing" | "completed" | "failed";
  analysisError?: string;
  targetRole?: string;
  jobDescription?: string;
  eliteEnhancementStatus?: "not_started" | "processing" | "completed" | "failed";
  eliteEnhancementError?: string;
  purchasedPlan?: "standard" | "full";
  analysisMode?: "openai";
  paymentProvider?: "polar";
  polarCheckoutId?: string;
  polarOrderId?: string;
  paymentCustomerEmail?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentCreatedAt?: string;
  paymentRefundedAt?: string;
  report?: ResumeReport;
};

export { resumeReportJsonSchema };

export function toPreview(report: ResumeReport) {
  const preview = buildFreePreview(report);

  return {
    engineVersion: report.engineVersion,
    overallScore: preview.overallScore,
    atsCompatibilityScore: preview.atsReadinessScore,
    interviewReadinessLevel: preview.interviewReadinessLevel,
    topIssues: preview.top3Issues
  };
}
