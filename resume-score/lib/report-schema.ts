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
  paid: boolean;
  paymentStatus: "unpaid" | "paid";
  requestedPlan?: ReportPlan;
  accessPlan?: ReportPlan;
  purchasedPlan?: "standard" | "full";
  analysisMode: "openai";
  paddleTransactionId?: string;
  report: ResumeReport;
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
