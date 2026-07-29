import type { ResumeReport } from "./report-schema";
import type { ReportPlan } from "./report-plan";
import type { ReportApplicant } from "./report-engine";
import { renderHtmlReportPdf } from "./report-engine/html-pdf-renderer";

export async function reportToPdf(
  report: ResumeReport,
  accessPlan: Extract<ReportPlan, "standard" | "full"> = "standard",
  applicant?: ReportApplicant
) {
  return renderHtmlReportPdf(report, accessPlan, applicant);
}
