# ADR-008: Governed Transformations, Metrics, Evidence, and Patterns

- Status: Proposed
- Decision owner: Engineering
- Date: 2026-07-25

## Context

Raw events do not create learning. Nexx Core must deterministically transform
events into journeys, funnels, governed metrics, evidence, and observed
patterns without presenting correlation as causation.

## Decision

Use versioned, idempotent background jobs with job-run lineage. Metrics are
registered executable definitions. Evidence bundles freeze numerator,
denominator, sample, window, filters, quality warnings, source records,
supporting evidence, and counter-evidence. Pattern detectors create candidates,
not knowledge.

## Rationale

This separates computation from explanation and makes every claim reproducible.

## Alternatives considered

- Query raw events ad hoc: rejected because results are not governed.
- Let an AI summarize logs: rejected because it can invent or misclassify
  evidence.
- Warehouse-only BI: rejected as premature and insufficient for decision
  lifecycle governance.

## Consequences

- Transformations require fixtures, scheduling, retry, and reconciliation.
- “Insufficient evidence” is a valid result.
- Observed patterns remain descriptive until tested.

## Implementation constraints

Every derived fact stores definition version, source window, source event IDs
or immutable query reference, job run, product, environment, and release.

## Privacy or security impact

Evidence bundles use aggregate or pseudonymous authorized records and exclude
direct identity and resume content.

## Cross-product impact

Shared metric templates can be reused only when the product adapter proves
semantic comparability.

## Reversibility

High. New job/definition versions coexist with old results.

## Evidence required for verification

- Golden fixture tests.
- Idempotent rerun tests.
- Late-arrival and data-quality tests.
- Counter-evidence and threshold tests.

## Unresolved founder decision

None.
