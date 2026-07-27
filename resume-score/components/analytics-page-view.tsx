"use client";

import { useEffect, useRef } from "react";
import { trackClientEvent, type AnalyticsEventName } from "@/lib/analytics";

export function AnalyticsPageView({
  event,
  reportId
}: {
  event: AnalyticsEventName;
  reportId?: string;
}) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    const sessionKey = `resunexx:page-view:${event}:${reportId || "none"}`;
    try {
      if (window.sessionStorage.getItem(sessionKey)) return;
      window.sessionStorage.setItem(sessionKey, "1");
    } catch {
      // Storage availability must not affect the visible product experience.
    }
    hasTracked.current = true;
    trackClientEvent({ event, reportId, source: "page_view" });
  }, [event, reportId]);

  return null;
}
