import { NextResponse } from "next/server";
import { appUrl, assertPaddleCheckoutConfig, getPaddleEnvironment } from "@/lib/paddle";
import { getReport, hasPersistentReportStore } from "@/lib/report-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
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
    console.error(error);
    const message = error instanceof Error ? error.message : "Could not start Paddle Checkout.";
    const userMessage = message.includes("Paddle is not configured")
      ? `Payment is not configured yet. ${message}`
      : message;

    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}
