import type { AcceptedCoreEvent, EventRejection, IngestionResult } from "../../../packages/contracts/src/index.ts";

export interface CoreEventStore {
  findByIdempotencyKey(event: Pick<AcceptedCoreEvent, "productKey" | "environment" | "idempotencyKey">): Promise<Pick<AcceptedCoreEvent, "eventId"> | undefined>;
  appendEvent(event: AcceptedCoreEvent): Promise<"inserted" | "duplicate">;
  appendRejection(rejection: EventRejection): Promise<void>;
}

export class InMemoryCoreEventStore implements CoreEventStore {
  readonly events: AcceptedCoreEvent[] = [];
  readonly rejections: EventRejection[] = [];
  private readonly idempotency = new Map<string, AcceptedCoreEvent>();

  async findByIdempotencyKey(event: Pick<AcceptedCoreEvent, "productKey" | "environment" | "idempotencyKey">): Promise<Pick<AcceptedCoreEvent, "eventId"> | undefined> {
    return this.idempotency.get(eventScopeKey(event));
  }

  async appendEvent(event: AcceptedCoreEvent): Promise<"inserted" | "duplicate"> {
    if (this.idempotency.has(eventScopeKey(event))) return "duplicate";
    this.events.push(event);
    this.idempotency.set(eventScopeKey(event), event);
    return "inserted";
  }

  async appendRejection(rejection: EventRejection): Promise<void> {
    this.rejections.push(rejection);
  }
}

export function eventScopeKey(event: Pick<AcceptedCoreEvent, "productKey" | "environment" | "idempotencyKey">): string {
  return `${event.productKey}:${event.environment}:${event.idempotencyKey}`;
}

export function accepted(eventId: string): IngestionResult {
  return { status: "accepted", eventId };
}
