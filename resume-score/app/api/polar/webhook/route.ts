import { Webhooks } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics";
import { getPaymentFromPolarOrder, unlockPolarEntitlement } from "@/lib/payment";
import { getPolarOrderReportId, getPolarPlanForProductId, type PolarOrderRecord } from "@/lib/polar";
import { markReportRefundedFromPolar, recordPolarOrder } from "@/lib/report-store";

export const runtime = "nodejs";
export const maxDuration = 120;

const polarWebhookHandler = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || "",
  onOrderCreated: async (payload) => {
    await storePolarOrder(payload.data);
  },
  onOrderPaid: async (payload) => {
    await storePolarOrder(payload.data);
    const payment = getPaymentFromPolarOrder(payload.data);
    const { alreadyUnlocked } = await unlockPolarEntitlement(payment);

    if (!alreadyUnlocked) {
      trackServerEvent({
        event: "payment_completed",
        reportId: payment.reportId,
        source: "polar_webhook",
        metadata: { orderId: payment.orderId, purchasedPlan: payment.purchasedPlan }
      });
    }
  },
  onRefundCreated: async (payload) => {
    const report = await markReportRefundedFromPolar(payload.data.orderId, payload.data.createdAt.toISOString());
    if (report) {
      console.info("[polar:webhook] report access revoked after refund", {
        orderId: payload.data.orderId,
        reportId: report.id
      });
    }
  }
});

export async function POST(request: NextRequest) {
  if (!process.env.POLAR_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Payment verification is not configured." }, { status: 503 });
  }

  try {
    return await polarWebhookHandler(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook error.";
    console.error("[polar:webhook] request failed", { message });
    return NextResponse.json({ error: "Webhook could not be processed." }, { status: 400 });
  }
}

async function storePolarOrder(order: PolarOrderRecord) {
  const reportId = getPolarOrderReportId(order);
  const plan = getPolarPlanForProductId(order.productId);
  if (!reportId || !plan || order.metadata.selectedPlan !== plan) {
    throw new Error("Polar order does not contain valid ResuNexx payment metadata.");
  }

  await recordPolarOrder(reportId, {
    orderId: order.id,
    customerEmail: order.customer.email || undefined,
    amount: order.totalAmount,
    currency: order.currency,
    createdAt: order.createdAt.toISOString()
  });
}
