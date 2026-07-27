import type { CoreEventInput } from "../../nexx-core/packages/contracts/src/index.ts";

export type PreviewStagingConfig = Readonly<{
  databaseUrl: string;
  serverToken: string;
}>;

/** Gate B's only remote Core path: Preview runtime, staging data, Core disabled. */
export function getPreviewStagingConfig(
  env: Readonly<Record<string, string | undefined>> = process.env
): PreviewStagingConfig {
  if (
    env.VERCEL_ENV !== "preview" ||
    env.NEXX_CORE_ENABLED === "true" ||
    env.NEXX_CORE_ENVIRONMENT !== "staging" ||
    env.NEXX_CORE_SHADOW_MODE !== "true" ||
    env.NEXX_CORE_SHADOW_TARGET !== "staging"
  ) {
    throw new Error("Nexx Core Preview staging ingestion is disabled.");
  }
  if (!env.NEXX_CORE_STAGING_DATABASE_URL || !env.NEXX_CORE_SERVER_TOKEN) {
    throw new Error("Nexx Core Preview staging configuration is incomplete.");
  }
  return {
    databaseUrl: env.NEXX_CORE_STAGING_DATABASE_URL,
    serverToken: env.NEXX_CORE_SERVER_TOKEN
  };
}

export function isCoreEventInput(value: unknown): value is CoreEventInput {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) &&
    typeof (value as { eventId?: unknown }).eventId === "string" &&
    typeof (value as { idempotencyKey?: unknown }).idempotencyKey === "string" &&
    typeof (value as { eventName?: unknown }).eventName === "string" &&
    typeof (value as { productKey?: unknown }).productKey === "string" &&
    (value as { environment?: unknown }).environment === "staging";
}
