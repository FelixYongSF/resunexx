import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import {
  PaddleTransaction,
  verifyPaddleWebhookSignature
} from "@/lib/paddle";
import { unlockEntitlement, verifyTransaction } from "@/lib/payment";

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
      if (!transactionId) {
        return NextResponse.json({ error: "Payment event is missing report metadata." }, { status: 400 });
      }

      const payment = await verifyTransaction(transactionId);
      const { alreadyUnlocked } = await unlockEntitlement(payment);
      if (alreadyUnlocked) {
        console.info("[paddle:webhook] duplicate payment event ignored", {
          eventType: event.event_type,
          reportId: payment.reportId
        });
        return NextResponse.json({ received: true, duplicate: true });
      }

      trackServerEvent({
        event: "payment_completed",
        reportId: payment.reportId,
        source: "paddle_webhook",
        metadata: {
          transactionId: payment.transactionId,
          eventType: event.event_type,
          purchasedPlan: payment.purchasedPlan
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
