CREATE TABLE core_governance.actor_refs (
  actor_ref text PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES core_registry.products(product_id),
  environment text NOT NULL CHECK (environment IN ('development', 'test', 'staging', 'production')),
  first_seen_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL,
  anonymized_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(actor_ref) >= 8)
);

CREATE TABLE core_governance.consent_records (
  consent_record_id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES core_registry.products(product_id),
  environment text NOT NULL CHECK (environment IN ('development', 'test', 'staging', 'production')),
  subject_ref text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('essential_operations', 'learning_analytics')),
  state text NOT NULL CHECK (state IN ('granted', 'denied', 'withdrawn', 'replaced')),
  consent_copy_version text NOT NULL,
  privacy_policy_version text NOT NULL,
  regional_rule_set text NOT NULL,
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL,
  replaces_consent_record_id uuid REFERENCES core_governance.consent_records(consent_record_id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX consent_records_subject_idx
  ON core_governance.consent_records (product_id, environment, subject_ref, occurred_at DESC);
