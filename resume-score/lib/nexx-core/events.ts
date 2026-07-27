import { randomUUID } from "crypto";
import {
  CORE_CONTRACT_VERSION,
  type CoreEnvironment,
  type CoreEventInput,
  type EventSource,
  type SafeProperties
} from "../../nexx-core/packages/contracts/src/index.ts";

type EventBuildInput = Readonly<{
  eventName: string;
  occurredAt?: Date;
  productKey?: string;
  environment: CoreEnvironment;
  source: EventSource;
  properties?: SafeProperties;
  actorRef?: string;
  sessionId?: string;
  journeyId?: string;
  entityRefs?: Record<string, string>;
  idempotencyKey?: string;
}>;

/** Creates a contract-shaped event; validation occurs in the Core ingest service. */
export function buildNexxCoreEvent(input: EventBuildInput): CoreEventInput {
  const eventId = randomUUID();
  return {
    eventId,
    idempotencyKey: input.idempotencyKey || `idem_${randomUUID().replaceAll("-", "")}`,
    eventName: input.eventName,
    eventVersion: 1,
    occurredAt: (input.occurredAt || new Date()).toISOString(),
    productKey: input.productKey || "resunexx",
    environment: input.environment,
    source: input.source,
    productContractVersion: CORE_CONTRACT_VERSION,
    privacyPolicyVersion: "2026-07-01",
    consentPolicyVersion: "2026-07-01",
    actorRef: input.actorRef,
    sessionId: input.sessionId,
    journeyId: input.journeyId,
    entityRefs: input.entityRefs,
    properties: input.properties
  };
}
