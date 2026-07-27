import { emitShadowAnalyticsEvent } from "../lib/nexx-core/shadow-adapter.ts";

async function main() {
  const target = process.env.NEXX_CORE_SHADOW_TARGET;
  if (process.env.NEXX_CORE_SHADOW_MODE !== "true" || (target !== "development" && target !== "staging")) {
    throw new Error("Enable non-production Shadow Mode before verification.");
  }
  const results = [];
  results.push(await emitShadowAnalyticsEvent({ event: "landing_page_visit", source: "shadow_verification" }));
  results.push(await emitShadowAnalyticsEvent({ event: "upload_started", source: "shadow_verification" }));
  results.push(await emitShadowAnalyticsEvent({ event: "checkout_clicked", source: "shadow_verification" }));
  results.push(await emitShadowAnalyticsEvent({
    event: "upload_completed",
    source: "api_pending_report",
    metadata: { fileFormat: "pdf", extractionMethod: "pdf_parse", sizeBand: "under_1mb" }
  }));
  results.push(await emitShadowAnalyticsEvent({ event: "analysis_started", source: "api_analyze", metadata: { requestedPlan: "free" } }));
  results.push(await emitShadowAnalyticsEvent({ event: "analysis_completed", source: "api_analyze", metadata: { durationMs: 18_000 } }));
  results.push(await emitShadowAnalyticsEvent({ event: "checkout_requested", source: "api_checkout", metadata: { plan: "standard" } }));
  results.push(await emitShadowAnalyticsEvent({ event: "checkout_created", source: "api_checkout", metadata: { plan: "standard" } }));
  results.push(await emitShadowAnalyticsEvent({ event: "checkout_cancelled", source: "payment_cancel", metadata: { plan: "full" } }));
  results.push(await emitShadowAnalyticsEvent({ event: "analysis_started", source: "polar_verified_payment", metadata: { requestedPlan: "full" } }));
  results.push(await emitShadowAnalyticsEvent({ event: "report_viewed", source: "report_page", metadata: { accessPlan: "full" } }));
  results.push(await emitShadowAnalyticsEvent({ event: "pdf_downloaded", source: "api_download", metadata: { accessPlan: "full" } }));
  if (results.some((result) => !result)) throw new Error("One or more Shadow Mode events were not accepted by local Core ingestion.");
  console.info(`[nexx-core] Phase 2 Shadow Mode verification passed for ${target}: local, non-blocking, minimal lifecycle events accepted.`);
}

main().catch((error: unknown) => {
  console.error("[nexx-core] Shadow Mode verification failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
