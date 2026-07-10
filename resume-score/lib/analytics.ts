export type AnalyticsEventName =
  | "landing_page_visit"
  | "upload_started"
  | "upload_completed"
  | "analysis_completed"
  | "preview_viewed"
  | "checkout_clicked"
  | "payment_completed";

type AnalyticsPayload = {
  event: AnalyticsEventName;
  reportId?: string;
  source?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function trackServerEvent(payload: AnalyticsPayload) {
  console.info("[analytics]", sanitizePayload(payload));
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
