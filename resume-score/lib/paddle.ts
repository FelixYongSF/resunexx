import { createHmac, timingSafeEqual } from "node:crypto";

export type PaddleEnvironment = "sandbox" | "production";

export type PaddleTransaction = {
  id: string;
  status: string;
  items?: Array<{
    price?: {
      id?: string;
    } | null;
    price_id?: string;
  }>;
  custom_data?: {
    reportId?: string;
    [key: string]: unknown;
  } | null;
};

type PaddleResponse<T> = {
  data: T;
};

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getPaddleEnvironment(): PaddleEnvironment {
  return process.env.PADDLE_API_KEY?.startsWith("pdl_sdbx_") ? "sandbox" : "production";
}

export function getPaddleApiBaseUrl() {
  return getPaddleEnvironment() === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";
}

export function assertPaddleCheckoutConfig() {
  const missing = getMissingPaddleConfig();

  if (missing.length > 0) {
    throw new Error(`Paddle is not configured. Missing: ${missing.join(", ")}.`);
  }
}

export function getMissingPaddleConfig() {
  return [
    !process.env.PADDLE_API_KEY ? "PADDLE_API_KEY" : "",
    !process.env.PADDLE_CLIENT_TOKEN ? "PADDLE_CLIENT_TOKEN" : "",
    !process.env.PADDLE_WEBHOOK_SECRET ? "PADDLE_WEBHOOK_SECRET" : "",
    !process.env.PADDLE_PRICE_ID ? "PADDLE_PRICE_ID" : "",
    !process.env.NEXT_PUBLIC_APP_URL ? "NEXT_PUBLIC_APP_URL" : ""
  ].filter(Boolean);
}

export async function getPaddleTransaction(transactionId: string) {
  if (!process.env.PADDLE_API_KEY) {
    throw new Error("Paddle is not configured. Missing PADDLE_API_KEY.");
  }

  const response = await fetch(`${getPaddleApiBaseUrl()}/transactions/${transactionId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Paddle transaction lookup failed: ${response.status} ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as PaddleResponse<PaddleTransaction>;
  return json.data;
}

export function isPaidPaddleTransaction(transaction: PaddleTransaction, expectedReportId?: string) {
  const configuredPriceId = process.env.PADDLE_PRICE_ID;
  const transactionReportId = transaction.custom_data?.reportId;
  const hasConfiguredPrice = Boolean(
    configuredPriceId &&
      transaction.items?.some((item) => item.price?.id === configuredPriceId || item.price_id === configuredPriceId)
  );

  return (
    (transaction.status === "completed" || transaction.status === "paid") &&
    Boolean(transactionReportId) &&
    (!expectedReportId || transactionReportId === expectedReportId) &&
    hasConfiguredPrice
  );
}

export function verifyPaddleWebhookSignature(rawBody: string, signatureHeader: string | null) {
  if (!process.env.PADDLE_WEBHOOK_SECRET) {
    throw new Error("Paddle webhook is not configured. Missing PADDLE_WEBHOOK_SECRET.");
  }

  if (!signatureHeader) return false;

  const entries = signatureHeader.split(";").reduce<Record<string, string[]>>((result, part) => {
    const [key, ...value] = part.split("=");
    if (key && value.length > 0) {
      result[key] = [...(result[key] || []), value.join("=")];
    }
    return result;
  }, {});
  const timestamp = entries.ts?.[0];
  const signatures = entries.h1 || [];

  if (!timestamp || signatures.length === 0) return false;
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 5) return false;

  const signedPayload = `${timestamp}:${rawBody}`;
  const expected = createHmac("sha256", process.env.PADDLE_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");

  return signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature, "hex");
    return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
  });
}
