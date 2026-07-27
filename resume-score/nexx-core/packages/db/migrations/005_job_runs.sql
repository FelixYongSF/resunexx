CREATE TABLE core_governance.job_runs (
  job_run_id uuid PRIMARY KEY,
  job_name text NOT NULL,
  job_version text NOT NULL,
  product_id uuid REFERENCES core_registry.products(product_id),
  environment text NOT NULL CHECK (environment IN ('development', 'test', 'staging', 'production')),
  status text NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  idempotency_key text NOT NULL,
  source_window_start timestamptz,
  source_window_end timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  safe_error_category text,
  core_release_id uuid REFERENCES core_registry.core_releases(release_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_runs_idempotency_unique UNIQUE (job_name, job_version, environment, idempotency_key)
);

CREATE INDEX job_runs_status_idx
  ON core_governance.job_runs (environment, status, created_at DESC);

CREATE TABLE core_raw.outbox_messages (
  outbox_id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES core_registry.products(product_id),
  environment text NOT NULL CHECK (environment IN ('development', 'test', 'staging', 'production')),
  event_id uuid NOT NULL REFERENCES core_raw.core_events(event_id),
  destination text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'delivered', 'failed', 'dead_letter')),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  next_attempt_at timestamptz,
  safe_error_category text,
  created_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  CONSTRAINT outbox_event_destination_unique UNIQUE (event_id, destination)
);

CREATE INDEX outbox_delivery_idx
  ON core_raw.outbox_messages (status, next_attempt_at, created_at);

CREATE TABLE core_governance.restore_verification_runs (
  restore_verification_run_id uuid PRIMARY KEY,
  verification_kind text NOT NULL CHECK (verification_kind IN ('transaction_rollback')),
  verified_at timestamptz NOT NULL,
  safe_result text NOT NULL CHECK (safe_result IN ('passed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
