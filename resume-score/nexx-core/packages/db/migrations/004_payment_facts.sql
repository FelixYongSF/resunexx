CREATE TABLE core_raw.provider_payment_facts (
  provider_fact_id uuid PRIMARY KEY,
  provider_event_id text NOT NULL,
  provider_name text NOT NULL CHECK (provider_name IN ('polar')),
  product_id uuid NOT NULL REFERENCES core_registry.products(product_id),
  environment text NOT NULL CHECK (environment IN ('development', 'test', 'staging', 'production')),
  fact_type text NOT NULL CHECK (fact_type IN ('order_created', 'order_paid', 'order_refunded', 'refund_created', 'refund_updated')),
  provider_order_ref text,
  provider_transaction_ref text,
  provider_refund_ref text,
  plan_key text NOT NULL CHECK (plan_key IN ('standard', 'full')),
  currency text,
  amount_minor bigint CHECK (amount_minor IS NULL OR amount_minor >= 0),
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL,
  signature_verified boolean NOT NULL,
  adapter_version text NOT NULL,
  core_release_id uuid REFERENCES core_registry.core_releases(release_id),
  CHECK (signature_verified = true),
  CONSTRAINT provider_payment_facts_event_unique UNIQUE (provider_name, provider_event_id)
);

CREATE INDEX provider_payment_facts_order_idx
  ON core_raw.provider_payment_facts (provider_name, provider_order_ref, occurred_at DESC);
