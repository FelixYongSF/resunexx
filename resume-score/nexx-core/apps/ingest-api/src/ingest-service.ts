import type { CoreEventInput, IngestionResult } from "../../../packages/contracts/src/index.ts";
import { sanitizeCoreEvent, type SanitizeOptions } from "../../../packages/privacy/src/event-sanitizer.ts";
import { accepted, type CoreEventStore } from "./event-store.ts";

export class CoreIngestionService {
  private readonly store: CoreEventStore;
  private readonly sanitizeOptions: SanitizeOptions;

  constructor(
    store: CoreEventStore,
    sanitizeOptions: SanitizeOptions
  ) {
    this.store = store;
    this.sanitizeOptions = sanitizeOptions;
  }

  async ingest(input: CoreEventInput): Promise<IngestionResult> {
    const sanitized = sanitizeCoreEvent(input, this.sanitizeOptions);
    if (!sanitized.ok) {
      await this.store.appendRejection(sanitized.rejection);
      return { status: "rejected", rejection: sanitized.rejection };
    }

    const existing = await this.store.findByIdempotencyKey(sanitized.event);
    if (existing) return { status: "duplicate", eventId: existing.eventId };

    const appended = await this.store.appendEvent(sanitized.event);
    if (appended === "duplicate") {
      const duplicate = await this.store.findByIdempotencyKey(sanitized.event);
      return { status: "duplicate", eventId: duplicate?.eventId ?? sanitized.event.eventId };
    }
    return accepted(sanitized.event.eventId);
  }
}
