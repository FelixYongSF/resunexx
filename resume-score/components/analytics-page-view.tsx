"use client";

import { useEffect } from "react";
import { trackClientEvent, type AnalyticsEventName } from "@/lib/analytics";

export function AnalyticsPageView({
  event,
  reportId
}: {
  event: AnalyticsEventName;
  reportId?: string;
}) {
  useEffect(() => {
    trackClientEvent({ event, reportId, source: "page_view" });
  }, [event, reportId]);

  return null;
}
