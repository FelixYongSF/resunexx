export type AnalyticsEventName =
  | "landing_page_visit"
  | "upload_started"
  | "upload_completed"
  | "analysis_started"
  | "analysis_completed"
  | "preview_viewed"
  | "report_viewed"
  | "checkout_clicked"
  | "checkout_requested"
  | "checkout_created"
  | "checkout_cancelled"
  | "pdf_downloaded"
  | "payment_completed";

export type AnalyticsPayload = {
  event: AnalyticsEventName;
  reportId?: string;
  source?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

type ServerTrackingRequestContext = Readonly<{
  oidcToken?: string;
  cookie?: string;
  protectionBypass?: string;
  requestOrigin?: string;
}>;

export async function trackServerEvent(payload: AnalyticsPayload, requestContext?: ServerTrackingRequestContext): Promise<void> {
  const safePayload = sanitizePayload(payload);
  console.info("[analytics]", { event: safePayload.event, source: safePayload.source });
  if (typeof window === "undefined") {
    try {
      const { emitShadowAnalyticsEvent } = await import("@/lib/nexx-core/shadow-adapter");
      await emitShadowAnalyticsEvent(safePayload, requestContext);
    } catch {
      // Shadow Mode remains observational and must never interrupt product flows.
    }
  }
}

export function trackClientEvent(payload: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify(sanitizePayload(payload));

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

function sanitizePayload(payload: AnalyticsPayload): AnalyticsPayload {
  return {
    event: payload.event,
    reportId: payload.reportId,
    source: payload.source,
    metadata: payload.metadata
      ? Object.fromEntries(
          Object.entries(payload.metadata).map(([key, value]) => [
            key,
            typeof value === "string" ? value.slice(0, 120) : value
          ])
        )
      : undefined
  };
}
