# ADR-009: Decision, Outcome, and Knowledge Lifecycle

- Status: Proposed
- Decision owner: Engineering; founder is the approval actor
- Date: 2026-07-25

## Context

A recommendation system that never records acceptance, action, outcome, or
correction cannot learn. Report prose must not become knowledge automatically.

## Decision

Store distinct immutable records for observed pattern, hypothesis,
recommendation, founder decision, experiment or product change, measured
outcome, and knowledge version. Knowledge lifecycle states are:
`proposed`, `under_review`, `testing`, `supported`, `contradicted`, `narrowed`,
`superseded`, and `retired`.

A recommendation cannot become `supported` knowledge without a governed
measured outcome, supporting and counter-evidence, applicability boundaries,
and human review.

## Rationale

Separating each step preserves what was observed, believed, chosen, tried,
measured, and learned.

## Alternatives considered

- One insight/report record: rejected because it collapses evidence and opinion.
- Model confidence as promotion: rejected because confidence is not outcome
  evidence.
- Delete contradicted knowledge: rejected because the engine must retain and
  learn from corrections.

## Consequences

- More explicit workflow states.
- Founder decisions and non-decisions are auditable.
- Knowledge can narrow or retire without losing historical use.

## Implementation constraints

All transitions append review records. AI may draft but cannot approve product
changes or promote knowledge.

## Privacy or security impact

Decision and knowledge text must be sanitized and scoped; no person-specific
resume prose enters the knowledge store.

## Cross-product impact

Scope is explicitly `product_specific`, `reusable_pattern`, or
`cross_product_insight`; promotion to the last requires independent evidence.

## Reversibility

High through versioning and lifecycle transitions; prior versions remain.

## Evidence required for verification

- State-machine tests.
- Promotion rejection without outcome.
- Contradiction, narrowing, supersession, and retirement tests.
- Full lineage from event to retrieved knowledge.

## Unresolved founder decision

Founder must approve the policy boundary for which decisions require explicit
founder review; production and knowledge promotion always do.
