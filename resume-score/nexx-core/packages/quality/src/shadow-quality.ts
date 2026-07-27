import { sanitizeCoreEvent } from "../../privacy/src/event-sanitizer.ts";
import type { CoreEventInput } from "../../contracts/src/index.ts";

export const SHADOW_EVENT_NAMES = [
  "page.viewed",
  "artifact_upload.started",
  "cta.clicked",
  "assessment.completed",
] as const;

export type ShadowEventName = (typeof SHADOW_EVENT_NAMES)[number];

export type ShadowQualityResult = Readonly<{
  passed: boolean;
  inspectedEventCount: number;
  sourceCounts: Readonly<Record<ShadowEventName, number>>;
  replicaCounts: Readonly<Record<ShadowEventName, number>>;
  failures: readonly string[];
}>;

const EMAIL_PATTERN = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;
const FORBIDDEN_VALUE_PATTERN = /-----BEGIN |\b(sk|pk|whsec|polar_oat)_[a-z0-9_-]+/i;

function emptyCounts(): Record<ShadowEventName, number> {
  return Object.fromEntries(SHADOW_EVENT_NAMES.map((eventName) => [eventName, 0])) as Record<ShadowEventName, number>;
}

function countByName(events: readonly Pick<CoreEventInput, "eventName">[]): Record<ShadowEventName, number> {
  const counts = emptyCounts();
  for (const event of events) {
    if ((SHADOW_EVENT_NAMES as readonly string[]).includes(event.eventName)) {
      counts[event.eventName as ShadowEventName] += 1;
    }
  }
  return counts;
}

function containsSensitiveValue(event: CoreEventInput): boolean {
  return Object.values(event.properties ?? {}).some((value) =>
    typeof value === "string" && (EMAIL_PATTERN.test(value) || FORBIDDEN_VALUE_PATTERN.test(value))
  );
}

/**
 * Validates only the small event surface emitted by the local Shadow adapter.
 * It deliberately works with aggregate counts and never returns event payloads.
 */
export function evaluateShadowModeDataQuality(args: Readonly<{
  sourceEvents: readonly CoreEventInput[];
  replicaCounts: Readonly<Record<ShadowEventName, number>>;
  allowedEnvironment?: "development" | "staging";
}>): ShadowQualityResult {
  const failures: string[] = [];
  const relevantEvents = args.sourceEvents.filter((event) =>
    (SHADOW_EVENT_NAMES as readonly string[]).includes(event.eventName)
  );
  const sourceCounts = countByName(relevantEvents);
  const eventIds = new Set<string>();
  const idempotencyKeys = new Set<string>();

  for (const event of relevantEvents) {
    if (eventIds.has(event.eventId)) failures.push("Duplicate Shadow event ID detected.");
    eventIds.add(event.eventId);
    if (idempotencyKeys.has(event.idempotencyKey)) failures.push("Duplicate Shadow idempotency key detected.");
    idempotencyKeys.add(event.idempotencyKey);

    const sanitized = sanitizeCoreEvent(event, { allowedEnvironments: [args.allowedEnvironment ?? "development"] });
    if (!sanitized.ok) failures.push(`Catalog or privacy validation failed for ${event.eventName}.`);
    if (event.actorRef || event.sessionId || event.journeyId || event.correlationId || event.causationId) {
      failures.push(`Shadow event ${event.eventName} contains an unexpected person or journey reference.`);
    }
    if (Object.keys(event.entityRefs ?? {}).length > 0) {
      failures.push(`Shadow event ${event.eventName} contains an unexpected entity reference.`);
    }
    if (containsSensitiveValue(event)) failures.push(`Shadow event ${event.eventName} contains a sensitive-looking property value.`);
  }

  for (const eventName of SHADOW_EVENT_NAMES) {
    if (sourceCounts[eventName] === 0) failures.push(`Expected Shadow event is missing: ${eventName}.`);
    if (sourceCounts[eventName] !== args.replicaCounts[eventName]) {
      failures.push(`Source and encrypted local replica counts differ for ${eventName}.`);
    }
  }

  return {
    passed: failures.length === 0,
    inspectedEventCount: relevantEvents.length,
    sourceCounts,
    replicaCounts: args.replicaCounts,
    failures: [...new Set(failures)],
  };
}
