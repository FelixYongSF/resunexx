CREATE TABLE core_raw.core_events (
  event_id uuid PRIMARY KEY,
  idempotency_key text NOT NULL,
  product_id uuid NOT NULL REFERENCES core_registry.products(product_id),
  environment text NOT NULL CHECK (environment IN ('development', 'test', 'staging', 'production')),
  event_name text NOT NULL,
  event_version integer NOT NULL CHECK (event_version > 0),
  product_contract_version text NOT NULL,
  source text NOT NULL CHECK (source IN ('client', 'server', 'webhook', 'backfill')),
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL,
  actor_ref text,
  session_id text,
  journey_id text,
  correlation_id text,
  causation_id text,
  entity_refs jsonb NOT NULL DEFAULT '{}'::jsonb,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  privacy_policy_version text NOT NULL,
  consent_policy_version text,
  data_classification text NOT NULL DEFAULT 'pseudonymous',
  retention_class text NOT NULL DEFAULT 'raw_pseudonymous_event',
  core_release_id uuid REFERENCES core_registry.core_releases(release_id),
  CHECK (jsonb_typeof(entity_refs) = 'object'),
  CHECK (jsonb_typeof(properties) = 'object'),
  CONSTRAINT core_events_idempotency_unique UNIQUE (product_id, environment, idempotency_key)
);

CREATE INDEX core_events_product_occurred_idx
  ON core_raw.core_events (product_id, environment, occurred_at DESC);
CREATE INDEX core_events_name_occurred_idx
  ON core_raw.core_events (product_id, event_name, occurred_at DESC);

CREATE TABLE core_raw.event_rejections (
  rejection_id uuid PRIMARY KEY,
  product_key text,
  environment text,
  event_name text,
  reason_code text NOT NULL,
  safe_detail text,
  received_at timestamptz NOT NULL,
  retention_expires_at timestamptz NOT NULL,
  CHECK (safe_detail IS NULL OR length(safe_detail) <= 128)
);

CREATE INDEX event_rejections_retention_idx
  ON core_raw.event_rejections (retention_expires_at);

CREATE TABLE core_raw.ingestion_idempotency_keys (
  idempotency_id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES core_registry.products(product_id),
  environment text NOT NULL CHECK (environment IN ('development', 'test', 'staging', 'production')),
  idempotency_key text NOT NULL,
  event_id uuid NOT NULL REFERENCES core_raw.core_events(event_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ingestion_idempotency_unique UNIQUE (product_id, environment, idempotency_key)
);
