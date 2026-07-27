import assert from "node:assert/strict";
import test from "node:test";
import { CoreIngestionService, InMemoryCoreEventStore } from "../nexx-core/apps/ingest-api/src/index.ts";
import { buildNexxCoreEvent } from "../lib/nexx-core/events.ts";
import { mapAnalyticsToShadowEvent } from "../lib/nexx-core/shadow-adapter.ts";

type JourneyStep = Readonly<{
  event: string;
  source: string;
  metadata?: Record<string, string | number | boolean>;
}>;

function mappedJourney(steps: readonly JourneyStep[]) {
  return steps.map((step) => {
    const mapped = mapAnalyticsToShadowEvent(step);
    assert.ok(mapped, `Expected ${step.event} from ${step.source} to map into Nexx Core.`);
    return { ...mapped, environment: "test" as const };
  });
}

async function ingestJourney(steps: readonly JourneyStep[]) {
  const store = new InMemoryCoreEventStore();
  const service = new CoreIngestionService(store, { allowedEnvironments: ["test"] });
  for (const event of mappedJourney(steps)) {
    const result = await service.ingest(event);
    assert.equal(result.status, "accepted");
  }
  return store.events;
}

test("FREE journey emits only the free analysis lifecycle", async () => {
  const events = await ingestJourney([
    { event: "landing_page_visit", source: "client" },
    { event: "upload_started", source: "client" },
    {
      event: "upload_completed",
      source: "api_analyze",
      metadata: { fileFormat: "pdf", extractionMethod: "pdf_parse", sizeBand: "under_1mb" }
    },
    { event: "analysis_started", source: "api_analyze", metadata: { requestedPlan: "free" } },
    { event: "analysis_completed", source: "api_analyze", metadata: { durationMs: 12_000 } },
    { event: "preview_viewed", source: "preview_page" }
  ]);

  assert.deepEqual(events.map((event) => event.eventName), [
    "page.viewed",
    "artifact_upload.started",
    "artifact_upload.completed",
    "assessment.started",
    "assessment.completed",
    "report.viewed"
  ]);
  assert.equal(events.some((event) => event.eventName.startsWith("checkout.")), false);
});

test("PRO journey creates checkout before any paid analysis and records only standard access", async () => {
  const beforePayment = mappedJourney([
    {
      event: "upload_completed",
      source: "api_pending_report",
      metadata: { fileFormat: "docx", extractionMethod: "docx_parser", sizeBand: "under_1mb" }
    },
    { event: "checkout_requested", source: "api_checkout", metadata: { plan: "standard" } },
    { event: "checkout_created", source: "api_checkout", metadata: { plan: "standard" } }
  ]);
  assert.equal(beforePayment.some((event) => event.eventName.startsWith("assessment.")), false);

  const afterVerifiedPayment = await ingestJourney([
    {
      event: "upload_completed",
      source: "api_pending_report",
      metadata: { fileFormat: "docx", extractionMethod: "docx_parser", sizeBand: "under_1mb" }
    },
    { event: "checkout_requested", source: "api_checkout", metadata: { plan: "standard" } },
    { event: "checkout_created", source: "api_checkout", metadata: { plan: "standard" } },
    { event: "analysis_started", source: "polar_verified_payment", metadata: { requestedPlan: "standard" } },
    { event: "analysis_completed", source: "polar_verified_payment", metadata: { purchasedPlan: "standard", durationMs: 22_000 } },
    { event: "report_viewed", source: "report_page", metadata: { accessPlan: "standard" } },
    { event: "pdf_downloaded", source: "api_download", metadata: { accessPlan: "standard" } }
  ]);
  assert.deepEqual(afterVerifiedPayment.map((event) => event.properties?.report_tier).filter(Boolean), ["standard", "standard", "standard", "standard"]);
});

test("ELITE journey creates checkout before any paid analysis and records only full access", async () => {
  const beforePayment = mappedJourney([
    {
      event: "upload_completed",
      source: "api_pending_report",
      metadata: { fileFormat: "pdf", extractionMethod: "pdf_parse", sizeBand: "1mb_to_4mb" }
    },
    { event: "checkout_requested", source: "api_checkout", metadata: { plan: "full" } },
    { event: "checkout_created", source: "api_checkout", metadata: { plan: "full" } }
  ]);
  assert.equal(beforePayment.some((event) => event.eventName.startsWith("assessment.")), false);

  const afterVerifiedPayment = await ingestJourney([
    {
      event: "upload_completed",
      source: "api_pending_report",
      metadata: { fileFormat: "pdf", extractionMethod: "pdf_parse", sizeBand: "1mb_to_4mb" }
    },
    { event: "checkout_requested", source: "api_checkout", metadata: { plan: "full" } },
    { event: "checkout_created", source: "api_checkout", metadata: { plan: "full" } },
    { event: "analysis_started", source: "polar_verified_payment", metadata: { requestedPlan: "full" } },
    { event: "analysis_completed", source: "polar_verified_payment", metadata: { purchasedPlan: "full", durationMs: 72_000 } },
    { event: "report_viewed", source: "report_page", metadata: { accessPlan: "full" } },
    { event: "pdf_downloaded", source: "api_download", metadata: { accessPlan: "full" } }
  ]);
  assert.deepEqual(afterVerifiedPayment.map((event) => event.properties?.report_tier).filter(Boolean), ["full", "full", "full", "full"]);
});

test("cancelled checkout never maps to paid analysis and payment telemetry stays webhook-only", () => {
  const cancelled = mapAnalyticsToShadowEvent({
    event: "checkout_cancelled",
    source: "payment_cancel",
    metadata: { plan: "full" }
  });
  assert.equal(cancelled?.eventName, "checkout.cancelled");
  assert.equal(mapAnalyticsToShadowEvent({ event: "payment_completed", source: "client" }), undefined);
  assert.equal(mapAnalyticsToShadowEvent({ event: "payment_completed", source: "polar_webhook" }), undefined);
});

test("phase two analytics mappings never carry report references into Core events", () => {
  const event = mapAnalyticsToShadowEvent({
    event: "checkout_created",
    source: "api_checkout",
    reportId: "rpt_internal_reference_must_not_leave_product",
    metadata: { plan: "standard", reportId: "rpt_internal_reference_must_not_leave_product" }
  });
  assert.ok(event);
  assert.equal(JSON.stringify(event).includes("rpt_internal_reference_must_not_leave_product"), false);
});

test("the catalog still rejects a forged paid analysis claim from a client", async () => {
  const store = new InMemoryCoreEventStore();
  const service = new CoreIngestionService(store, { allowedEnvironments: ["test"] });
  const result = await service.ingest(buildNexxCoreEvent({
    eventName: "assessment.started",
    environment: "test",
    source: "client",
    properties: { assessment_type: "resume", report_tier: "full", engine_version: "resume-engine-v1" }
  }));
  assert.equal(result.status, "rejected");
  assert.equal(result.rejection?.reasonCode, "invalid_source");
});
