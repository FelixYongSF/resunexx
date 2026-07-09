import { NextResponse } from "next/server";
import { markReportPaid } from "@/lib/report-store";
import { isPaidPaddleTransaction, PaddleTransaction, verifyPaddleWebhookSignature } from "@/lib/paddle";

export const runtime = "nodejs";

type PaddleWebhookEvent = {
  event_type?: string;
  data?: PaddleTransaction;
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("paddle-signature");

  try {
    if (!verifyPaddleWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Webhook verification failed." }, { status: 400 });
    }

    const event = JSON.parse(body) as PaddleWebhookEvent;

    if (event.event_type === "transaction.completed" || event.event_type === "transaction.paid") {
      const transactionId = event.data?.id;
      const reportId = event.data?.custom_data?.reportId;

      if (!transactionId || !reportId || !event.data) {
        return NextResponse.json({ error: "Payment event is missing report metadata." }, { status: 400 });
      }

      if (!isPaidPaddleTransaction(event.data, reportId)) {
        return NextResponse.json({ error: "Payment event does not match the configured product." }, { status: 409 });
      }

      const report = await markReportPaid(reportId, transactionId);
      if (!report) {
        return NextResponse.json({ error: "Matching report was not found." }, { status: 409 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Webhook verification failed.";
    const status = message.includes("not configured") ? 500 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
