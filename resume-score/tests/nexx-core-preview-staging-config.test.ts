import assert from "node:assert/strict";
import test from "node:test";
import { getPreviewStagingConfig, isCoreEventInput } from "../lib/nexx-core/preview-staging-config.ts";

const previewEnv = {
  VERCEL_ENV: "preview",
  NEXX_CORE_ENABLED: "false",
  NEXX_CORE_ENVIRONMENT: "staging",
  NEXX_CORE_SHADOW_MODE: "true",
  NEXX_CORE_SHADOW_TARGET: "staging",
  NEXX_CORE_STAGING_DATABASE_URL: "postgresql://staging.example.test/nexx_core_staging",
  NEXX_CORE_SERVER_TOKEN: "preview-staging-token-with-sufficient-length"
};

test("Preview staging ingestion fails closed outside the dedicated preview boundary", () => {
  assert.deepEqual(getPreviewStagingConfig(previewEnv), {
    databaseUrl: previewEnv.NEXX_CORE_STAGING_DATABASE_URL,
    serverToken: previewEnv.NEXX_CORE_SERVER_TOKEN,
    environment: "staging"
  });
  assert.throws(() => getPreviewStagingConfig({ ...previewEnv, VERCEL_ENV: "production" }), /disabled/i);
  assert.throws(() => getPreviewStagingConfig({ ...previewEnv, NEXX_CORE_ENABLED: "true" }), /disabled/i);
  assert.throws(() => getPreviewStagingConfig({ ...previewEnv, NEXX_CORE_ENVIRONMENT: "development" }), /disabled/i);
});

test("Preview staging ingestion accepts only contract-shaped staging events", () => {
  assert.equal(isCoreEventInput({
    eventId: "2c7e4ba3-3141-4a54-a991-7543e6d933b7",
    idempotencyKey: "idem_preview_staging_001",
    eventName: "page.viewed",
    productKey: "resunexx",
    environment: "staging"
  }), true);
  assert.equal(isCoreEventInput({ eventId: "x", environment: "production" }), false);
});
