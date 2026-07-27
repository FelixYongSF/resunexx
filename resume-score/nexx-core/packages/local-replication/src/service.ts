import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { createEncryptedExport, readAndVerifyExport } from "./manifest.ts";
import { applyExport, currentWatermark, existingEventIds, existingPaymentFactIds, isExportApplied, openLocalReplica } from "./local-store.ts";
import { readSourceDelta } from "./source.ts";
import type { LocalReplicationResult } from "./types.ts";

async function applyPendingExports(args: Readonly<{ exportsDirectory: string; dataDirectory: string; key: Buffer }>): Promise<boolean> {
  const manifestFiles = (await readdir(args.exportsDirectory)).filter((file) => file.endsWith(".manifest.json")).sort();
  const db = await openLocalReplica(args.dataDirectory);
  try {
    for (const manifestFile of manifestFiles) {
      const { manifest, payload } = await readAndVerifyExport({ exportsDirectory: args.exportsDirectory, manifestFile, key: args.key });
      if (await isExportApplied(db, manifest.exportId)) continue;
      await applyExport(db, manifest, payload);
      return true;
    }
    return false;
  } finally {
    await db.close();
  }
}

export async function replicateLocal(args: Readonly<{
  databaseUrl: string;
  environment: "development" | "test" | "staging";
  exportsDirectory: string;
  dataDirectory: string;
  key: Buffer;
  failAfterExport?: boolean;
}>): Promise<LocalReplicationResult> {
  const resumedPendingExport = await applyPendingExports(args);
  const db = await openLocalReplica(args.dataDirectory);
  try {
    const watermark = await currentWatermark(db);
    const payload = await readSourceDelta({ databaseUrl: args.databaseUrl, environment: args.environment, watermark });
    const knownEventIds = await existingEventIds(db, payload.events.map((event) => event.eventId));
    const newEvents = payload.events.filter((event) => !knownEventIds.has(event.eventId));
    const knownPaymentFactIds = await existingPaymentFactIds(db, payload.paymentFacts.map((fact) => fact.providerEventId));
    const newPaymentFacts = payload.paymentFacts.filter((fact) => !knownPaymentFactIds.has(fact.providerEventId));
    if (newEvents.length === 0 && newPaymentFacts.length === 0) {
      return { exportId: "no-new-events", eventCount: 0, paymentFactCount: 0, registryCount: 0, resumedPendingExport };
    }
    const exportPayload = { ...payload, events: newEvents, paymentFacts: newPaymentFacts, nextWatermark: newEvents.at(-1) ? {
      receivedAt: newEvents.at(-1)!.receivedAt,
      eventId: newEvents.at(-1)!.eventId,
    } : watermark };
    const manifest = await createEncryptedExport({
      exportsDirectory: args.exportsDirectory,
      sourceEnvironment: args.environment,
      payload: exportPayload,
      previousWatermark: watermark,
      key: args.key,
    });
    if (args.failAfterExport) throw new Error("Simulated interruption after encrypted export.");
    await applyExport(db, manifest, exportPayload);
    return {
      exportId: manifest.exportId,
      eventCount: manifest.eventCount,
      paymentFactCount: manifest.paymentFactCount ?? 0,
      registryCount: manifest.registryCount,
      resumedPendingExport,
    };
  } finally {
    await db.close();
  }
}

export async function verifyReplicaReadOnly(args: Readonly<{ dataDirectory: string }>): Promise<Readonly<{
  events: ReadonlyArray<Readonly<{ eventName: string; eventCount: number }>>;
  paymentFacts: ReadonlyArray<Readonly<{ factType: string; factCount: number }>>;
}>> {
  const { localEventSummary, localPaymentFactSummary } = await import("./local-store.ts");
  const db = await openLocalReplica(args.dataDirectory);
  try {
    return { events: await localEventSummary(db), paymentFacts: await localPaymentFactSummary(db) };
  } finally {
    await db.close();
  }
}

export function replicationManifestPath(exportsDirectory: string, exportId: string): string {
  return join(exportsDirectory, `${exportId}.manifest.json`);
}
