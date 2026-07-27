import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import postgres from "postgres";
import {
  CoreIngestionService,
  PostgresCoreEventStore,
  ensureNonProductionProductRegistration,
  resolveLocalCoreConfig
} from "../nexx-core/apps/ingest-api/src/index.ts";
import { createIngestionRoute, type IngestionRequest } from "../nexx-core/apps/ingest-api/src/routes/events.ts";
import { ProductRegistry } from "../nexx-core/packages/registry/src/index.ts";

const MAX_REQUEST_BYTES = 32 * 1024;
const LOCAL_HOST = "127.0.0.1";
const DEFAULT_PORT = 4317;

type NonProductionTarget = "development" | "staging";

function requireNonProductionTarget(): NonProductionTarget {
  const target = process.env.NEXX_CORE_INGEST_TARGET;
  if (target !== "development" && target !== "staging") {
    throw new Error("Set NEXX_CORE_INGEST_TARGET to development or staging to start the local ingestion API.");
  }
  if (process.env.VERCEL_ENV === "production" || process.env.NEXX_CORE_ENVIRONMENT === "production") {
    throw new Error("The Nexx Core ingestion API is blocked in production.");
  }
  if (process.env.NEXX_CORE_ENVIRONMENT && process.env.NEXX_CORE_ENVIRONMENT !== target) {
    throw new Error("NEXX_CORE_ENVIRONMENT must match the non-production ingestion target.");
  }
  resolveLocalCoreConfig(target);
  return target;
}

function databaseUrl(target: NonProductionTarget): string {
  const value = target === "staging"
    ? process.env.NEXX_CORE_STAGING_DATABASE_URL
    : process.env.NEXX_CORE_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!value) throw new Error(`A ${target} Nexx Core database URL is required for the local ingestion API.`);
  return value;
}

function serverToken(): string {
  const value = process.env.NEXX_CORE_SERVER_TOKEN;
  if (!value || value.length < 24) {
    throw new Error("Set a 24+ character NEXX_CORE_SERVER_TOKEN in .env.local before starting local ingestion.");
  }
  return value;
}

async function parseBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let length = 0;
  for await (const chunk of request) {
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    length += value.length;
    if (length > MAX_REQUEST_BYTES) throw new Error("request_too_large");
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function respond(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(body));
}

async function main() {
  const target = requireNonProductionTarget();
  const sql = postgres(databaseUrl(target), { ssl: "require", max: 3 });
  const port = Number(process.env.NEXX_CORE_INGEST_PORT || (target === "staging" ? DEFAULT_PORT + 1 : DEFAULT_PORT));
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("NEXX_CORE_INGEST_PORT must be a valid local port.");

  await ensureNonProductionProductRegistration(sql, target);
  const registry = new ProductRegistry();
  registry.register({ productKey: "resunexx", contractVersion: "nexx-core-event-v1", allowedEnvironments: [target] });
  const service = new CoreIngestionService(new PostgresCoreEventStore(sql), {
    allowedEnvironments: [target]
  });
  const ingest = createIngestionRoute(registry, service, serverToken());

  const server = createServer(async (request, response) => {
    try {
      if (request.method === "GET" && request.url === "/health") {
        respond(response, 200, { status: "ok", scope: "local-development-only" });
        return;
      }
      if (request.method !== "POST" || request.url !== "/v1/events") {
        respond(response, 404, { error: "not_found" });
        return;
      }
      const body = await parseBody(request) as { event?: IngestionRequest["event"] };
      if (!body?.event) {
        respond(response, 400, { error: "invalid_request" });
        return;
      }
      const result = await ingest({ authorization: request.headers.authorization, event: body.event });
      respond(response, result.status, result.body);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      respond(response, message === "request_too_large" || message.includes("JSON") ? 400 : 500, {
        error: message === "request_too_large" ? "request_too_large" : "ingestion_unavailable"
      });
    }
  });

  server.listen(port, LOCAL_HOST, () => {
    console.info(`[nexx-core] ${target} ingestion API listening on http://${LOCAL_HOST}:${port}`);
  });

  const shutdown = async () => {
    server.close();
    await sql.end({ timeout: 5 });
  };
  process.once("SIGINT", () => { void shutdown().finally(() => process.exit()); });
  process.once("SIGTERM", () => { void shutdown().finally(() => process.exit()); });
}

main().catch((error: unknown) => {
  console.error("[nexx-core] local ingestion API failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
