import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { extractResumeText } from "@/lib/file-extraction";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { hasPersistentReportStore, saveReport } from "@/lib/report-store";
import { isPaidReportPlan, type PaidReportPlan } from "@/lib/report-plan";
import type { StoredReport } from "@/lib/report-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit({
      key: `pending-paid-upload:${getRequestIp(request)}`,
      limit: 30,
      windowMs: 60 * 60 * 1000
    });
    if (!rateLimit.available) {
      return NextResponse.json({ error: "Secure checkout is temporarily unavailable. Please try again later." }, { status: 503 });
    }
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many upload attempts. Please wait a little and try again." }, { status: 429 });
    }
    if (process.env.NODE_ENV === "production" && !hasPersistentReportStore()) {
      return NextResponse.json({ error: "Secure checkout is temporarily unavailable. Please try again later." }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get("resume");
    const planValue = formData.get("selectedPlan");
    const plan = isPaidReportPlan(planValue) ? planValue : null;
    if (!plan) return NextResponse.json({ error: "Please choose a valid paid report plan." }, { status: 400 });
    if (!(file instanceof File)) return NextResponse.json({ error: "Please upload a PDF or DOCX resume." }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Please upload a resume file smaller than 4MB." }, { status: 400 });
    }

    const targetRole = plan === "full" ? readRequiredText(formData.get("targetRole"), 160, "Target role") : undefined;
    const jobDescription = plan === "full" ? readOptionalText(formData.get("jobDescription"), 8_000, "Job description") : undefined;
    const parsed = await extractResumeText(file);
    if (parsed.text.length < 400) {
      return NextResponse.json(
        { error: `Text extraction succeeded but only found ${parsed.text.length} characters. Please try a text-based PDF or DOCX resume.` },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const pending: StoredReport = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileName: file.name,
      resumeTextHash: createHash("sha256").update(parsed.text).digest("hex"),
      resumeTextPreview: parsed.text.slice(0, 700),
      analysisInputText: parsed.text,
      paid: false,
      paymentStatus: "pending",
      requestedPlan: plan,
      accessPlan: "free",
      analysisStatus: "awaiting_payment",
      targetRole,
      jobDescription,
      eliteEnhancementStatus: "not_started"
    };
    await saveReport(pending);

    return NextResponse.json({ id, plan, analysisStatus: pending.analysisStatus });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not prepare secure checkout.";
    console.error("[pending-paid-report] failed", { message });
    const inputError = message.includes("required") || message.includes("too long") || message.includes("PDF") || message.includes("DOCX");
    return NextResponse.json(
      { error: inputError ? message : "We couldn't prepare your secure checkout right now. Please try again." },
      { status: inputError ? 400 : 500 }
    );
  }
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
