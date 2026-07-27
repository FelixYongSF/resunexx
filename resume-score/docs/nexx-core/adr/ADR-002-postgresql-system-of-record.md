# ADR-002: PostgreSQL as the Durable System of Record

- Status: Accepted; development foundation provisioned
- Decision owner: Engineering; founder approves data region and budget
- Date: 2026-07-25

## Context

ResuNexx Redis records are mutable and expire. The learning loop needs
immutable events, versioned definitions, evidence lineage, decisions, outcomes,
and knowledge history.

## Decision

Use managed PostgreSQL as the authoritative Core store. Use append-only tables
for events, provider facts, decisions, reviews, and lifecycle transitions.
Derived facts are reproducible and versioned. Semantic indexes, if later
needed, contain only approved non-sensitive records and are not authoritative.

For the initial validation stage, use **Neon Free Plan** through the Vercel
Marketplace in **AWS US East 1 (Virginia)**. The approved recurring database
budget is **US$0** until a later founder decision authorizes an upgrade. The
Free Plan's limited restore window is acceptable only while Nexx Core is not
handling production Core data. Before any production enablement, complete a
restore test and decide whether the recovery window requires a paid plan.

On 2026-07-26, an isolated Neon development database was provisioned and the
Phase 1 migrations were applied there. No Neon connection variables remain in
Vercel Production or Preview, and no production database was accessed.

## Rationale

PostgreSQL provides transactions, constraints, relational lineage, versioned
queries, JSON validation support, backups, and mature operational tooling
without introducing a warehouse or vector database prematurely.

## Alternatives considered

- Continue with Redis: rejected because TTL and mutation cannot preserve
  historical meaning.
- Event warehouse first: rejected for complexity and weak transactional
  governance at current scale.
- Vector database: rejected as a system of record because similarity search
  cannot govern quantitative facts or lifecycle history.

## Consequences

- Schema migrations and backup/restore become release gates.
- Analytical workload must use indexed views and later separate only when
  measured load requires it.

## Implementation constraints

Use separate production, staging, and development data. Migrations are
forward-reviewed, reversible where safe, and recorded with release IDs.

## Privacy or security impact

Encryption, least-privilege roles, audit logging, retention jobs, and tested
deletion/anonymization are mandatory.

## Cross-product impact

Every record includes organization, product, environment, and definition
version boundaries.

## Reversibility

Medium. Data export is possible, but changing the authoritative store is costly.

## Evidence required for verification

- Approved provider/region and budget: Neon Free Plan, Vercel Marketplace,
  AWS US East 1 (Virginia), US$0 recurring budget for validation.
- Before production enablement: restore test and an explicit recovery-window
  decision; the Free Plan's approximately six-hour history is not silently
  treated as a production recovery objective.
- Role matrix and encryption evidence.
- Migration and schema-version audit.

## Unresolved founder decision

No unresolved procurement decision remains for Phase 1 foundation work. A
future founder decision is required before production Core data is stored or a
paid database plan is enabled.
