import { NextResponse } from "next/server";
import { isPaidReportPlan, type PaidReportPlan } from "@/lib/report-plan";
import { createCheckout } from "@/lib/payment";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let selectedPlan: PaidReportPlan | "unknown" = "unknown";

  try {
    const rateLimit = await checkRateLimit({
      key: `checkout:${getRequestIp(request)}`,
      limit: 30,
      windowMs: 60 * 60 * 1000
    });
    if (!rateLimit.available) {
      return NextResponse.json({ error: "Checkout is temporarily unavailable. Please try again later." }, { status: 503 });
    }
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many checkout attempts. Please wait a little and try again." }, { status: 429 });
    }

    const { reportId, plan: bodyPlan } = (await request.json()) as { reportId?: string; plan?: unknown };
    const plan = new URL(request.url).searchParams.get("plan") || bodyPlan;
    if (!reportId) return NextResponse.json({ error: "Missing reportId." }, { status: 400 });
    if (!isPaidReportPlan(plan)) return NextResponse.json({ error: "Please choose a valid paid report plan." }, { status: 400 });
    selectedPlan = plan;

    return NextResponse.json(await createCheckout({ reportId, plan: selectedPlan }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start checkout.";
    console.error("[polar:checkout] request failed", {
      message,
      hasAccessToken: Boolean(process.env.POLAR_ACCESS_TOKEN),
      selectedPlan,
      hasStandardProductId: Boolean(process.env.POLAR_STANDARD_PRODUCT_ID),
      hasFullProductId: Boolean(process.env.POLAR_FULL_PRODUCT_ID),
      appUrlConfigured: Boolean(process.env.NEXT_PUBLIC_APP_URL)
    });
    const userMessage = getCheckoutUserMessage(message);

    return NextResponse.json(
      { error: userMessage },
      { status: isConfigurationError(message) ? 503 : isCheckoutInputError(message) ? 400 : 500 }
    );
  }
}

function getCheckoutUserMessage(message: string) {
  if (isConfigurationError(message)) {
    return "Checkout is temporarily unavailable. Please try again later.";
  }
  if (message.includes("Report not found")) {
    return "We couldn't find this resume analysis. Please upload your resume again.";
  }
  if (message.includes("different plan")) {
    return "This analysis belongs to a different plan. Please choose your report plan and upload again.";
  }
  if (message.includes("already unlocked")) {
    return "This report is already unlocked. You can open it from your report page.";
  }
  if (message.includes("target-role details are required")) {
    return "Add a target role before unlocking the ELITE report.";
  }
  return "We couldn't open checkout right now. Please try again.";
}

function isConfigurationError(message: string) {
  return message.includes("Polar is not configured") || message.includes("storage is not configured");
}

function isCheckoutInputError(message: string) {
  return message.includes("Report not found") ||
    message.includes("different plan") ||
    message.includes("already unlocked") ||
    message.includes("target-role details are required");
}
