import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { getReport, markReportPaid } from "@/lib/report-store";
import { isPaidPaddleTransaction, PaddleTransaction, verifyPaddleWebhookSignature } from "@/lib/paddle";

export const runtime = "nodejs";

type PaddleWebhookEvent = {
  event_type?: string;
  data?: PaddleTransaction;
};

export async function POST(request: Request) {
  const rateLimit = checkRateLimit({
    key: `paddle-webhook:${getRequestIp(request)}`,
    limit: 120,
    windowMs: 60 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many webhook attempts." }, { status: 429 });
  }

  const body = await request.text();
  const signature = request.headers.get("paddle-signature");
  let event: PaddleWebhookEvent | null = null;

  try {
    if (!verifyPaddleWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Webhook verification failed." }, { status: 400 });
    }

    event = JSON.parse(body) as PaddleWebhookEvent;

    if (event.event_type === "transaction.completed" || event.event_type === "transaction.paid") {
      const transactionId = event.data?.id;
      const reportId = event.data?.custom_data?.reportId;

      if (!transactionId || !reportId || !event.data) {
        return NextResponse.json({ error: "Payment event is missing report metadata." }, { status: 400 });
      }

      if (!isPaidPaddleTransaction(event.data, reportId)) {
        return NextResponse.json({ error: "Payment event does not match the configured product." }, { status: 409 });
      }

      const existingReport = await getReport(reportId);
      if (!existingReport) {
        return NextResponse.json({ error: "Matching report was not found." }, { status: 409 });
      }

      if (existingReport.paid) {
        console.info("[paddle:webhook] duplicate payment event ignored", {
          eventType: event.event_type,
          reportId
        });
        return NextResponse.json({ received: true, duplicate: true });
      }

      const report = await markReportPaid(reportId, transactionId);
      if (!report) {
        return NextResponse.json({ error: "Matching report was not found." }, { status: 409 });
      }
      trackServerEvent({
        event: "payment_completed",
        reportId,
        source: "paddle_webhook",
        metadata: {
          transactionId,
          eventType: event.event_type
        }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    console.error("[paddle:webhook] request failed", {
      message,
      eventType: event?.event_type || "unknown",
      hasSignature: Boolean(signature)
    });
    const status = message.includes("not configured") ? 500 : 400;
    return NextResponse.json(
      { error: status === 500 ? "Payment verification is not configured." : "Webhook could not be processed." },
      { status }
    );
  }
}
