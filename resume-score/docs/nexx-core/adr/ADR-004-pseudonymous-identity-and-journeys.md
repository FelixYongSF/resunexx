# ADR-004: Pseudonymous Identity, Sessions, and Journeys

- Status: Proposed, policy boundaries pending
- Decision owner: Engineering; founder approves direct-identifier use
- Date: 2026-07-25

## Context

ResuNexx has no account or stable visitor/session identity. A report UUID
currently acts as upload, analysis, entitlement, and return-access reference.
Learning needs journeys without creating personal dossiers.

## Decision

Use product-scoped pseudonymous actor, anonymous visitor, session, journey,
upload, analysis-run, report, checkout, order, and transaction identifiers.
Link identities only through deterministic server-confirmed facts. Do not use
fingerprinting or probabilistic cross-device matching.

## Rationale

Separate identifiers preserve domain meaning and permit deletion, lineage, and
cross-product governance without exposing direct identity.

## Alternatives considered

- Report ID as universal identity: rejected because it collapses unrelated
  lifecycles and expires.
- Email as actor key: rejected because it spreads direct identity.
- Fingerprinting: rejected on privacy and reliability grounds.

## Consequences

- Sessionization and identity-link rules are versioned.
- Return visits may remain anonymous or sessionless.
- Actor linkage may be deleted while non-identifying aggregates remain.

## Implementation constraints

New session after versioned inactivity rules. Cross-product linking is disabled
unless separately approved and disclosed.

## Privacy or security impact

Identity vault is separate from events. Report URLs remain operational bearer
links until product authentication is introduced and must not become Core
retrieval credentials.

## Cross-product impact

Product-scoped IDs prevent silent cross-product merging. Transfer learning uses
aggregate comparable evidence, not personal identity.

## Reversibility

Medium. Identity policies can be narrowed; irreversible overcollection cannot
be undone.

## Evidence required for verification

- Identifier and merge test matrix.
- Session/journey deterministic fixtures.
- Deletion/anonymization propagation tests.
- Proof that email and resume content are absent from events.

## Unresolved founder decision

Decide whether direct identifiers may be retained in a protected vault and
whether any opt-in cross-product account linkage will ever be offered.
