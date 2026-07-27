import { createHash, randomUUID } from "crypto";

/** Product-scoped, opaque identity references. Never pass email or report IDs. */
export function createAnonymousActorRef(productKey: string): string {
  const entropy = randomUUID();
  const digest = createHash("sha256").update(`${productKey}:${entropy}`).digest("hex");
  return `act_${digest.slice(0, 40)}`;
}

export function createSessionRef(): string {
  return `ses_${randomUUID().replaceAll("-", "")}`;
}

export function createJourneyRef(): string {
  return `jny_${randomUUID().replaceAll("-", "")}`;
}
