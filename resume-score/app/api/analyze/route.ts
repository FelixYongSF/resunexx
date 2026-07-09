import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { analyzeResumeWithEngine } from "@/lib/resumeEngine";
import { extractResumeText } from "@/lib/file-extraction";
import { saveReport } from "@/lib/report-store";
import { toPreview, StoredReport } from "@/lib/report-schema";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  let step = "request:start";

  try {
    console.info(`[analyze:${requestId}] request received`);

    step = "request:form-data";
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return fail(requestId, step, "Please upload a PDF or DOCX resume.", 400);
    }

    console.info(`[analyze:${requestId}] file received`, {
      name: file.name,
      type: file.type,
      size: file.size
    });

    step = "upload:validate-file";
    if (file.size > 4 * 1024 * 1024) {
      return fail(requestId, step, "Please upload a resume file smaller than 4MB.", 400);
    }

    step = "file:extract-text";
    const parsed = await extractResumeText(file);
    const resumeText = parsed.text;

    console.info(`[analyze:${requestId}] resume file parsed`, {
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

    step = "engine:analyze-resume";
    console.info(`[analyze:${requestId}] running resume engine`, {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      inputCharacters: resumeText.length
    });

    const report = await analyzeResumeWithEngine({ resumeText });
    console.info(`[analyze:${requestId}] resume engine analysis returned`, {
      engineVersion: report.engineVersion,
      overallScore: report.overallScore
    });

    const id = crypto.randomUUID();

    const stored: StoredReport = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileName: file.name,
      resumeTextHash: createHash("sha256").update(resumeText).digest("hex"),
      resumeTextPreview: resumeText.slice(0, 700),
      paid: false,
      paymentStatus: "unpaid",
      analysisMode: "openai",
      report
    };

    step = "storage:save-report";
    await saveReport(stored);
    console.info(`[analyze:${requestId}] report saved`, { reportId: id });

    return NextResponse.json({
      id,
      preview: toPreview(report)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resume analysis failed.";
    const userMessage = getUserFacingError(step, message);
    const status = step.startsWith("file:") ? 400 : 500;

    console.error(`[analyze:${requestId}] failed at ${step}`, {
      error,
      userMessage
    });

    return fail(requestId, step, userMessage, status, message);
  }
}

function fail(requestId: string, step: string, error: string, status: number, details?: string) {
  console.error(`[analyze:${requestId}] ${step} failed: ${details || error}`);

  return NextResponse.json(
    {
      error,
      step,
      requestId,
      details
    },
    { status }
  );
}

function getUserFacingError(step: string, message: string) {
  if (step === "engine:analyze-resume" && message.includes("OPENAI_API_KEY is not configured")) {
    return "AI analysis is not configured yet. Please add an OpenAI API key before using real analysis.";
  }

  if (step === "engine:analyze-resume" && isOpenAiQuotaError(message)) {
    return "OpenAI API quota exceeded. Please check your OpenAI billing or use another API key.";
  }

  if (step === "engine:analyze-resume" && message.includes("unexpected report format")) {
    return "AI analysis returned an unexpected format. Please try again.";
  }

  if (step === "engine:analyze-resume" && isAiConnectivityError(message)) {
    return "Unable to connect to AI service. Please try again later.";
  }

  if (step === "file:extract-text") {
    if (message.includes("Image resume upload is experimental")) return message;
    if (message.includes("PDF or DOCX")) return message;
    if (message.includes("Unsupported file type")) return message;
    if (message.includes("4MB")) return message;
    return "Text extraction failed. Please upload a text-based PDF or DOCX resume for best results.";
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
