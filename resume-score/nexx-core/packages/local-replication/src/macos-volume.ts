import { mkdir, open, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";

const KEYCHAIN_SERVICE = "com.resunexx.nexx-core.local-replication";
const DEFAULT_KEYCHAIN_ACCOUNT = "replica-volume-and-export-key-v1";

function keychainAccount(): string {
  const scope = process.env.NEXX_CORE_LOCAL_REPLICA_KEY_SCOPE;
  return scope ? `replica-volume-and-export-key-${scope}` : DEFAULT_KEYCHAIN_ACCOUNT;
}

export type MountedReplicaVolume = Readonly<{
  rootDirectory: string;
  exportsDirectory: string;
  dataDirectory: string;
  detach: () => Promise<void>;
}>;

export type ReplicationLock = Readonly<{ release: () => Promise<void> }>;

function run(command: string, args: string[], stdin?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += String(chunk); });
    child.stderr.on("data", (chunk) => { stderr += String(chunk); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`${command} failed (${code ?? "unknown"}): ${stderr.trim() || "no diagnostic"}`));
    });
    if (stdin) child.stdin.write(stdin);
    child.stdin.end();
  });
}

async function keychainSecret(): Promise<string> {
  try {
    return (await run("/usr/bin/security", ["find-generic-password", "-s", KEYCHAIN_SERVICE, "-a", keychainAccount(), "-w"])) .trim();
  } catch {
    const generated = randomBytes(32).toString("base64");
    await run("/usr/bin/security", ["add-generic-password", "-U", "-s", KEYCHAIN_SERVICE, "-a", keychainAccount(), "-w", generated]);
    return generated;
  }
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function acquireReplicationLock(): Promise<ReplicationLock> {
  const baseDirectory = process.env.NEXX_CORE_LOCAL_REPLICA_DIR || join(homedir(), ".resunexx", "nexx-core");
  const lockPath = join(baseDirectory, ".replication.lock");
  await mkdir(baseDirectory, { recursive: true, mode: 0o700 });
  try {
    const lock = await open(lockPath, "wx", 0o600);
    await lock.close();
    await writeFile(lockPath, JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }), { mode: 0o600 });
  } catch (error: unknown) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "EEXIST")) throw error;
    const existing = await stat(lockPath);
    if (Date.now() - existing.mtimeMs > 15 * 60 * 1000) {
      await rm(lockPath, { force: true });
      return acquireReplicationLock();
    }
    throw new Error("Another local replication or query is already running. Try again shortly.");
  }
  return { release: async () => { await rm(lockPath, { force: true }); } };
}

export async function localReplicationKey(): Promise<Buffer> {
  const secret = await keychainSecret();
  const key = Buffer.from(secret, "base64");
  if (key.length !== 32) throw new Error("Local replication keychain entry is invalid.");
  return key;
}

export async function mountEncryptedReplicaVolume(): Promise<MountedReplicaVolume> {
  const baseDirectory = process.env.NEXX_CORE_LOCAL_REPLICA_DIR || join(homedir(), ".resunexx", "nexx-core");
  const imagePath = join(baseDirectory, "founder-replica.sparsebundle");
  const mountPoint = join(baseDirectory, "mounted-replica");
  const secret = await keychainSecret();
  await mkdir(baseDirectory, { recursive: true, mode: 0o700 });
  await mkdir(mountPoint, { recursive: true, mode: 0o700 });

  if (!existsSync(imagePath)) {
    await run("/usr/bin/hdiutil", [
      "create", "-type", "SPARSEBUNDLE", "-size", "512m", "-fs", "APFS", "-volname", "Nexx Core Replica",
      "-encryption", "AES-256", "-stdinpass", imagePath,
    ], `${secret}\n`);
  }

  let mountedHere = false;
  try {
    await run("/usr/bin/hdiutil", ["attach", "-nobrowse", "-mountpoint", mountPoint, "-stdinpass", imagePath], `${secret}\n`);
    mountedHere = true;
  } catch (error) {
    if (!String(error).includes("Resource busy")) throw error;
  }

  const rootDirectory = mountPoint;
  const exportsDirectory = join(rootDirectory, "exports");
  const dataDirectory = join(rootDirectory, "pglite");
  await mkdir(exportsDirectory, { recursive: true, mode: 0o700 });
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  return {
    rootDirectory,
    exportsDirectory,
    dataDirectory,
    detach: async () => {
      if (!mountedHere) return;
      let lastError: unknown;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
          await run("/usr/bin/hdiutil", ["detach", mountPoint]);
          return;
        } catch (error) {
          lastError = error;
          await delay(1_500);
        }
      }
      throw lastError;
    },
  };
}
