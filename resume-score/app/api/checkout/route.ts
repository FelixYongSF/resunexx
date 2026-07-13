import { NextResponse } from "next/server";
import { getConfiguredPaddlePriceId, isPaidReportPlan, type PaidReportPlan } from "@/lib/report-plan";
import { createCheckout } from "@/lib/payment";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let selectedPlan: PaidReportPlan | "unknown" = "unknown";

  try {
    const rateLimit = checkRateLimit({
      key: `checkout:${getRequestIp(request)}`,
      limit: 30,
      windowMs: 60 * 60 * 1000
    });
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many checkout attempts. Please wait a little and try again." }, { status: 429 });
    }

    const { reportId, plan } = (await request.json()) as { reportId?: string; plan?: unknown };
    if (!reportId) return NextResponse.json({ error: "Missing reportId." }, { status: 400 });
    if (!isPaidReportPlan(plan)) return NextResponse.json({ error: "Please choose a valid paid report plan." }, { status: 400 });
    selectedPlan = plan;

    return NextResponse.json(await createCheckout({ reportId, plan: selectedPlan }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start Paddle Checkout.";
    console.error("[paddle:checkout] request failed", {
      message,
      hasApiKey: Boolean(process.env.PADDLE_API_KEY),
      hasClientToken: Boolean(process.env.PADDLE_CLIENT_TOKEN),
      selectedPlan,
      hasStandardPriceId: Boolean(getConfiguredPaddlePriceId("standard")),
      hasFullPriceId: Boolean(getConfiguredPaddlePriceId("full")),
      appUrlConfigured: Boolean(process.env.NEXT_PUBLIC_APP_URL)
    });
    const userMessage = getCheckoutUserMessage(message);

    return NextResponse.json(
      { error: userMessage },
      { status: message.includes("Paddle is not configured") || message.includes("storage is not configured") ? 503 : 500 }
    );
  }
}

function getCheckoutUserMessage(message: string) {
  if (message.includes("Paddle is not configured") || message.includes("storage is not configured")) {
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
  return "We couldn't open checkout right now. Please try again.";
}
