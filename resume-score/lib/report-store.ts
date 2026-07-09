import type { StoredReport } from "@/lib/report-schema";

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
  return JSON.parse(value) as StoredReport;
}

export async function markReportPaid(id: string, paddleTransactionId: string) {
  const report = await getReport(id);
  if (!report) return null;

  const updated = {
    ...report,
    paid: true,
    paymentStatus: "paid" as const,
    paddleTransactionId,
    updatedAt: new Date().toISOString()
  };
  await saveReport(updated);
  return updated;
}
