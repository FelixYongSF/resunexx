# ADR-001: Nexx Core Boundary and Deployment Shape

- Status: Proposed
- Decision owner: Engineering
- Date: 2026-07-25

## Context

ResuNexx is a single Next.js application with Redis operational storage.
Nexx Core must serve future products without embedding resume-specific logic or
creating premature microservice overhead.

## Decision

Build Nexx Core as a product-neutral modular monolith in the same authoritative
Git repository initially, with:

- a separate deployable application;
- shared versioned contract packages;
- a separate PostgreSQL database or independently owned schemas and roles;
- no runtime dependency from customer operations to Core acknowledgement;
- product adapters as the only product-specific integration boundary.

## Rationale

One repository improves release traceability and reduces solo-founder
operational cost. A separate deployment and data ownership boundary prevents
ResuNexx domain coupling and permits later repository or service extraction.

## Alternatives considered

- Embed Core inside ResuNexx: fastest initially, rejected because it makes
  product-specific records and release cycles architectural dependencies.
- Separate microservices and repositories now: strong isolation, rejected as
  unnecessary operational complexity.

## Consequences

- The repository becomes a governed workspace.
- Core has independent migrations, credentials, runtime, and ownership.
- Shared contracts require compatibility testing.
- Future physical separation remains possible.

## Implementation constraints

No customer upload, checkout, report, or download request may fail because Core
is unavailable. Use asynchronous delivery with retry and reconciliation.

## Privacy or security impact

Separate service roles and schemas reduce accidental product-data access.
Product adapters must sanitize payloads before ingestion.

## Cross-product impact

All products register through the same product contract and event envelope.
Core contains no resume-specific field names or plan semantics.

## Reversibility

High. The modular monolith can later move to a separate repository or split
modules into services while preserving contracts.

## Evidence required for verification

- Workspace boundaries and dependency rules.
- Separate deployment and database roles.
- Contract compatibility tests.
- Failure-isolation test proving Core outage does not block ResuNexx.

## Unresolved founder decision

None. Repository organization is an engineering decision.
