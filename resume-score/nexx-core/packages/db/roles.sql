-- Provisioning runbook, not an application migration. Names are intentionally
-- role-based so credentials can be created by the Neon/Vercel owner later.

-- nexx_core_migrator: owns Core schemas and applies reviewed migrations.
-- nexx_core_ingest: INSERT-only access to core_raw events/rejections and
-- read-only registry lookup.
-- nexx_core_worker: reads raw events and writes governed derived records in
-- later phases; it has no identity-vault privileges.
-- nexx_core_founder_read: no raw-event or identity access; created only with
-- governed aggregate views in a later retrieval phase.

REVOKE ALL ON ALL TABLES IN SCHEMA core_registry, core_raw, core_governance FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA core_registry, core_raw, core_governance FROM PUBLIC;
