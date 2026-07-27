-- Phase 1 only. Apply to a non-production Neon database after explicit local
-- provisioning approval. This migration intentionally contains no product data.

CREATE SCHEMA IF NOT EXISTS core_registry;
CREATE SCHEMA IF NOT EXISTS core_raw;
CREATE SCHEMA IF NOT EXISTS core_governance;

CREATE TABLE core_registry.products (
  product_id uuid PRIMARY KEY,
  organization_key text NOT NULL,
  product_key text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  retired_at timestamptz,
  CONSTRAINT products_product_key_unique UNIQUE (organization_key, product_key)
);

CREATE TABLE core_registry.product_contract_versions (
  contract_version_id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES core_registry.products(product_id),
  contract_version text NOT NULL,
  effective_at timestamptz NOT NULL,
  retired_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_contract_versions_unique UNIQUE (product_id, contract_version)
);

CREATE TABLE core_registry.core_releases (
  release_id uuid PRIMARY KEY,
  release_version text NOT NULL UNIQUE,
  git_commit_sha text NOT NULL,
  contract_version text NOT NULL,
  migration_version text NOT NULL,
  environment text NOT NULL CHECK (environment IN ('development', 'test', 'staging', 'production')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(git_commit_sha) >= 7)
);

CREATE TABLE core_registry.event_schema_versions (
  event_schema_version_id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES core_registry.products(product_id),
  event_name text NOT NULL,
  event_version integer NOT NULL CHECK (event_version > 0),
  schema_definition jsonb NOT NULL,
  privacy_classification text NOT NULL DEFAULT 'pseudonymous',
  effective_at timestamptz NOT NULL,
  retired_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_schema_versions_unique UNIQUE (product_id, event_name, event_version)
);

REVOKE ALL ON SCHEMA core_registry, core_raw, core_governance FROM PUBLIC;
