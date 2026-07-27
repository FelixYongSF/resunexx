import { readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { randomUUID } from "node:crypto";
import { decrypt, encrypt, manifestMac, sha256 } from "./crypto.ts";
import type { ReplicaPayload, ReplicationManifest } from "./types.ts";

export function manifestSigningPayload(manifest: Omit<ReplicationManifest, "manifestMac">): string {
  return JSON.stringify(manifest);
}

export async function createEncryptedExport(args: Readonly<{
  exportsDirectory: string;
  sourceEnvironment: ReplicationManifest["sourceEnvironment"];
  payload: ReplicaPayload;
  previousWatermark?: ReplicationManifest["previousWatermark"];
  key: Buffer;
}>): Promise<ReplicationManifest> {
  const exportId = randomUUID();
  const archiveFile = `${exportId}.json.aes`;
  const ciphertext = encrypt(Buffer.from(JSON.stringify(args.payload)), args.key);
  const unsignedManifest: Omit<ReplicationManifest, "manifestMac"> = {
    version: 1,
    exportId,
    createdAt: new Date().toISOString(),
    sourceEnvironment: args.sourceEnvironment,
    previousWatermark: args.previousWatermark,
    nextWatermark: args.payload.nextWatermark,
    eventCount: args.payload.events.length,
    paymentFactCount: args.payload.paymentFacts.length,
    registryCount: args.payload.registry.length,
    archiveFile,
    ciphertextSha256: sha256(ciphertext),
  };
  const manifest: ReplicationManifest = {
    ...unsignedManifest,
    manifestMac: manifestMac(manifestSigningPayload(unsignedManifest), args.key),
  };

  await writeFile(join(args.exportsDirectory, archiveFile), ciphertext, { mode: 0o600 });
  await writeFile(join(args.exportsDirectory, `${exportId}.manifest.json`), JSON.stringify(manifest, null, 2), { mode: 0o600 });
  return manifest;
}

export async function readAndVerifyExport(args: Readonly<{
  exportsDirectory: string;
  manifestFile: string;
  key: Buffer;
}>): Promise<Readonly<{ manifest: ReplicationManifest; payload: ReplicaPayload }>> {
  const manifest: ReplicationManifest = JSON.parse(await readFile(join(args.exportsDirectory, args.manifestFile), "utf8"));
  const { manifestMac: suppliedMac, ...unsignedManifest } = manifest;
  if (suppliedMac !== manifestMac(manifestSigningPayload(unsignedManifest), args.key)) {
    throw new Error("Local replication manifest integrity verification failed.");
  }

  const archivePath = join(args.exportsDirectory, basename(manifest.archiveFile));
  const ciphertext = await readFile(archivePath);
  if (sha256(ciphertext) !== manifest.ciphertextSha256) {
    throw new Error("Local replication archive checksum verification failed.");
  }

  const payload: ReplicaPayload = JSON.parse(decrypt(ciphertext, args.key).toString("utf8"));
  return { manifest, payload };
}
