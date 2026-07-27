import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;

export function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function manifestMac(value: string, key: Buffer): string {
  return createHmac("sha256", key).update(value).digest("hex");
}

export function encrypt(plainText: Buffer, key: Buffer): Buffer {
  if (key.length !== 32) throw new Error("Local replication key must be 32 bytes.");
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plainText), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);
}

export function decrypt(payload: Buffer, key: Buffer): Buffer {
  if (key.length !== 32 || payload.length <= IV_BYTES + AUTH_TAG_BYTES) {
    throw new Error("Local replication archive is invalid.");
  }
  const iv = payload.subarray(0, IV_BYTES);
  const authTag = payload.subarray(IV_BYTES, IV_BYTES + AUTH_TAG_BYTES);
  const ciphertext = payload.subarray(IV_BYTES + AUTH_TAG_BYTES);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
