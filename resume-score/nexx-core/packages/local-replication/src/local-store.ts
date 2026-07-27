import { PGlite } from "@electric-sql/pglite";
import type { ReplicaPayload, ReplicationManifest, ReplicationWatermark } from "./types.ts";

const REPLICA_NAME = "nexx-core";

export async function openLocalReplica(dataDirectory: string): Promise<PGlite> {
  const db = new PGlite(dataDirectory);
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS local_replica;
    CREATE TABLE IF NOT EXISTS local_replica.registry_rows (
      source_key text PRIMARY KEY,
      payload jsonb NOT NULL,
      synced_at timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS local_replica.events (
      event_id uuid PRIMARY KEY,
      received_at timestamptz NOT NULL,
      received_at_text text,
      event_name text NOT NULL,
      payload jsonb NOT NULL
    );
    ALTER TABLE local_replica.events ADD COLUMN IF NOT EXISTS received_at_text text;
    CREATE INDEX IF NOT EXISTS local_replica_events_received_idx
      ON local_replica.events (received_at, event_id);
    CREATE TABLE IF NOT EXISTS local_replica.payment_facts (
      provider_event_id text PRIMARY KEY,
      received_at timestamptz NOT NULL,
      received_at_text text,
      fact_type text NOT NULL,
      payload jsonb NOT NULL
    );
    CREATE INDEX IF NOT EXISTS local_replica_payment_facts_received_idx
      ON local_replica.payment_facts (received_at, provider_event_id);
    CREATE TABLE IF NOT EXISTS local_replica.sync_state (
      replica_name text PRIMARY KEY,
      watermark_at timestamptz,
      watermark_received_at_text text,
      watermark_event_id uuid,
      last_export_id uuid,
      updated_at timestamptz NOT NULL
    );
    ALTER TABLE local_replica.sync_state
      ADD COLUMN IF NOT EXISTS watermark_received_at_text text;
    CREATE TABLE IF NOT EXISTS local_replica.applied_exports (
      export_id uuid PRIMARY KEY,
      manifest_mac text NOT NULL,
      applied_at timestamptz NOT NULL
    );
  `);
  return db;
}

export async function currentWatermark(db: PGlite): Promise<ReplicationWatermark | undefined> {
  const result = await db.query<{ received_at: string | null; received_at_text: string | null; event_id: string | null }>(`
    SELECT received_at::text, received_at_text, event_id::text
    FROM local_replica.events
    ORDER BY received_at_text DESC NULLS LAST, event_id::text DESC
    LIMIT 1
  `);
  const row = result.rows[0];
  if (!row?.received_at || !row.event_id) return undefined;
  return { receivedAt: row.received_at_text ?? row.received_at, eventId: row.event_id };
}

export async function isExportApplied(db: PGlite, exportId: string): Promise<boolean> {
  const result = await db.query<{ applied: boolean }>(`
    SELECT EXISTS(SELECT 1 FROM local_replica.applied_exports WHERE export_id = $1::uuid) AS applied
  `, [exportId]);
  return result.rows[0]?.applied === true;
}

export async function existingEventIds(db: PGlite, eventIds: readonly string[]): Promise<Set<string>> {
  if (eventIds.length === 0) return new Set();
  const result = await db.query<{ event_id: string }>(`
    SELECT event_id::text FROM local_replica.events WHERE event_id = ANY($1::uuid[])
  `, [eventIds]);
  return new Set(result.rows.map((row) => row.event_id));
}

export async function existingPaymentFactIds(db: PGlite, providerEventIds: readonly string[]): Promise<Set<string>> {
  if (providerEventIds.length === 0) return new Set();
  const result = await db.query<{ provider_event_id: string }>(`
    SELECT provider_event_id FROM local_replica.payment_facts WHERE provider_event_id = ANY($1::text[])
  `, [providerEventIds]);
  return new Set(result.rows.map((row) => row.provider_event_id));
}

export async function applyExport(db: PGlite, manifest: ReplicationManifest, payload: ReplicaPayload): Promise<void> {
  if (await isExportApplied(db, manifest.exportId)) return;

  await db.transaction(async (transaction) => {
    for (const row of payload.registry) {
      const sourceKey = String(row.product_id ?? row.product_key ?? JSON.stringify(row));
      await transaction.query(`
        INSERT INTO local_replica.registry_rows (source_key, payload, synced_at)
        VALUES ($1, $2::jsonb, now())
        ON CONFLICT (source_key) DO UPDATE SET payload = EXCLUDED.payload, synced_at = EXCLUDED.synced_at
      `, [sourceKey, JSON.stringify(row)]);
    }

    for (const event of payload.events) {
      await transaction.query(`
        INSERT INTO local_replica.events (event_id, received_at, received_at_text, event_name, payload)
        VALUES ($1::uuid, $2::timestamptz, $3, $4, $5::jsonb)
        ON CONFLICT (event_id) DO NOTHING
      `, [event.eventId, event.receivedAt, event.receivedAt, event.eventName, JSON.stringify(event.payload)]);
    }

    for (const fact of payload.paymentFacts ?? []) {
      await transaction.query(`
        INSERT INTO local_replica.payment_facts (provider_event_id, received_at, received_at_text, fact_type, payload)
        VALUES ($1, $2::timestamptz, $3, $4, $5::jsonb)
        ON CONFLICT (provider_event_id) DO NOTHING
      `, [fact.providerEventId, fact.receivedAt, fact.receivedAt, fact.factType, JSON.stringify(fact.payload)]);
    }

    await transaction.query(`
      INSERT INTO local_replica.applied_exports (export_id, manifest_mac, applied_at)
      VALUES ($1::uuid, $2, now())
    `, [manifest.exportId, manifest.manifestMac]);

    if (payload.nextWatermark) {
      await transaction.query(`
        INSERT INTO local_replica.sync_state (replica_name, watermark_at, watermark_received_at_text, watermark_event_id, last_export_id, updated_at)
        VALUES ($1, $2::timestamptz, $3, $4::uuid, $5::uuid, now())
        ON CONFLICT (replica_name) DO UPDATE SET
          watermark_at = EXCLUDED.watermark_at,
          watermark_received_at_text = EXCLUDED.watermark_received_at_text,
          watermark_event_id = EXCLUDED.watermark_event_id,
          last_export_id = EXCLUDED.last_export_id,
          updated_at = EXCLUDED.updated_at
      `, [REPLICA_NAME, payload.nextWatermark.receivedAt, payload.nextWatermark.receivedAt, payload.nextWatermark.eventId, manifest.exportId]);
    }
  });
}

export async function localEventSummary(db: PGlite): Promise<ReadonlyArray<Readonly<{ eventName: string; eventCount: number }>>> {
  const result = await db.query<{ event_name: string; event_count: number }>(`
    SELECT event_name, count(*)::int AS event_count
    FROM local_replica.events
    GROUP BY event_name
    ORDER BY event_name
  `);
  return result.rows.map((row) => ({ eventName: row.event_name, eventCount: row.event_count }));
}

export async function localPaymentFactSummary(db: PGlite): Promise<ReadonlyArray<Readonly<{ factType: string; factCount: number }>>> {
  const result = await db.query<{ fact_type: string; fact_count: number }>(`
    SELECT fact_type, count(*)::int AS fact_count
    FROM local_replica.payment_facts
    GROUP BY fact_type
    ORDER BY fact_type
  `);
  return result.rows.map((row) => ({ factType: row.fact_type, factCount: row.fact_count }));
}

export async function localEventCountsByName(db: PGlite, eventNames: readonly string[]): Promise<Readonly<Record<string, number>>> {
  if (eventNames.length === 0) return {};
  const result = await db.query<{ event_name: string; event_count: number }>(`
    SELECT event_name, count(*)::int AS event_count
    FROM local_replica.events
    WHERE event_name = ANY($1::text[])
    GROUP BY event_name
  `, [eventNames]);
  const counts: Record<string, number> = Object.fromEntries(eventNames.map((eventName) => [eventName, 0]));
  for (const row of result.rows) counts[row.event_name] = row.event_count;
  return counts;
}
