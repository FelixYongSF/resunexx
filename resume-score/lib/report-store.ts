import { StoredReport } from "@/lib/report-schema";

const globalForReports = globalThis as typeof globalThis & {
  resumeScoreReports?: Map<string, StoredReport>;
};

const memoryStore = globalForReports.resumeScoreReports ?? new Map<string, StoredReport>();
globalForReports.resumeScoreReports = memoryStore;

type KvResponse<T> = { result: T };

export function hasPersistentReportStore() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvCommand<T>(command: unknown[]): Promise<T> {
  const res = await fetch(`${process.env.KV_REST_API_URL}`, {
    method: "POST",
    body: JSON.stringify(command),
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!res.ok) throw new Error(`KV request failed: ${res.status}`);
  const json = (await res.json()) as KvResponse<T>;
  return json.result;
}

export async function saveReport(report: StoredReport) {
  if (hasPersistentReportStore()) {
    await kvCommand<"OK">(["SET", `report:${report.id}`, JSON.stringify(report)]);
    return;
  }

  memoryStore.set(report.id, report);
}

export async function getReport(id: string) {
  if (hasPersistentReportStore()) {
    const value = await kvCommand<string | null>(["GET", `report:${id}`]);
    if (!value) return null;
    return JSON.parse(value) as StoredReport;
  }

  return memoryStore.get(id) || null;
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
