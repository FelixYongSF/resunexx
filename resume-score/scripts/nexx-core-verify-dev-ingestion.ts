import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { CoreIngestionService, PostgresCoreEventStore, ensureDevelopmentProductRegistration } from "../nexx-core/apps/ingest-api/src/index.ts";
import { buildNexxCoreEvent } from "../lib/nexx-core/events.ts";

function requireDevelopmentOnly() {
  if (process.env.NEXX_CORE_INGEST_TARGET !== "development" || process.env.VERCEL_ENV === "production" || process.env.NEXX_CORE_ENVIRONMENT === "production") {
    throw new Error("Development-only ingestion verification is blocked outside the approved local scope.");
  }
}

async function main() {
  requireDevelopmentOnly();
  const databaseUrl = process.env.NEXX_CORE_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("NEXX_CORE_DATABASE_URL is required for verification.");
  const sql = postgres(databaseUrl, { ssl: "require", max: 1 });
  const idempotencyKey = `idem_dev_verify_${randomUUID().replaceAll("-", "")}`;
  const event = buildNexxCoreEvent({
    eventName: "cta.clicked",
    environment: "development",
    source: "server",
    idempotencyKey,
    properties: { cta_key: "synthetic_phase1_check", placement: "verification", destination_intent: "free_upload" }
  });
  try {
    await ensureDevelopmentProductRegistration(sql);
    const service = new CoreIngestionService(new PostgresCoreEventStore(sql), { allowedEnvironments: ["development"] });
    const accepted = await service.ingest(event);
    const duplicate = await service.ingest(event);
    const rejected = await service.ingest(buildNexxCoreEvent({
      eventName: "page.viewed",
      environment: "development",
      source: "client",
      properties: { page_key: "synthetic", page_type: "marketing", email: "not-permitted@example.test" } as never
    }));
    if (accepted.status !== "accepted" || duplicate.status !== "duplicate" || rejected.status !== "rejected") {
      throw new Error("Development ingestion verification did not meet acceptance criteria.");
    }
    console.info("[nexx-core] development ingestion verification passed: accepted, duplicate-protected, privacy-rejected.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] development ingestion verification failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
