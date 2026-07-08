import { NextResponse } from "next/server";
import { markReportPaid } from "@/lib/report-store";
import { verifyPaddleWebhookSignature } from "@/lib/paddle";

export const runtime = "nodejs";

type PaddleWebhookEvent = {
  event_type?: string;
  data?: {
    id?: string;
    status?: string;
    custom_data?: {
      reportId?: string;
    } | null;
  };
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

      if (transactionId && reportId) {
        await markReportPaid(reportId, transactionId);
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
