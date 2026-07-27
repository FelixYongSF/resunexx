import assert from "node:assert/strict";
import { mkdtemp, mkdir, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { randomBytes, randomUUID } from "node:crypto";
import { createEncryptedExport, openLocalReplica, applyExport, currentWatermark, isExportApplied, readAndVerifyExport } from "../nexx-core/packages/local-replication/src/index.ts";

test("encrypted export is integrity-checked and resumes safely after an interrupted apply", async () => {
  const root = await mkdtemp(join(tmpdir(), "nexx-local-replication-"));
  const exportsDirectory = join(root, "exports");
  const dataDirectory = join(root, "pglite");
  await mkdir(exportsDirectory, { recursive: true });
  const key = randomBytes(32);
  const eventId = randomUUID();
  const manifest = await createEncryptedExport({
    exportsDirectory,
    sourceEnvironment: "development",
    key,
    payload: {
      exportedAt: "2026-07-26T00:00:00.000Z",
      registry: [{ product_id: randomUUID(), product_key: "synthetic" }],
      events: [{ eventId, receivedAt: "2026-07-26T00:00:00.000Z", eventName: "upload_validated", payload: { fixture: true } }],
      paymentFacts: [{ providerEventId: "evt_fixture_payment_0001", receivedAt: "2026-07-26T00:00:00.000Z", factType: "order_paid", payload: { fixture: true } }],
      nextWatermark: { receivedAt: "2026-07-26T00:00:00.000Z", eventId },
    },
  });
  const archive = await readAndVerifyExport({ exportsDirectory, manifestFile: `${manifest.exportId}.manifest.json`, key });
  const db = await openLocalReplica(dataDirectory);
  try {
    assert.equal(await isExportApplied(db, manifest.exportId), false);
    await applyExport(db, archive.manifest, archive.payload);
    await applyExport(db, archive.manifest, archive.payload);
    assert.equal(await isExportApplied(db, manifest.exportId), true);
    assert.deepEqual(await currentWatermark(db), archive.payload.nextWatermark);
    const count = await db.query<{ count: number }>("SELECT count(*)::int AS count FROM local_replica.events");
    assert.equal(count.rows[0]?.count, 1);
    const paymentFactCount = await db.query<{ count: number }>("SELECT count(*)::int AS count FROM local_replica.payment_facts");
    assert.equal(paymentFactCount.rows[0]?.count, 1);
  } finally {
    await db.close();
    await rm(root, { recursive: true, force: true });
  }
});

test("changing a manifest is rejected before local apply", async () => {
  const root = await mkdtemp(join(tmpdir(), "nexx-local-replication-"));
  const exportsDirectory = join(root, "exports");
  await mkdir(exportsDirectory, { recursive: true });
  const key = randomBytes(32);
  const manifest = await createEncryptedExport({
    exportsDirectory,
    sourceEnvironment: "development",
    key,
    payload: { exportedAt: new Date().toISOString(), registry: [], events: [], paymentFacts: [] },
  });
  const manifestPath = join(exportsDirectory, `${manifest.exportId}.manifest.json`);
  const tampered = JSON.parse(await (await import("node:fs/promises")).readFile(manifestPath, "utf8"));
  tampered.eventCount = 999;
  await (await import("node:fs/promises")).writeFile(manifestPath, JSON.stringify(tampered));
  await assert.rejects(() => readAndVerifyExport({ exportsDirectory, manifestFile: `${manifest.exportId}.manifest.json`, key }), /manifest integrity/);
  await rm(root, { recursive: true, force: true });
});
