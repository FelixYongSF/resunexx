import { CORE_CONTRACT_VERSION, type CoreEventInput } from "../../nexx-core/packages/contracts/src/index.ts";

export type ShadowIngestEnvironment = "staging" | "production";

export type ShadowIngestConfig = Readonly<{
  databaseUrl: string;
  serverToken: string;
  environment: ShadowIngestEnvironment;
}>;

/**
 * The only remotely reachable Core receivers are a same-deployment Preview
 * receiver for staging and a same-deployment Production receiver for minimal
 * Shadow Mode. Every other runtime fails closed.
 */
export function getShadowIngestConfig(
  env: Readonly<Record<string, string | undefined>> = process.env
): ShadowIngestConfig {
  if (
    env.VERCEL_ENV === "preview" &&
    env.NEXX_CORE_ENABLED === "false" &&
    env.NEXX_CORE_ENVIRONMENT === "staging" &&
    env.NEXX_CORE_SHADOW_MODE === "true" &&
    env.NEXX_CORE_SHADOW_TARGET === "staging"
  ) {
    if (!env.NEXX_CORE_STAGING_DATABASE_URL || !env.NEXX_CORE_SERVER_TOKEN) {
      throw new Error("Nexx Core Preview staging configuration is incomplete.");
    }
    return {
      databaseUrl: env.NEXX_CORE_STAGING_DATABASE_URL,
      serverToken: env.NEXX_CORE_SERVER_TOKEN,
      environment: "staging"
    };
  }

  if (
    env.VERCEL_ENV === "production" &&
    env.NEXX_CORE_ENABLED === "true" &&
    env.NEXX_CORE_ENVIRONMENT === "production" &&
    env.NEXX_CORE_SHADOW_MODE === "true" &&
    env.NEXX_CORE_SHADOW_TARGET === "production" &&
    env.NEXX_CORE_INGEST_URL === "vercel-production-self" &&
    env.NEXX_CORE_PRODUCT_KEY === "resunexx" &&
    env.NEXX_CORE_CONTRACT_VERSION === CORE_CONTRACT_VERSION &&
    env.NEXX_CORE_PRIVACY_POLICY_VERSION === "2026-07-01"
  ) {
    if (!env.NEXX_CORE_DATABASE_URL || !env.NEXX_CORE_SERVER_TOKEN) {
      throw new Error("Nexx Core Production Shadow configuration is incomplete.");
    }
    return {
      databaseUrl: env.NEXX_CORE_DATABASE_URL,
      serverToken: env.NEXX_CORE_SERVER_TOKEN,
      environment: "production"
    };
  }

  throw new Error("Nexx Core Shadow ingestion is disabled.");
}

export function isCoreEventInputForEnvironment(
  value: unknown,
  environment: ShadowIngestEnvironment
): value is CoreEventInput {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) &&
    typeof (value as { eventId?: unknown }).eventId === "string" &&
    typeof (value as { idempotencyKey?: unknown }).idempotencyKey === "string" &&
    typeof (value as { eventName?: unknown }).eventName === "string" &&
    typeof (value as { productKey?: unknown }).productKey === "string" &&
    (value as { environment?: unknown }).environment === environment;
}
