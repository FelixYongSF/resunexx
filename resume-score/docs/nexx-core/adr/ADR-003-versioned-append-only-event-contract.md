# ADR-003: Versioned Append-Only Event Contract

- Status: Proposed
- Decision owner: Engineering
- Date: 2026-07-25

## Context

Current analytics use unversioned names and free-form log metadata. Historical
learning requires stable event meaning, idempotency, corrections, and lineage.

## Decision

Adopt a shared, versioned event envelope and registry. Accepted events are
append-only. Meaning changes require a new schema version. Corrections are new
events linked to the original. Unknown fields are rejected by default.

## Rationale

This preserves what the system knew at the time and prevents later schema
changes from silently rewriting evidence.

## Alternatives considered

- Mutable event rows: rejected because corrections erase history.
- Schemaless JSON: rejected because free-form payloads create privacy and
  semantic drift.
- Client analytics vendor as authority: rejected because server and payment
  truth must remain under Core governance.

## Consequences

- Schema registry ownership and compatibility checks are required.
- Producers must upgrade intentionally.
- Rejected payloads need a safe diagnostic ledger.

## Implementation constraints

Every event carries event ID, schema version, product, environment, occurrence
time, release ID, consent/policy version, typed entity references, and
idempotency key where available.

## Privacy or security impact

Property allowlists and default-deny validation prevent resume content, direct
identifiers, secrets, and raw provider payloads entering Core.

## Cross-product impact

Canonical journey and commercial events are shared; domain properties remain
product extension schemas.

## Reversibility

High for future versions; already accepted historical events remain immutable.

## Evidence required for verification

- Schema compatibility tests.
- Duplicate, late, correction, and out-of-order tests.
- Privacy fuzz tests.
- Historical replay under pinned schema versions.

## Unresolved founder decision

None.
