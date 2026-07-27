# ADR-011: Cross-Product Registration and Knowledge Transfer

- Status: Proposed, sharing boundary pending founder approval
- Decision owner: Engineering; founder approves policy boundary
- Date: 2026-07-25

## Context

Nexx Core must support future products without treating a ResuNexx observation
as universal truth.

## Decision

Require product registration, versioned adapter contracts, shared event
envelope, canonical journey taxonomy, reusable metric templates, and governed
knowledge scope. A single-product result may become a reusable hypothesis but
not a confirmed cross-product insight until independently tested by another
product with comparable definitions.

## Rationale

Transfer should preserve mechanism and boundary conditions, not copy a UI
treatment or conclusion blindly.

## Alternatives considered

- One global event namespace without product contracts: rejected because
  meanings drift.
- Automatic cross-product promotion: rejected because it overgeneralizes.
- Complete product isolation: rejected because it prevents reusable learning.

## Consequences

- Product adapters must pass conformance tests.
- Comparability and transfer validation become explicit records.
- Some knowledge remains product-specific permanently.

## Implementation constraints

Every knowledge version records source products, product archetypes,
conditions, non-applicability, comparable definitions, and transfer evidence.

## Privacy or security impact

Transfer uses aggregates and approved knowledge, not cross-product personal
profiles or direct identifiers.

## Cross-product impact

This ADR defines the cross-product contract itself.

## Reversibility

High. Knowledge scope can be narrowed or retired while preserving history.

## Evidence required for verification

- Second-product registration fixture.
- Adapter conformance test.
- Blocked promotion with one product.
- Independent transfer test with comparable metric versions.

## Unresolved founder decision

Approve which product families may share aggregate learning and whether any
cross-product identity linkage is prohibited or offered only with explicit
opt-in.
