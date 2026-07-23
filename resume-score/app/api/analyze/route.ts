import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { analyzeResumeWithEngine } from "@/lib/resumeEngine";
import { extractResumeText } from "@/lib/file-extraction";
import { trackServerEvent } from "@/lib/analytics";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { markReportAnalysisFailed, saveReport } from "@/lib/report-store";
import { toPreview, StoredReport } from "@/lib/report-schema";
import { getRequestedReportPlan, type ReportPlan } from "@/lib/report-plan";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const requestStartedAt = Date.now();
  let step = "request:start";
  let processingReportId = "";

  try {
    console.info(`[analyze:${requestId}] request received`);

    step = "request:rate-limit";
    const rateLimit = await checkRateLimit({
      key: `analyze:${getRequestIp(request)}`,
      limit: 80,
      windowMs: 60 * 60 * 1000
    });
    if (!rateLimit.available) {
      return fail(requestId, step, "Resume analysis is temporarily unavailable. Please try again later.", 503);
    }
    if (!rateLimit.allowed) {
      return fail(requestId, step, "Too many resume analysis attempts. Please wait a little and try again.", 429);
    }

    step = "request:form-data";
    const formData = await request.formData();
    const file = formData.get("resume");
    const requestedPlanValue = formData.get("selectedPlan");
    const submittedReportId = formData.get("reportId");
    const requestedPlan: ReportPlan = getRequestedReportPlan(requestedPlanValue);
    if (requestedPlan !== "free") {
      console.info(`[analyze:${requestId}] paid analysis request rejected before processing`);
      return NextResponse.json(
        {
          error: "Paid reports are generated only after secure payment verification.",
          step: "request:paid-plan-blocked",
          requestId
        },
        { status: 403 }
      );
    }
    const fullPlanContext = { targetRole: undefined, jobDescription: undefined };

    if (!(file instanceof File)) {
      return fail(requestId, step, "Please upload a PDF or DOCX resume.", 400);
    }

    console.info(`[analyze:${requestId}] file received`, {
      type: file.type,
      size: file.size
    });

    step = "upload:validate-file";
    if (file.size > 4 * 1024 * 1024) {
      return fail(requestId, step, "Please upload a resume file smaller than 4MB.", 400);
    }

    step = "file:extract-text";
    const parsingStartedAt = Date.now();
    const parsed = await extractResumeText(file);
    const resumeText = parsed.text;
    const parsingDurationMs = Date.now() - parsingStartedAt;

    console.info(`[analyze:${requestId}] resume file parsed`, {
      durationMs: parsingDurationMs,
      fileType: parsed.fileType,
      extractionMethod: parsed.extractionMethod,
      warnings: parsed.warnings,
      extractedCharacters: resumeText.length
    });

    step = "file:validate-text";
    if (resumeText.length < 400) {
      return fail(
        requestId,
        step,
        `Text extraction succeeded but only found ${resumeText.length} characters. Please try a text-based PDF or DOCX resume.`,
        400
      );
    }

    const id = isReportId(submittedReportId) ? submittedReportId : crypto.randomUUID();
    processingReportId = id;
    const stored: StoredReport = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileName: file.name,
      resumeTextHash: createHash("sha256").update(resumeText).digest("hex"),
      resumeTextPreview: resumeText.slice(0, 700),
      paid: false,
      paymentStatus: requestedPlan === "free" ? "not_required" : "pending",
      requestedPlan,
      accessPlan: "free",
      analysisStatus: "processing",
      targetRole: fullPlanContext.targetRole,
      jobDescription: fullPlanContext.jobDescription,
      eliteEnhancementStatus: "not_started"
    };

    step = "storage:save-processing-report";
    await saveReport(stored);

    step = "engine:analyze-resume";
    const engineStartedAt = Date.now();
    console.info(`[analyze:${requestId}] running resume engine`, {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      inputCharacters: resumeText.length
    });

    const report = await analyzeResumeWithEngine({ resumeText });
    const engineDurationMs = Date.now() - engineStartedAt;
    console.info(`[analyze:${requestId}] resume engine analysis returned`, {
      durationMs: engineDurationMs,
      engineVersion: report.engineVersion,
      overallScore: report.overallScore
    });

    step = "storage:save-report";
    const storageStartedAt = Date.now();
    await saveReport({
      ...stored,
      analysisStatus: "completed",
      analysisMode: "openai",
      eliteEnhancementStatus: "not_started",
      report,
      updatedAt: new Date().toISOString()
    });
    const storageDurationMs = Date.now() - storageStartedAt;
    console.info(`[analyze:${requestId}] report saved`, {
      reportId: id,
      requestedPlan,
      storageDurationMs,
      totalDurationMs: Date.now() - requestStartedAt
    });
    trackServerEvent({
      event: "analysis_completed",
      reportId: id,
      source: "api_analyze",
      metadata: {
        durationMs: Date.now() - requestStartedAt,
        engineVersion: report.engineVersion,
        overallScore: report.overallScore
      }
    });

    return NextResponse.json({
      id,
      preview: toPreview(report)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resume analysis failed.";
    const userMessage = getUserFacingError(step, message);
    const status = step.startsWith("file:") || step === "request:full-plan-context" ? 400 : 500;

    console.error(`[analyze:${requestId}] failed at ${step}`, {
      error,
      userMessage
    });

    if (processingReportId) {
      try {
        await markReportAnalysisFailed(processingReportId, userMessage);
      } catch (storageError) {
        console.error(`[analyze:${requestId}] could not persist analysis failure`, {
          message: storageError instanceof Error ? storageError.message : "Unknown storage error."
        });
      }
    }

    return fail(requestId, step, userMessage, status, message);
  }
}

function isReportId(value: FormDataEntryValue | null): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function readFullPlanContext(formData: FormData) {
  return {
    targetRole: readRequiredText(formData.get("targetRole"), 160, "Target role"),
    jobDescription: readOptionalText(formData.get("jobDescription"), 8_000, "Job description")
  };
}

function readRequiredText(value: FormDataEntryValue | null, maxLength: number, label: string) {
  const text = readOptionalText(value, maxLength, label);
  if (!text) throw new Error(`${label} is required for ELITE.`);
  return text;
}

function readOptionalText(value: FormDataEntryValue | null, maxLength: number, label: string) {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  if (!text) return undefined;
  if (text.length > maxLength) throw new Error(`${label} is too long. Please shorten it and try again.`);
  return text;
}

function fail(requestId: string, step: string, error: string, status: number, details?: string) {
  console.error(`[analyze:${requestId}] ${step} failed: ${details || error}`);

  return NextResponse.json(
    {
      error,
      step,
      requestId
    },
    { status }
  );
}

function getUserFacingError(step: string, message: string) {
  if (step === "engine:analyze-resume" && message.includes("OPENAI_API_KEY is not configured")) {
    return "Resume analysis is temporarily unavailable. Please try again later.";
  }

  if (step === "engine:analyze-resume" && isOpenAiQuotaError(message)) {
    return "Resume analysis is temporarily unavailable. Please try again later.";
  }

  if (step === "engine:analyze-resume" && message.includes("unexpected report format")) {
    return "We couldn't complete the resume analysis. Please try again.";
  }

  if (step === "engine:analyze-resume" && isAiConnectivityError(message)) {
    return "We couldn't analyze your resume right now. Please try again.";
  }

  if (step === "file:extract-text") {
    if (message.includes("Image resume upload is experimental")) return message;
    if (message.includes("PDF or DOCX")) return message;
    if (message.includes("Unsupported file type")) return message;
    if (message.includes("4MB")) return message;
    return "Text extraction failed. Please upload a text-based PDF or DOCX resume for best results.";
  }

  if (step.startsWith("storage:")) {
    return "We couldn't save this analysis right now. Please try again.";
  }

  return message;
}

function isAiConnectivityError(message: string) {
  return [
    "Connection error",
    "Request timed out",
    "ETIMEDOUT",
    "ENOTFOUND",
    "ECONNRESET",
    "EAI_AGAIN"
  ].some((fragment) => message.includes(fragment));
}

function isOpenAiQuotaError(message: string) {
  return ["insufficient_quota", "exceeded your current quota", "status 429"].some((fragment) =>
    message.includes(fragment)
  );
}
