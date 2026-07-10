import { NextResponse } from "next/server";
import { trackServerEvent, type AnalyticsEventName } from "@/lib/analytics";

export const runtime = "nodejs";

const allowedEvents = new Set<AnalyticsEventName>([
  "landing_page_visit",
  "upload_started",
  "upload_completed",
  "analysis_completed",
  "preview_viewed",
  "checkout_clicked",
  "payment_completed"
]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      event?: AnalyticsEventName;
      reportId?: string;
      source?: string;
      metadata?: Record<string, string | number | boolean | null>;
    };

    if (!payload.event || !allowedEvents.has(payload.event)) {
      return NextResponse.json({ received: false }, { status: 400 });
    }

    trackServerEvent({
      event: payload.event,
      reportId: payload.reportId,
      source: payload.source || "client",
      metadata: payload.metadata
    });

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
