import type { CoreEventInput } from "../../nexx-core/packages/contracts/src/index.ts";
import { getShadowIngestConfig, isCoreEventInputForEnvironment } from "./shadow-ingest-config.ts";

export type PreviewStagingConfig = Readonly<{
  databaseUrl: string;
  serverToken: string;
}>;

/** Gate B's only remote Core path: Preview runtime, staging data, Core disabled. */
export function getPreviewStagingConfig(
  env: Readonly<Record<string, string | undefined>> = process.env
): PreviewStagingConfig {
  const config = getShadowIngestConfig(env);
  if (config.environment !== "staging") throw new Error("Nexx Core Preview staging ingestion is disabled.");
  return config;
}

export function isCoreEventInput(value: unknown): value is CoreEventInput {
  return isCoreEventInputForEnvironment(value, "staging");
}
