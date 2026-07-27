import assert from "node:assert/strict";
import test from "node:test";
import { emitShadowAnalyticsEvent, getShadowConfig, mapAnalyticsToShadowEvent } from "../lib/nexx-core/shadow-adapter.ts";

test("Shadow Mode maps only minimal, catalog-approved ResuNexx telemetry", () => {
  const event = mapAnalyticsToShadowEvent({
    event: "analysis_completed",
    reportId: "this-must-not-be-copied",
    source: "polar_verified_payment",
    metadata: { purchasedPlan: "full", durationMs: 21_000, engineVersion: "untrusted-input" }
  });
  assert.equal(event?.eventName, "assessment.completed");
  assert.equal(event?.source, "server");
  assert.deepEqual(event?.entityRefs, undefined);
  assert.deepEqual(event?.properties, {
    assessment_type: "resume",
    report_tier: "full",
    engine_version: "resume-engine-v1",
    duration_band: "15s_to_60s"
  });
  assert.equal(mapAnalyticsToShadowEvent({ event: "payment_completed" }), undefined);
  assert.equal(mapAnalyticsToShadowEvent({ event: "analysis_completed", source: "client" }), undefined);
});

test("Phase 2 Shadow mappings require server authority and emit only catalog-safe metadata", () => {
  assert.deepEqual(
    mapAnalyticsToShadowEvent({
      event: "upload_completed",
      source: "api_pending_report",
      metadata: { fileFormat: "pdf", extractionMethod: "pdf_parse", sizeBand: "under_1mb", fileName: "must-not-pass.pdf" }
    })?.properties,
    { artifact_type: "resume", file_format: "pdf", size_band: "under_1mb", extraction_method: "pdf_parse" }
  );
  assert.equal(mapAnalyticsToShadowEvent({ event: "upload_completed", source: "client", metadata: { fileFormat: "pdf" } }), undefined);
  assert.deepEqual(
    mapAnalyticsToShadowEvent({ event: "analysis_started", source: "polar_verified_payment", metadata: { requestedPlan: "full" } })?.properties,
    { assessment_type: "resume", report_tier: "full", engine_version: "resume-engine-v1" }
  );
  assert.deepEqual(
    mapAnalyticsToShadowEvent({ event: "checkout_created", source: "api_checkout", metadata: { plan: "standard", reportId: "must-not-pass" } })?.properties,
    { plan: "standard", provider: "polar" }
  );
  assert.deepEqual(
    mapAnalyticsToShadowEvent({ event: "pdf_downloaded", source: "api_download", metadata: { accessPlan: "full" } })?.properties,
    { report_tier: "full", format: "pdf" }
  );
  assert.equal(mapAnalyticsToShadowEvent({ event: "payment_completed", source: "polar_webhook" }), undefined);
});

test("Shadow Mode is disabled in production and rejects remote destinations", () => {
  assert.equal(getShadowConfig({ NEXX_CORE_SHADOW_MODE: "true", VERCEL_ENV: "production" }).enabled, false);
  assert.throws(
    () => getShadowConfig({
      NEXX_CORE_SHADOW_MODE: "true",
      NEXX_CORE_SHADOW_TARGET: "development",
      NEXX_CORE_INGEST_URL: "https://example.com/v1/events",
      NEXX_CORE_SERVER_TOKEN: "local-only-token-with-sufficient-length"
    }),
    /localhost/i
  );
});

test("Shadow Mode requires an explicit local development opt-in", () => {
  const config = getShadowConfig({
    NEXX_CORE_SHADOW_MODE: "true",
    NEXX_CORE_SHADOW_TARGET: "development",
    NEXX_CORE_ENVIRONMENT: "development",
    NEXX_CORE_INGEST_URL: "http://127.0.0.1:4317/v1/events",
    NEXX_CORE_SERVER_TOKEN: "local-only-token-with-sufficient-length"
  });
  assert.equal(config.enabled, true);
});

test("Shadow Mode permits a separately configured localhost staging target", () => {
  const config = getShadowConfig({
    NEXX_CORE_SHADOW_MODE: "true",
    NEXX_CORE_SHADOW_TARGET: "staging",
    NEXX_CORE_ENVIRONMENT: "staging",
    NEXX_CORE_INGEST_URL: "http://127.0.0.1:4318/v1/events",
    NEXX_CORE_SERVER_TOKEN: "local-only-token-with-sufficient-length"
  });
  assert.equal(config.environment, "staging");
  assert.equal(mapAnalyticsToShadowEvent({ event: "landing_page_visit" }, "staging")?.environment, "staging");
});

test("Shadow Mode permits only the same Vercel Preview deployment for staging", () => {
  const config = getShadowConfig({
    VERCEL_ENV: "preview",
    VERCEL_URL: "resunexx-gate-b-preview.vercel.app",
    NEXX_CORE_ENABLED: "false",
    NEXX_CORE_SHADOW_MODE: "true",
    NEXX_CORE_SHADOW_TARGET: "staging",
    NEXX_CORE_ENVIRONMENT: "staging",
    NEXX_CORE_INGEST_URL: "vercel-preview-self",
    NEXX_CORE_SERVER_TOKEN: "preview-staging-token-with-sufficient-length"
  });
  assert.equal(config.enabled, true);
  assert.equal(config.ingestUrl, "https://resunexx-gate-b-preview.vercel.app/api/nexx-core/shadow-ingest");
});

test("Preview Shadow Mode rejects arbitrary remote destinations", () => {
  assert.throws(() => getShadowConfig({
    VERCEL_ENV: "preview",
    VERCEL_URL: "resunexx-gate-b-preview.vercel.app",
    NEXX_CORE_ENABLED: "false",
    NEXX_CORE_SHADOW_MODE: "true",
    NEXX_CORE_SHADOW_TARGET: "staging",
    NEXX_CORE_ENVIRONMENT: "staging",
    NEXX_CORE_INGEST_URL: "https://example.com/v1/events",
    NEXX_CORE_SERVER_TOKEN: "preview-staging-token-with-sufficient-length"
  }), /self-ingest/i);
});

test("Preview Shadow Mode forwards trusted request credentials only to its self-ingest endpoint", async () => {
  const originalFetch = globalThis.fetch;
  const originalEnvironment = { ...process.env };
  try {
    Object.assign(process.env, {
      VERCEL_ENV: "preview",
      VERCEL_URL: "resunexx-prod-gateb-nexx52.vercel.app",
      NEXX_CORE_ENABLED: "false",
      NEXX_CORE_SHADOW_MODE: "true",
      NEXX_CORE_SHADOW_TARGET: "staging",
      NEXX_CORE_ENVIRONMENT: "staging",
      NEXX_CORE_INGEST_URL: "vercel-preview-self",
      NEXX_CORE_SERVER_TOKEN: "preview-staging-token-with-sufficient-length"
    });
    let receivedUrl = "";
    let receivedHeaders: Headers | undefined;
    globalThis.fetch = async (input, init) => {
      receivedUrl = String(input);
      receivedHeaders = new Headers(init?.headers);
      return new Response("accepted", { status: 202 });
    };

    assert.equal(await emitShadowAnalyticsEvent(
      { event: "landing_page_visit" },
      {
        oidcToken: "short-lived-oidc",
        cookie: "preview-auth-cookie",
        protectionBypass: "preview-only-bypass",
        requestOrigin: "https://resunexx-prod-felixyong-5095-nexx52.vercel.app"
      }
    ), true);
    assert.equal(receivedUrl, "https://resunexx-prod-felixyong-5095-nexx52.vercel.app/api/nexx-core/shadow-ingest");
    assert.equal(receivedHeaders?.get("x-vercel-trusted-oidc-idp-token"), "short-lived-oidc");
    assert.equal(receivedHeaders?.get("cookie"), "preview-auth-cookie");
    assert.equal(receivedHeaders?.get("x-vercel-protection-bypass"), "preview-only-bypass");
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnvironment)) delete process.env[key];
    }
    Object.assign(process.env, originalEnvironment);
  }
});

test("Shadow Mode delivery failure is non-blocking", async () => {
  const originalFetch = globalThis.fetch;
  const originalEnvironment = { ...process.env };
  try {
    process.env.NEXX_CORE_SHADOW_MODE = "true";
    process.env.NEXX_CORE_SHADOW_TARGET = "development";
    process.env.NEXX_CORE_ENVIRONMENT = "development";
    process.env.NEXX_CORE_INGEST_URL = "http://127.0.0.1:4317/v1/events";
    process.env.NEXX_CORE_SERVER_TOKEN = "local-only-token-with-sufficient-length";
    globalThis.fetch = async () => new Response("unavailable", { status: 503 });
    assert.equal(await emitShadowAnalyticsEvent({ event: "landing_page_visit" }), false);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnvironment)) delete process.env[key];
    }
    Object.assign(process.env, originalEnvironment);
  }
});
