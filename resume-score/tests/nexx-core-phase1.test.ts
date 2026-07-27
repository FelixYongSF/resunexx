import assert from "node:assert/strict";
import test from "node:test";
import { CoreIngestionService, InMemoryCoreEventStore } from "../nexx-core/apps/ingest-api/src/index.ts";
import { createIngestionRoute } from "../nexx-core/apps/ingest-api/src/routes/events.ts";
import { ProductRegistry } from "../nexx-core/packages/registry/src/index.ts";
import { buildNexxCoreEvent } from "../lib/nexx-core/events.ts";
import { getNexxCorePhase1Config } from "../lib/nexx-core/config.ts";

function createService() {
  const store = new InMemoryCoreEventStore();
  return { store, service: new CoreIngestionService(store, { allowedEnvironments: ["test"] }) };
}

test("accepts a registered, privacy-safe event exactly once", async () => {
  const { store, service } = createService();
  const event = buildNexxCoreEvent({
    eventName: "cta.clicked",
    environment: "test",
    source: "client",
    properties: { cta_key: "hero_start_free", placement: "hero", destination_intent: "free_upload" },
    idempotencyKey: "idem_phase1_safe_event"
  });

  assert.equal((await service.ingest(event)).status, "accepted");
  assert.equal((await service.ingest(event)).status, "duplicate");
  assert.equal(store.events.length, 1);
  assert.equal(store.events[0].receivedAt.length > 0, true);
});

test("rejects production events during Phase 1", async () => {
  const { service } = createService();
  const result = await service.ingest(buildNexxCoreEvent({
    eventName: "page.viewed",
    environment: "production",
    source: "client",
    properties: { page_key: "home", page_type: "marketing" }
  }));
  assert.equal(result.status, "rejected");
  assert.equal(result.rejection?.reasonCode, "environment_not_allowed");
});

test("rejects unknown and sensitive event properties", async () => {
  const { store, service } = createService();
  const result = await service.ingest(buildNexxCoreEvent({
    eventName: "artifact_upload.completed",
    environment: "test",
    source: "server",
    properties: {
      artifact_type: "resume",
      file_format: "pdf",
      size_band: "under_1mb",
      extraction_method: "pdf_parse",
      filename: "alex-resume.pdf"
    } as never
  }));
  assert.equal(result.status, "rejected");
  assert.equal(result.rejection?.reasonCode, "sensitive_property");
  assert.equal(store.events.length, 0);
});

test("rejects a client claim for an authoritative payment event", async () => {
  const { service } = createService();
  const result = await service.ingest(buildNexxCoreEvent({
    eventName: "payment.completed",
    environment: "test",
    source: "client",
    properties: { plan: "standard", currency: "usd", amount_minor: 499 }
  }));
  assert.equal(result.status, "rejected");
  assert.equal(result.rejection?.reasonCode, "invalid_source");
});

test("rejects direct identifiers in opaque references", async () => {
  const { service } = createService();
  const result = await service.ingest(buildNexxCoreEvent({
    eventName: "page.viewed",
    environment: "test",
    source: "client",
    actorRef: "alex@example.com",
    properties: { page_key: "home", page_type: "marketing" }
  }));
  assert.equal(result.status, "rejected");
  assert.equal(result.rejection?.reasonCode, "invalid_entity_reference");
});

test("phase one configuration fails closed for production or enabled emission", () => {
  assert.throws(() => getNexxCorePhase1Config({ NEXX_CORE_ENVIRONMENT: "production" }), /only permits/i);
  assert.throws(() => getNexxCorePhase1Config({ NEXX_CORE_ENABLED: "true" }), /disabled/i);
  assert.equal(getNexxCorePhase1Config({ NEXX_CORE_ENVIRONMENT: "test" }).enabled, false);
});

test("ingestion route authenticates the product and enforces its contract", async () => {
  const { service } = createService();
  const registry = new ProductRegistry();
  registry.register({ productKey: "resunexx", contractVersion: "nexx-core-event-v1", allowedEnvironments: ["test"] });
  const route = createIngestionRoute(registry, service, "local-phase-one-token");
  const event = buildNexxCoreEvent({
    eventName: "plan.selected",
    environment: "test",
    source: "client",
    properties: { plan: "free" }
  });

  assert.equal((await route({ event })).status, 401);
  assert.equal((await route({ authorization: "Bearer local-phase-one-token", event })).status, 202);
});
