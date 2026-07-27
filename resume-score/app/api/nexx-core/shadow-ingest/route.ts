import { NextResponse } from "next/server";
import postgres from "postgres";
import {
  CoreIngestionService,
  PostgresCoreEventStore,
  createIngestionRoute,
  ensureNonProductionProductRegistration
} from "../../../../nexx-core/apps/ingest-api/src/index.ts";
import { ProductRegistry } from "../../../../nexx-core/packages/registry/src/index.ts";
import { getPreviewStagingConfig, isCoreEventInput } from "@/lib/nexx-core/preview-staging-config";

export const runtime = "nodejs";
const MAX_REQUEST_BYTES = 16 * 1024;

export async function POST(request: Request) {
  let sql: ReturnType<typeof postgres> | undefined;
  try {
    const config = getPreviewStagingConfig();
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (!Number.isFinite(contentLength) || contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "request_too_large" }, { status: 413 });
    }
    const body = await request.json() as { event?: unknown };
    if (!isCoreEventInput(body.event)) {
      return NextResponse.json({ error: "invalid_event" }, { status: 400 });
    }

    sql = postgres(config.databaseUrl, { max: 1, prepare: false });
    await ensureNonProductionProductRegistration(sql, "staging");
    const registry = new ProductRegistry();
    registry.register({ productKey: "resunexx", contractVersion: "nexx-core-event-v1", allowedEnvironments: ["staging"] });
    const ingest = createIngestionRoute(
      registry,
      new CoreIngestionService(new PostgresCoreEventStore(sql), { allowedEnvironments: ["staging"] }),
      config.serverToken
    );
    const result = await ingest({ authorization: request.headers.get("authorization") || undefined, event: body.event });
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (message.includes("disabled")) return new NextResponse(null, { status: 404 });
    console.error("[nexx-core:preview-shadow] unavailable", { reason: "configuration_or_storage" });
    return NextResponse.json({ error: "ingestion_unavailable" }, { status: 503 });
  } finally {
    if (sql) await sql.end({ timeout: 1 });
  }
}
