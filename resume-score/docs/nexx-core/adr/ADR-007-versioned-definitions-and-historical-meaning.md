# ADR-007: Versioned Definitions and Historical Meaning

- Status: Proposed
- Decision owner: Engineering
- Date: 2026-07-25

## Context

Business meaning changes when schemas, metrics, funnels, attribution,
detectors, knowledge, retrieval tools, or reports change. Overwriting a
definition would make earlier evidence irreproducible.

## Decision

Use immutable, effective-dated versions for every meaning-bearing definition.
Every derived record stores the exact definition and Core release versions that
produced it. Recalculation creates a new run and result; it never replaces the
historical result.

## Rationale

The engine must answer both “what do we know now?” and “what did we know when
this decision was made?”

## Alternatives considered

- Mutable current definitions only: rejected because history changes silently.
- Copy prose into reports: rejected because prose is not executable lineage.

## Consequences

- More records and explicit supersession relationships.
- Queries must choose current or as-of semantics.
- Backfills require labeled source and run versions.

## Implementation constraints

Version event schemas, metrics, funnels, segments, attribution, pattern rules,
experiments, reports, knowledge, retrieval tools, and product contracts.

## Privacy or security impact

Historical versions do not exempt data from deletion or anonymization policy.
Definition history must not retain forbidden payload samples.

## Cross-product impact

Comparable cross-product evidence must cite compatible definition versions.

## Reversibility

High. New versions supersede old ones without destroying them.

## Evidence required for verification

- As-of query tests.
- Historical replay and recomputation tests.
- Supersession and rollback tests.
- Release-to-definition lineage.

## Unresolved founder decision

None.
