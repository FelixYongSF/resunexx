import type { StoredReport } from "@/lib/report-schema";
import { isPaidReportPlan, shouldApplyPurchasedPlan, type PaidReportPlan } from "@/lib/report-plan";

type KvResponse<T> = { result: T };

export function hasPersistentReportStore() {
  const { url, token } = getKvConfig();
  return Boolean(url && token);
}

async function kvCommand<T>(command: unknown[]): Promise<T> {
  const { url, token } = getKvConfig();
  if (!url || !token) throw new Error("Persistent report storage is not configured.");

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(command),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!res.ok) throw new Error(`KV request failed: ${res.status}`);
  const json = (await res.json()) as KvResponse<T>;
  return json.result;
}

function getKvConfig() {
  const config = {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ""
  };

  console.info("[report-store] Redis configuration", {
    kvUrlConfigured: Boolean(config.url),
    kvTokenConfigured: Boolean(config.token)
  });

  return config;
}

export async function saveReport(report: StoredReport) {
  await kvCommand<"OK">(["SET", `report:${report.id}`, JSON.stringify(report)]);
}

export async function getReport(id: string) {
  const value = await kvCommand<string | null>(["GET", `report:${id}`]);
  if (!value) return null;
  const report = JSON.parse(value) as Partial<StoredReport>;
  const accessPlan = report.accessPlan || (report.paid ? "standard" : "free");
  return {
    ...report,
    requestedPlan: report.requestedPlan || "free",
    accessPlan,
    paymentStatus: report.paymentStatus || (report.paid ? "paid" : "unpaid")
  } as StoredReport;
}

export async function markReportPaid(
  id: string,
  paddleTransactionId: string,
  purchasedPlan: PaidReportPlan,
  paddlePriceId: string
) {
  const report = await getReport(id);
  if (!report) return null;
  if (report.requestedPlan !== purchasedPlan || !isPaidReportPlan(report.requestedPlan)) {
    throw new Error("Paid transaction does not match the report's requested plan.");
  }
  const existingPlan = report.accessPlan || (report.paid ? "standard" : "free");
  if (!shouldApplyPurchasedPlan(existingPlan, purchasedPlan)) {
    return report.paddleTransactionId === paddleTransactionId ? report : null;
  }

  const updated = {
    ...report,
    paid: true,
    paymentStatus: "paid" as const,
    accessPlan: purchasedPlan,
    purchasedPlan,
    paddleTransactionId,
    paddlePriceId,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  return updated;
}
