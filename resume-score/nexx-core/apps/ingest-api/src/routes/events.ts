import type { CoreEventInput, IngestionResult } from "../../../../packages/contracts/src/index.ts";
import type { ProductRegistry } from "../../../../packages/registry/src/index.ts";
import type { CoreIngestionService } from "../ingest-service.ts";

export type IngestionRequest = Readonly<{
  authorization?: string;
  event: CoreEventInput;
}>;

export type IngestionRouteResult = Readonly<{
  status: number;
  body: IngestionResult | { error: "unauthorized" | "contract_mismatch" };
}>;

/**
 * Framework-neutral handler for the future POST /v1/events endpoint. It is not
 * mounted in ResuNexx during Phase 1, so no customer request can reach it.
 */
export function createIngestionRoute(
  registry: ProductRegistry,
  ingestService: CoreIngestionService,
  expectedServerToken: string
) {
  return async (request: IngestionRequest): Promise<IngestionRouteResult> => {
    if (!expectedServerToken || request.authorization !== `Bearer ${expectedServerToken}`) {
      return { status: 401, body: { error: "unauthorized" } };
    }

    const product = registry.find(request.event.productKey);
    if (
      !product ||
      product.contractVersion !== request.event.productContractVersion ||
      !product.allowedEnvironments.includes(request.event.environment)
    ) {
      return { status: 409, body: { error: "contract_mismatch" } };
    }

    const result = await ingestService.ingest(request.event);
    return { status: result.status === "rejected" ? 400 : 202, body: result };
  };
}
