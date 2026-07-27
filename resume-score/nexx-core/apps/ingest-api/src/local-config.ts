import type { CoreEnvironment } from "../../../packages/contracts/src/index.ts";

const LOCAL_ENVIRONMENTS: readonly CoreEnvironment[] = ["development", "test", "staging"];

export function resolveLocalCoreConfig(environment = process.env.NEXX_CORE_ENVIRONMENT): {
  enabled: boolean;
  allowedEnvironments: readonly CoreEnvironment[];
} {
  if (process.env.NEXX_CORE_ENABLED === "true") {
    throw new Error("Nexx Core cannot be enabled during Phase 1 foundation work.");
  }

  if (environment && !LOCAL_ENVIRONMENTS.includes(environment as CoreEnvironment)) {
    throw new Error("Only development, test, or staging Core environments are permitted during Phase 1.");
  }

  return { enabled: false, allowedEnvironments: LOCAL_ENVIRONMENTS };
}
