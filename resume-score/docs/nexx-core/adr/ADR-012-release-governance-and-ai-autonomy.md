# ADR-012: Release Governance and AI Autonomy

- Status: Proposed
- Decision owner: Engineering; founder retains production approval
- Date: 2026-07-25

## Context

The current production artifact is not represented by one Git commit. Nexx
Core must evolve without losing history, and AI must not autonomously alter
production or promote knowledge.

## Decision

Every production deployment maps to one repository commit, lockfile, build
configuration, migration state, environment contract version, and deployment
record. Core software, schemas, definitions, retrieval tools, and reports use
versioned governed releases. AI may analyze and draft; it may not deploy,
change prices, modify product logic, contact customers, or promote knowledge
without explicit authorization.

## Rationale

Reproducibility and human approval are necessary to interpret evidence and
reverse harmful changes.

## Alternatives considered

- Deploy dirty or staged filesystem snapshots: rejected because provenance is
  incomplete.
- Autonomous AI production changes: rejected because evidence and rollback
  accountability are insufficient.
- Manual undocumented releases: rejected because history cannot be audited.

## Consequences

- Dirty-tree production deployments are prohibited.
- Migration and contract compatibility checks become release gates.
- Emergency changes must still be committed and linked to a deployment.

## Implementation constraints

Release metadata includes commit SHA, build runtime, package manager version,
lockfile hash, migration version, environment-contract version, artifact hash,
actor, and rollback target.

## Privacy or security impact

Secrets remain outside Git; only environment names and contract versions are
recorded. Release access follows least privilege.

## Cross-product impact

Shared contract and Core releases declare compatibility for each registered
product adapter.

## Reversibility

High when migrations are compatible and old definitions remain queryable.

## Evidence required for verification

- Clean-tree CI deployment.
- Artifact and commit match.
- Migration drift check.
- Rollback drill.
- Audit proving AI cannot bypass approval.

## Unresolved founder decision

None for architecture. The founder remains the final approver for production
promotion and supported-knowledge promotion.
