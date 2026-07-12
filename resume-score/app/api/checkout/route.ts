import { NextResponse } from "next/server";
import { appUrl, assertPaddleCheckoutConfig, getPaddleEnvironment } from "@/lib/paddle";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { getReport, hasPersistentReportStore } from "@/lib/report-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit({
      key: `checkout:${getRequestIp(request)}`,
      limit: 30,
      windowMs: 60 * 60 * 1000
    });
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many checkout attempts. Please wait a little and try again." }, { status: 429 });
    }

    const { reportId } = (await request.json()) as { reportId?: string };
    if (!reportId) return NextResponse.json({ error: "Missing reportId." }, { status: 400 });

    const report = await getReport(reportId);
    if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });
    if (report.paid) {
      return NextResponse.json({ error: "This report is already unlocked." }, { status: 409 });
    }
    assertPaddleCheckoutConfig();

    if (process.env.NODE_ENV === "production" && !hasPersistentReportStore()) {
      return NextResponse.json(
        {
          error:
            "Payment is not ready yet. Production report storage is not configured, so we cannot safely accept payment."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      provider: "paddle",
      environment: getPaddleEnvironment(),
      clientToken: process.env.PADDLE_CLIENT_TOKEN,
      priceId: process.env.PADDLE_PRICE_ID,
      successUrl: `${appUrl()}/success?report_id=${reportId}`,
      customData: { reportId }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start Paddle Checkout.";
    console.error("[paddle:checkout] request failed", {
      message,
      hasApiKey: Boolean(process.env.PADDLE_API_KEY),
      hasClientToken: Boolean(process.env.PADDLE_CLIENT_TOKEN),
      hasPriceId: Boolean(process.env.PADDLE_PRICE_ID),
      appUrlConfigured: Boolean(process.env.NEXT_PUBLIC_APP_URL)
    });
    const userMessage = message.includes("Paddle is not configured")
      ? "Checkout is not available yet. Please contact support if you need help."
      : message;

    return NextResponse.json(
      { error: userMessage },
      { status: message.includes("Paddle is not configured") ? 503 : 500 }
    );
  }
}
