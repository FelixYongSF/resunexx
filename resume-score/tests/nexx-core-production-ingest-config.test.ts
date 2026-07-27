import assert from "node:assert/strict";
import test from "node:test";
import { getShadowIngestConfig, isCoreEventInputForEnvironment } from "../lib/nexx-core/shadow-ingest-config.ts";

const productionEnv = {
  VERCEL_ENV: "production",
  NEXX_CORE_ENABLED: "true",
  NEXX_CORE_ENVIRONMENT: "production",
  NEXX_CORE_SHADOW_MODE: "true",
  NEXX_CORE_SHADOW_TARGET: "production",
  NEXX_CORE_INGEST_URL: "vercel-production-self",
  NEXX_CORE_PRODUCT_KEY: "resunexx",
  NEXX_CORE_CONTRACT_VERSION: "nexx-core-event-v1",
  NEXX_CORE_PRIVACY_POLICY_VERSION: "2026-07-01",
  NEXX_CORE_DATABASE_URL: "postgresql://core.example.test/nexx_core_production",
  NEXX_CORE_SERVER_TOKEN: "production-server-token-with-sufficient-length"
};

test("Production Shadow receiver accepts only the explicit minimal-data boundary", () => {
  assert.deepEqual(getShadowIngestConfig(productionEnv), {
    databaseUrl: productionEnv.NEXX_CORE_DATABASE_URL,
    serverToken: productionEnv.NEXX_CORE_SERVER_TOKEN,
    environment: "production"
  });
  assert.throws(() => getShadowIngestConfig({ ...productionEnv, NEXX_CORE_ENABLED: "false" }), /disabled/i);
  assert.throws(() => getShadowIngestConfig({ ...productionEnv, NEXX_CORE_INGEST_URL: "https://example.com" }), /disabled/i);
  assert.throws(() => getShadowIngestConfig({ ...productionEnv, NEXX_CORE_DATABASE_URL: "" }), /incomplete/i);
});

test("Production receiver rejects staging or malformed envelopes", () => {
  const envelope = {
    eventId: "2c7e4ba3-3141-4a54-a991-7543e6d933b7",
    idempotencyKey: "idem_production_001",
    eventName: "page.viewed",
    productKey: "resunexx",
    environment: "production"
  };
  assert.equal(isCoreEventInputForEnvironment(envelope, "production"), true);
  assert.equal(isCoreEventInputForEnvironment({ ...envelope, environment: "staging" }, "production"), false);
  assert.equal(isCoreEventInputForEnvironment({ eventId: "x", environment: "production" }, "production"), false);
});
