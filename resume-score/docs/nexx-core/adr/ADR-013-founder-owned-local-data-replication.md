# ADR-013: Founder-Owned Local Data Replication

## Status

**Accepted for local/non-production implementation on 2026-07-26. Production
use remains prohibited.**

## Context

Nexx Core uses managed PostgreSQL for its online durable record. The founder
requires a usable, encrypted copy on a founder-controlled Mac so the company
does not depend solely on a hosted provider for retention, inspection, or
recovery.

## Decision

Adopt a scheduled, encrypted replication pipeline from the online Core ledger
to a founder-owned local replica. The local implementation uses an AES-256
encrypted macOS sparse bundle, a PGlite PostgreSQL-compatible local database,
AES-256-GCM encrypted exports, and a per-export HMAC-protected manifest. The
encryption key is held only in the founder's macOS Keychain. A launchd job runs
every six hours, with a durable watermark/cursor for resumable, gap-free
incremental synchronization. GitHub contains code and schema only, never
customer data.

## Required design decisions before implementation

- export form: encrypted, canonical JSON export for the initial Core event
  ledger; adding PostgreSQL dump or Parquet remains a future compatibility
  enhancement when local PostgreSQL tooling is available;
- encryption/key custody: AES-256 sparse bundle plus AES-256-GCM archive; a
  32-byte key is stored only in macOS Keychain;
- cadence: every six hours, with catch-up after the Mac returns online;
- local engine: PGlite, a PostgreSQL-compatible local database;
- integrity: SHA-256 archive checksum plus HMAC-protected manifest; cursor is
  `(received_at, event_id)`;
- retention: source retention remains authoritative; encrypted export artifacts
  remain local until a separately approved local retention policy is applied;
- recovery: synthetic export, interrupted apply, manifest tamper detection,
  local rebuild, and read-only query tests are required evidence.

## Consequences

- Phase 1 is frozen until this capability passes its gate.
- The founder gains independent, local inspectability and recovery capability.
- The system gains operational complexity and requires careful local security.
- This does not authorize local storage of direct identifiers without a
  separately approved encrypted vault.

## Evidence required

The acceptance criteria in
`../Founder_Owned_Local_Data_Replication_Gate.md` must pass using synthetic,
non-production data before ADR-013 can be marked Accepted.
