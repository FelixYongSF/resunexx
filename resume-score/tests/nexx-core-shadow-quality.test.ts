import assert from "node:assert/strict";
import test from "node:test";
import { evaluateShadowModeDataQuality, SHADOW_EVENT_NAMES } from "../nexx-core/packages/quality/src/index.ts";
import type { CoreEventInput } from "../nexx-core/packages/contracts/src/index.ts";

function event(eventName: CoreEventInput["eventName"], properties: CoreEventInput["properties"]): CoreEventInput {
  return {
    eventId: crypto.randomUUID(),
    idempotencyKey: `idem_${crypto.randomUUID().replaceAll("-", "")}`,
    eventName,
    eventVersion: 1,
    occurredAt: new Date().toISOString(),
    productKey: "resunexx",
    environment: "development",
    source: eventName === "assessment.completed" ? "server" : "client",
    productContractVersion: "nexx-core-event-v1",
    privacyPolicyVersion: "2026-07-01",
    properties,
  };
}

function validEvents(): CoreEventInput[] {
  return [
    event("page.viewed", { page_key: "home", page_type: "marketing" }),
    event("artifact_upload.started", { artifact_type: "resume" }),
    event("cta.clicked", { cta_key: "checkout", placement: "product_ui", destination_intent: "pricing" }),
    event("assessment.completed", { assessment_type: "resume", report_tier: "free", engine_version: "resume-engine-v1", duration_band: "15s_to_60s" }),
  ];
}

test("Shadow data-quality validator accepts catalog-safe events with matching encrypted replica counts", () => {
  const events = validEvents();
  const counts = Object.fromEntries(SHADOW_EVENT_NAMES.map((eventName) => [eventName, 1])) as Record<(typeof SHADOW_EVENT_NAMES)[number], number>;
  const result = evaluateShadowModeDataQuality({ sourceEvents: events, replicaCounts: counts });
  assert.equal(result.passed, true);
  assert.equal(result.inspectedEventCount, 4);
});

test("Shadow data-quality validator accepts an explicitly selected staging environment", () => {
  const events = validEvents().map((item) => ({ ...item, environment: "staging" as const }));
  const counts = Object.fromEntries(SHADOW_EVENT_NAMES.map((eventName) => [eventName, 1])) as Record<(typeof SHADOW_EVENT_NAMES)[number], number>;
  const result = evaluateShadowModeDataQuality({ sourceEvents: events, replicaCounts: counts, allowedEnvironment: "staging" });
  assert.equal(result.passed, true);
});

test("Shadow data-quality validator rejects sensitive data, duplicate keys, and replica drift", () => {
  const events = validEvents();
  events[0] = { ...events[0], properties: { page_key: "person@example.com", page_type: "marketing" } };
  events[1] = { ...events[1], idempotencyKey: events[0].idempotencyKey };
  const counts = Object.fromEntries(SHADOW_EVENT_NAMES.map((eventName) => [eventName, 1])) as Record<(typeof SHADOW_EVENT_NAMES)[number], number>;
  counts["cta.clicked"] = 0;
  const result = evaluateShadowModeDataQuality({ sourceEvents: events, replicaCounts: counts });
  assert.equal(result.passed, false);
  assert.match(result.failures.join(" "), /Catalog or privacy validation failed|sensitive-looking/i);
  assert.match(result.failures.join(" "), /Duplicate Shadow idempotency key/i);
  assert.match(result.failures.join(" "), /counts differ/i);
});
