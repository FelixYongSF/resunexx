import { analyzeResumeWithEngine } from "@/lib/resumeEngine";
import { enhanceEliteReport } from "@/lib/engines/resume";
import { trackServerEvent } from "@/lib/analytics";
import {
  claimPaidReportAnalysis,
  claimPaidEliteEnhancement,
  completeEliteEnhancement,
  completePaidReportAnalysis,
  getReport,
  markReportAnalysisFailed
} from "@/lib/report-store";
import { canRunVerifiedPaidAnalysis } from "@/lib/payment-flow";

export async function runVerifiedPaidReportAnalysis(reportId: string) {
  const report = await getReport(reportId);
  if (!report) throw new Error("Matching report was not found.");

  if (report.analysisStatus === "completed" && report.report) {
    if (report.requestedPlan === "full" && report.eliteEnhancementStatus !== "completed") {
      return runVerifiedEliteEnhancement(reportId);
    }
    return { status: "completed" as const, started: false };
  }

  const plan = report.requestedPlan;
  if ((plan !== "standard" && plan !== "full") || !canRunVerifiedPaidAnalysis(report, plan)) {
    if (report.analysisStatus === "processing") return { status: "processing" as const, started: false };
    throw new Error("Verified payment does not have an eligible pending report.");
  }

  const claimed = await claimPaidReportAnalysis(reportId);
  if (!claimed) return { status: "processing" as const, started: false };

  try {
    const startedAt = Date.now();
    const generated = await analyzeResumeWithEngine({
      resumeText: claimed.analysisInputText || "",
      targetRole: claimed.targetRole
    });

    await completePaidReportAnalysis(reportId, generated);
    trackServerEvent({
      event: "analysis_completed",
      reportId,
      source: "polar_verified_payment",
      metadata: {
        durationMs: Date.now() - startedAt,
        engineVersion: generated.engineVersion,
        purchasedPlan: plan
      }
    });
    return { status: "completed" as const, started: true };
  } catch (error) {
    const userMessage = "We couldn't generate your paid report right now. Please contact support with your payment confirmation.";
    await markReportAnalysisFailed(reportId, userMessage);
    throw error;
  }
}

async function runVerifiedEliteEnhancement(reportId: string) {
  const claimed = await claimPaidEliteEnhancement(reportId);
  if (!claimed) return { status: "processing" as const, started: false };

  try {
    const enhanced = await enhanceEliteReport(
      claimed.report!,
      claimed.targetRole!,
      claimed.jobDescription
    );
    await completeEliteEnhancement(reportId, enhanced);
    return { status: "completed" as const, started: true };
  } catch (error) {
    await markReportAnalysisFailed(
      reportId,
      "We couldn't generate your ELITE report right now. Please contact support with your payment confirmation."
    );
    throw error;
  }
}
