import { buildNexxCoreEvent } from "./events.ts";
import { CORE_CONTRACT_VERSION, type CoreEventInput } from "../../nexx-core/packages/contracts/src/index.ts";

type ShadowAnalyticsPayload = Readonly<{
  event: string;
  reportId?: string;
  source?: string;
  metadata?: Record<string, string | number | boolean | null>;
}>;

type ShadowConfig = Readonly<{
  enabled: boolean;
  environment?: "development" | "staging" | "production";
  ingestUrl?: string;
  serverToken?: string;
}>;

/**
 * Preview-only credentials are forwarded only to the fixed same-deployment
 * endpoint. They are never accepted for a configurable remote destination.
 */
export type PreviewShadowRequestAuth = Readonly<{
  oidcToken?: string;
  cookie?: string;
  protectionBypass?: string;
  requestOrigin?: string;
}>;

const LOCAL_INGEST_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);
const LOCAL_SHADOW_TIMEOUT_MS = 3_000;
const PREVIEW_SELF_INGEST_MARKER = "vercel-preview-self";
const PRODUCTION_SELF_INGEST_MARKER = "vercel-production-self";
const PREVIEW_SELF_INGEST_PATH = "/api/nexx-core/shadow-ingest";

/**
 * Shadow Mode is opt-in and fail-closed. Local development uses localhost;
 * Gate B may use a same-deployment Preview endpoint backed by staging only.
 * Production requires an explicit, same-deployment, minimum-data Shadow Mode
 * configuration. Every partial or mismatched production configuration is off.
 */
export function getShadowConfig(env: Readonly<Record<string, string | undefined>> = process.env): ShadowConfig {
  if (env.VERCEL_ENV === "production" || env.NEXX_CORE_ENVIRONMENT === "production") {
    if (
      env.VERCEL_ENV !== "production" ||
      env.NEXX_CORE_ENABLED !== "true" ||
      env.NEXX_CORE_ENVIRONMENT !== "production" ||
      env.NEXX_CORE_SHADOW_MODE !== "true" ||
      env.NEXX_CORE_SHADOW_TARGET !== "production" ||
      env.NEXX_CORE_INGEST_URL !== PRODUCTION_SELF_INGEST_MARKER ||
      env.NEXX_CORE_PRODUCT_KEY !== "resunexx" ||
      env.NEXX_CORE_CONTRACT_VERSION !== CORE_CONTRACT_VERSION ||
      env.NEXX_CORE_PRIVACY_POLICY_VERSION !== "2026-07-01" ||
      !env.VERCEL_URL ||
      !env.NEXX_CORE_DATABASE_URL ||
      !env.NEXX_CORE_SERVER_TOKEN
    ) {
      return { enabled: false };
    }
    return {
      enabled: true,
      environment: "production",
      ingestUrl: `https://${env.VERCEL_URL}${PREVIEW_SELF_INGEST_PATH}`,
      serverToken: env.NEXX_CORE_SERVER_TOKEN
    };
  }
  if (env.NEXX_CORE_SHADOW_MODE !== "true") return { enabled: false };
  const environment = env.NEXX_CORE_SHADOW_TARGET;
  if (environment !== "development" && environment !== "staging") {
    throw new Error("Nexx Core Shadow Mode requires NEXX_CORE_SHADOW_TARGET=development or staging.");
  }
  if (env.NEXX_CORE_ENVIRONMENT && env.NEXX_CORE_ENVIRONMENT !== environment) {
    throw new Error("NEXX_CORE_ENVIRONMENT must match the Shadow Mode target.");
  }
  if (env.NEXX_CORE_ENABLED === "true") {
    throw new Error("Nexx Core active collection is not authorized; Shadow Mode must remain isolated.");
  }
  if (!env.NEXX_CORE_INGEST_URL || !env.NEXX_CORE_SERVER_TOKEN) {
    throw new Error("Nexx Core Shadow Mode requires an ingest destination and server token.");
  }

  if (env.VERCEL_ENV === "preview") {
    if (environment !== "staging" || env.NEXX_CORE_INGEST_URL !== PREVIEW_SELF_INGEST_MARKER || !env.VERCEL_URL) {
      throw new Error("Nexx Core Preview Shadow Mode requires the staging self-ingest configuration.");
    }
    return {
      enabled: true,
      environment,
      ingestUrl: `https://${env.VERCEL_URL}${PREVIEW_SELF_INGEST_PATH}`,
      serverToken: env.NEXX_CORE_SERVER_TOKEN
    };
  }

  const url = new URL(env.NEXX_CORE_INGEST_URL);
  if (url.protocol !== "http:" || !LOCAL_INGEST_HOSTS.has(url.hostname) || url.pathname !== "/v1/events") {
    throw new Error("Nexx Core Shadow Mode only permits a localhost http://127.0.0.1/.../v1/events destination.");
  }
  return { enabled: true, environment, ingestUrl: url.toString(), serverToken: env.NEXX_CORE_SERVER_TOKEN };
}

function durationBand(value: unknown): "under_15s" | "15s_to_60s" | "over_60s" {
  if (typeof value !== "number" || value < 15_000) return "under_15s";
  if (value <= 60_000) return "15s_to_60s";
  return "over_60s";
}

function safePlan(value: unknown): "free" | "standard" | "full" | undefined {
  return value === "free" || value === "standard" || value === "full" ? value : undefined;
}

function safePaidPlan(value: unknown): "standard" | "full" | undefined {
  return value === "standard" || value === "full" ? value : undefined;
}

function safeFileFormat(value: unknown): "pdf" | "docx" | "doc" | "image" | undefined {
  return value === "pdf" || value === "docx" || value === "doc" || value === "image" ? value : undefined;
}

function safeSizeBand(value: unknown): "under_1mb" | "1mb_to_4mb" | "4mb_to_10mb" | undefined {
  return value === "under_1mb" || value === "1mb_to_4mb" || value === "4mb_to_10mb" ? value : undefined;
}

function safeExtractionMethod(value: unknown): "pdf_parse" | "docx_parser" | "ocr" | undefined {
  return value === "pdf_parse" || value === "docx_parser" || value === "ocr" ? value : undefined;
}

function resolvePreviewSelfIngestUrl(configuredUrl: string, requestOrigin?: string): string {
  if (!requestOrigin) return configuredUrl;
  try {
    const configured = new URL(configuredUrl);
    const incoming = new URL(requestOrigin);
    const teamSuffix = configured.hostname.match(/-([a-z0-9]+)\.vercel\.app$/i)?.[1];
    const deploymentSuffix = teamSuffix ? `-${teamSuffix}.vercel.app` : "";
    const deploymentName = configured.hostname.slice(0, -deploymentSuffix.length);
    const projectPrefix = deploymentName.slice(0, deploymentName.lastIndexOf("-"));
    const isSamePreviewProject =
      incoming.protocol === "https:" &&
      Boolean(teamSuffix && projectPrefix) &&
      incoming.hostname.endsWith(deploymentSuffix) &&
      incoming.hostname.startsWith(`${projectPrefix}-`);
    return isSamePreviewProject ? `${incoming.origin}${PREVIEW_SELF_INGEST_PATH}` : configuredUrl;
  } catch {
    return configuredUrl;
  }
}

/** Maps only safe, low-cardinality ResuNexx telemetry into the Core catalog. */
export function mapAnalyticsToShadowEvent(
  payload: ShadowAnalyticsPayload,
  environment: "development" | "staging" | "production" = "development"
): CoreEventInput | undefined {
  switch (payload.event) {
    case "landing_page_visit":
      return buildNexxCoreEvent({
        eventName: "page.viewed",
        environment,
        source: "client",
        properties: { page_key: "home", page_type: "marketing" }
      });
    case "upload_started":
      return buildNexxCoreEvent({
        eventName: "artifact_upload.started",
        environment,
        source: "client",
        properties: { artifact_type: "resume" }
      });
    case "checkout_clicked":
      return buildNexxCoreEvent({
        eventName: "cta.clicked",
        environment,
        source: "client",
        properties: { cta_key: "checkout", placement: "product_ui", destination_intent: "pricing" }
      });
    case "upload_completed": {
      if (payload.source !== "api_analyze" && payload.source !== "api_pending_report") return undefined;
      const fileFormat = safeFileFormat(payload.metadata?.fileFormat);
      const sizeBand = safeSizeBand(payload.metadata?.sizeBand);
      const extractionMethod = safeExtractionMethod(payload.metadata?.extractionMethod);
      if (!fileFormat || !sizeBand || !extractionMethod) return undefined;
      return buildNexxCoreEvent({
        eventName: "artifact_upload.completed",
        environment,
        source: "server",
        properties: { artifact_type: "resume", file_format: fileFormat, size_band: sizeBand, extraction_method: extractionMethod }
      });
    }
    case "analysis_started": {
      if (payload.source !== "api_analyze" && payload.source !== "polar_verified_payment") return undefined;
      const reportTier = safePlan(payload.metadata?.requestedPlan) ?? (payload.source === "polar_verified_payment" ? "standard" : "free");
      return buildNexxCoreEvent({
        eventName: "assessment.started",
        environment,
        source: "server",
        properties: { assessment_type: "resume", report_tier: reportTier, engine_version: "resume-engine-v1" }
      });
    }
    case "analysis_completed":
      {
        if (payload.source !== "api_analyze" && payload.source !== "polar_verified_payment") return undefined;
        const paidTier = safePaidPlan(payload.metadata?.purchasedPlan);
        const reportTier = paidTier
          ? paidTier
          : payload.source === "polar_verified_payment" ? "standard" : "free";
      return buildNexxCoreEvent({
        eventName: "assessment.completed",
        environment,
        source: "server",
        properties: {
          assessment_type: "resume",
          report_tier: reportTier,
          engine_version: "resume-engine-v1",
          duration_band: durationBand(payload.metadata?.durationMs)
        }
      });
      }
    case "preview_viewed":
      if (payload.source !== "preview_page") return undefined;
      return buildNexxCoreEvent({
        eventName: "report.viewed",
        environment,
        source: "server",
        properties: { report_tier: "free" }
      });
    case "report_viewed": {
      if (payload.source !== "report_page") return undefined;
      const reportTier = safePaidPlan(payload.metadata?.accessPlan);
      if (!reportTier) return undefined;
      return buildNexxCoreEvent({
        eventName: "report.viewed",
        environment,
        source: "server",
        properties: { report_tier: reportTier }
      });
    }
    case "checkout_requested": {
      if (payload.source !== "api_checkout") return undefined;
      const plan = safePaidPlan(payload.metadata?.plan);
      if (!plan) return undefined;
      return buildNexxCoreEvent({
        eventName: "checkout.requested",
        environment,
        source: "server",
        properties: { plan }
      });
    }
    case "checkout_created": {
      if (payload.source !== "api_checkout") return undefined;
      const plan = safePaidPlan(payload.metadata?.plan);
      if (!plan) return undefined;
      return buildNexxCoreEvent({
        eventName: "checkout.created",
        environment,
        source: "server",
        properties: { plan, provider: "polar" }
      });
    }
    case "checkout_cancelled": {
      if (payload.source !== "payment_cancel") return undefined;
      const plan = safePaidPlan(payload.metadata?.plan);
      if (!plan) return undefined;
      return buildNexxCoreEvent({
        eventName: "checkout.cancelled",
        environment,
        source: "server",
        properties: { plan }
      });
    }
    case "pdf_downloaded": {
      if (payload.source !== "api_download") return undefined;
      const reportTier = safePaidPlan(payload.metadata?.accessPlan);
      if (!reportTier) return undefined;
      return buildNexxCoreEvent({
        eventName: "report.downloaded",
        environment,
        source: "server",
        properties: { report_tier: reportTier, format: "pdf" }
      });
    }
    default:
      return undefined;
  }
}

export async function emitShadowAnalyticsEvent(
  payload: ShadowAnalyticsPayload,
  previewRequestAuth?: PreviewShadowRequestAuth
): Promise<boolean> {
  let config: ShadowConfig;
  try {
    config = getShadowConfig();
  } catch (error) {
    console.warn("[nexx-core:shadow] disabled due to invalid local configuration", {
      message: error instanceof Error ? error.message : "unknown configuration error"
    });
    return false;
  }
  if (!config.enabled) return false;

  const event = mapAnalyticsToShadowEvent(payload, config.environment!);
  if (!event) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOCAL_SHADOW_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      "x-nexx-core-token": config.serverToken!,
      "content-type": "application/json"
    };
    const ingestUrl = process.env.VERCEL_ENV === "preview"
      ? resolvePreviewSelfIngestUrl(config.ingestUrl!, previewRequestAuth?.requestOrigin)
      : config.ingestUrl!;
    if (process.env.VERCEL_ENV === "preview") {
      if (previewRequestAuth?.oidcToken) {
        headers["x-vercel-trusted-oidc-idp-token"] = previewRequestAuth.oidcToken;
      }
      if (previewRequestAuth?.cookie) {
        headers.cookie = previewRequestAuth.cookie;
      }
      if (previewRequestAuth?.protectionBypass) {
        headers["x-vercel-protection-bypass"] = previewRequestAuth.protectionBypass;
      }
    }

    const response = await fetch(ingestUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ event }),
      signal: controller.signal,
      cache: "no-store"
    });
    if (!response.ok) {
      console.warn("[nexx-core:shadow] local delivery was not accepted", { status: response.status });
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[nexx-core:shadow] local delivery skipped", {
      reason: error instanceof Error && error.name === "AbortError" ? "timeout" : "unavailable"
    });
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
