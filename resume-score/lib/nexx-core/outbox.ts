import type { CoreEventInput } from "../../nexx-core/packages/contracts/src/index.ts";

export type OutboxEvent = Readonly<{
  outboxId: string;
  event: CoreEventInput;
  status: "queued" | "delivered" | "failed";
  attemptCount: number;
  createdAt: string;
}>;

/**
 * Phase 1 contract only. A durable PostgreSQL implementation is intentionally
 * deferred until the approved non-production database is provisioned.
 */
export interface NexxCoreOutbox {
  enqueue(event: CoreEventInput): Promise<OutboxEvent>;
  markDelivered(outboxId: string): Promise<void>;
  markFailed(outboxId: string, safeErrorCategory: string): Promise<void>;
}
