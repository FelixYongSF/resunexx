import {
  CORE_ENVIRONMENTS,
  EVENT_SOURCES,
  RESUNEXX_EVENT_CATALOG,
  propertyValueMatchesRule,
  type AcceptedCoreEvent,
  type CoreEventInput,
  type EventRejection,
  type RejectionReasonCode
} from "../../contracts/src/index.ts";

const FORBIDDEN_PROPERTY_NAMES = /(email|e-mail|name|phone|address|linkedin|filename|file_name|resume|cv|text|content|prompt|response|job_description|raw|token|secret|password|ip|user_agent)/i;
const OPAQUE_REFERENCE_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{7,127}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;

export type SanitizeOptions = Readonly<{
  allowedEnvironments: readonly (typeof CORE_ENVIRONMENTS)[number][];
  now?: Date;
}>;

export type SanitizationResult =
  | Readonly<{ ok: true; event: AcceptedCoreEvent }>
  | Readonly<{ ok: false; rejection: EventRejection }>;

function rejection(input: Partial<CoreEventInput>, reasonCode: RejectionReasonCode, safeDetail?: string): SanitizationResult {
  return {
    ok: false,
    rejection: {
      rejectionId: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      productKey: typeof input.productKey === "string" ? input.productKey : undefined,
      environment: typeof input.environment === "string" ? input.environment : undefined,
      eventName: typeof input.eventName === "string" ? input.eventName : undefined,
      reasonCode,
      safeDetail
    }
  };
}

function isOpaqueReference(value: string): boolean {
  return OPAQUE_REFERENCE_PATTERN.test(value) && !EMAIL_PATTERN.test(value);
}

function isValidOccurredAt(value: string): boolean {
  const time = Date.parse(value);
  return Number.isFinite(time) && time <= Date.now() + 5 * 60 * 1000;
}

export function sanitizeCoreEvent(input: CoreEventInput, options: SanitizeOptions): SanitizationResult {
  if (!options.allowedEnvironments.includes(input.environment)) {
    return rejection(input, "environment_not_allowed");
  }

  if (
    !UUID_PATTERN.test(input.eventId) ||
    input.idempotencyKey.length < 12 ||
    !input.productKey ||
    !input.productContractVersion ||
    !input.privacyPolicyVersion ||
    !isValidOccurredAt(input.occurredAt)
  ) {
    return rejection(input, "invalid_envelope");
  }

  const definition = RESUNEXX_EVENT_CATALOG[input.eventName];
  if (!definition) return rejection(input, "unknown_event");
  if (input.eventVersion !== definition.version) return rejection(input, "unsupported_event_version");
  if (!EVENT_SOURCES.includes(input.source) || !definition.allowedSources.includes(input.source)) {
    return rejection(input, "invalid_source");
  }

  for (const value of [input.actorRef, input.sessionId, input.journeyId, input.correlationId, input.causationId]) {
    if (value && !isOpaqueReference(value)) return rejection(input, "invalid_entity_reference");
  }

  for (const [key, value] of Object.entries(input.entityRefs ?? {})) {
    if (FORBIDDEN_PROPERTY_NAMES.test(key) || !isOpaqueReference(value)) {
      return rejection(input, "invalid_entity_reference");
    }
  }

  for (const [key, value] of Object.entries(input.properties ?? {})) {
    if (FORBIDDEN_PROPERTY_NAMES.test(key) || (typeof value === "string" && EMAIL_PATTERN.test(value))) {
      return rejection(input, "sensitive_property", key);
    }
    const propertyRule = definition.allowedProperties[key];
    if (!propertyRule) return rejection(input, "unknown_property", key);
    if (!propertyValueMatchesRule(value, propertyRule)) return rejection(input, "invalid_property", key);
  }

  return {
    ok: true,
    event: {
      ...input,
      receivedAt: (options.now ?? new Date()).toISOString(),
      schemaVersion: `resunexx:${input.eventName}:v${input.eventVersion}`,
      dataClassification: "pseudonymous",
      retentionClass: "raw_pseudonymous_event"
    }
  };
}
