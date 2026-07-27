export const CORE_CONTRACT_VERSION = "nexx-core-event-v1" as const;

export const CORE_ENVIRONMENTS = ["development", "test", "staging", "production"] as const;
export type CoreEnvironment = (typeof CORE_ENVIRONMENTS)[number];

export const EVENT_SOURCES = ["client", "server", "webhook", "backfill"] as const;
export type EventSource = (typeof EVENT_SOURCES)[number];

export type EntityRefs = Readonly<Record<string, string>>;
export type SafePropertyValue = string | number | boolean | null;
export type SafeProperties = Readonly<Record<string, SafePropertyValue>>;

export type CoreEventInput = Readonly<{
  eventId: string;
  idempotencyKey: string;
  eventName: string;
  eventVersion: 1;
  occurredAt: string;
  productKey: string;
  environment: CoreEnvironment;
  source: EventSource;
  productContractVersion: string;
  privacyPolicyVersion: string;
  consentPolicyVersion?: string;
  actorRef?: string;
  sessionId?: string;
  journeyId?: string;
  correlationId?: string;
  causationId?: string;
  entityRefs?: EntityRefs;
  properties?: SafeProperties;
}>;

export type AcceptedCoreEvent = CoreEventInput & Readonly<{
  receivedAt: string;
  schemaVersion: string;
  dataClassification: "pseudonymous";
  retentionClass: "raw_pseudonymous_event";
}>;

export type EventRejection = Readonly<{
  rejectionId: string;
  receivedAt: string;
  productKey?: string;
  environment?: string;
  eventName?: string;
  reasonCode: RejectionReasonCode;
  safeDetail?: string;
}>;

export type RejectionReasonCode =
  | "environment_not_allowed"
  | "invalid_envelope"
  | "unknown_event"
  | "unsupported_event_version"
  | "invalid_source"
  | "invalid_property"
  | "unknown_property"
  | "sensitive_property"
  | "invalid_entity_reference";

export type IngestionResult = Readonly<{
  status: "accepted" | "duplicate" | "rejected";
  eventId?: string;
  rejection?: EventRejection;
}>;
