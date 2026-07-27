import { randomUUID } from "node:crypto";
import postgres from "postgres";

function requireDevelopmentTarget() {
  if (process.env.NEXX_CORE_MIGRATION_TARGET !== "development" || process.env.VERCEL_ENV === "production") {
    throw new Error("Synthetic replication fixtures are restricted to local development.");
  }
}

async function main() {
  requireDevelopmentTarget();
  const databaseUrl = process.env.NEXX_CORE_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("A local development database connection is required.");
  const sql = postgres(databaseUrl, { ssl: "require", max: 1 });
  try {
    const productKey = "resunexx-synthetic-local-replication";
    const existing = await sql<{ product_id: string }[]>`
      SELECT product_id::text FROM core_registry.products WHERE organization_key = 'nexx' AND product_key = ${productKey}
    `;
    const productId = existing[0]?.product_id ?? randomUUID();
    if (!existing[0]) {
      await sql`
        INSERT INTO core_registry.products (product_id, organization_key, product_key, display_name)
        VALUES (${productId}, 'nexx', ${productKey}, 'Synthetic local replication fixture')
      `;
    }

    const events = ["upload_validated", "analysis_completed", "preview_viewed"] as const;
    const fixtureRun = process.env.NEXX_CORE_SYNTHETIC_FIXTURE_RUN ?? "v1";
    for (const eventName of events) {
      const idempotencyKey = `synthetic-local-replication:${eventName}:${fixtureRun}`;
      await sql`
        INSERT INTO core_raw.core_events (
          event_id, idempotency_key, product_id, environment, event_name, event_version,
          product_contract_version, source, occurred_at, received_at, actor_ref,
          entity_refs, properties, privacy_policy_version, data_classification, retention_class
        ) VALUES (
          ${randomUUID()}, ${idempotencyKey}, ${productId}, 'development', ${eventName}, 1,
          'nexx-core-event-v1', 'server', now(), now(), 'synthetic_actor',
          '{}'::jsonb, '{"fixture":true}'::jsonb, 'privacy-v1', 'pseudonymous', 'raw_pseudonymous_event'
        ) ON CONFLICT (product_id, environment, idempotency_key) DO NOTHING
      `;
    }
    console.info("[nexx-core] synthetic local replication fixture is ready.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  console.error("[nexx-core] synthetic fixture failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
