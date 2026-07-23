import { NextResponse } from "next/server";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import {
  getReport,
  saveEliteTargetContext
} from "@/lib/report-store";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const rateLimit = await checkRateLimit({
      key: `elite-enhancement:${getRequestIp(request)}:${id}`,
      limit: 5,
      windowMs: 60 * 60 * 1000
    });
    if (!rateLimit.available) {
      return NextResponse.json({ error: "ELITE preparation is temporarily unavailable. Please try again later." }, { status: 503 });
    }
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many ELITE preparation attempts. Please wait and try again." }, { status: 429 });
    }

    const body = (await request.json()) as { targetRole?: unknown; jobDescription?: unknown };
    const targetRole = requiredText(body.targetRole, 160, "Target Role / Job Title");
    const jobDescription = optionalText(body.jobDescription, 8_000, "Job Description");
    const existing = await getReport(id);

    if (!existing) {
      return NextResponse.json({ error: "We couldn't find this resume analysis." }, { status: 404 });
    }

    if (existing.targetRole === targetRole && existing.jobDescription === jobDescription) {
      return NextResponse.json({ ready: true });
    }

    // This only stores the requested role. The ELITE analysis itself is generated
    // after Polar confirms payment, never while checkout is still pending.
    await saveEliteTargetContext(id, targetRole, jobDescription);
    return NextResponse.json({ ready: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ELITE preparation failed.";
    console.error("[elite-enhancement] failed", { reportId: id, message });
    const isInputError = message.includes("required") || message.includes("too long");
    return NextResponse.json(
      { error: isInputError ? message : "We couldn't prepare the ELITE report right now. Please try again." },
      { status: isInputError ? 400 : 500 }
    );
  }
}

function requiredText(value: unknown, maxLength: number, label: string) {
  const text = optionalText(value, maxLength, label);
  if (!text) throw new Error(`${label} is required for ELITE.`);
  return text;
}

function optionalText(value: unknown, maxLength: number, label: string) {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  if (!text) return undefined;
  if (text.length > maxLength) throw new Error(`${label} is too long. Please shorten it and try again.`);
  return text;
}
