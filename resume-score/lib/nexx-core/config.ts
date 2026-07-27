import type { CoreEnvironment } from "../../nexx-core/packages/contracts/src/index.ts";

const NON_PRODUCTION_ENVIRONMENTS: readonly CoreEnvironment[] = ["development", "test", "staging"];

export type NexxCorePhase1Config = Readonly<{
  enabled: false;
  environment: CoreEnvironment;
  contractVersion: string;
}>;

/**
 * Phase 1 deliberately has no active product emission. This configuration
 * boundary makes an accidental production activation fail closed.
 */
export function getNexxCorePhase1Config(
  env: Readonly<Record<string, string | undefined>> = process.env
): NexxCorePhase1Config {
  if (env.NEXX_CORE_ENABLED === "true") {
    throw new Error("Nexx Core emission is disabled until Phase 2 authorization.");
  }

  const environment = (env.NEXX_CORE_ENVIRONMENT || "development") as CoreEnvironment;
  if (!NON_PRODUCTION_ENVIRONMENTS.includes(environment)) {
    throw new Error("Nexx Core Phase 1 only permits development, test, or staging.");
  }

  return {
    enabled: false,
    environment,
    contractVersion: env.NEXX_CORE_CONTRACT_VERSION || "nexx-core-event-v1"
  };
}
