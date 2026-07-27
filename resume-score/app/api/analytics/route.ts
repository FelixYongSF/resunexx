import { NextResponse } from "next/server";
import { trackServerEvent, type AnalyticsEventName } from "@/lib/analytics";

export const runtime = "nodejs";

const allowedEvents = new Set<AnalyticsEventName>([
  "landing_page_visit",
  "upload_started",
  "checkout_clicked"
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

    await trackServerEvent({
      event: payload.event,
      source: "client"
    }, {
      oidcToken: request.headers.get("x-vercel-oidc-token") || undefined,
      cookie: request.headers.get("cookie") || undefined,
      protectionBypass: request.headers.get("x-vercel-protection-bypass") || undefined,
      requestOrigin: new URL(request.url).origin
    });

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
