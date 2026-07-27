# ADR-005: Privacy, Consent, Retention, and Deletion

- Status: Proposed, founder policy approval required
- Decision owner: Founder for policy; Engineering for enforcement
- Date: 2026-07-25

## Context

Resume content and payment email are sensitive. Current operational records
have TTLs but no consent ledger, deletion API, or governed learning policy.

## Decision

Separate essential operational processing from optional learning analytics.
Record consent purpose, state, policy version, and time. Apply default-deny data
minimization. Exclude resume text, report prose tied to a person, filenames,
direct identifiers, raw job descriptions, prompts/responses, IP/user-agent
values, and provider payloads from general learning and semantic retrieval.

## Rationale

The engine can learn from lifecycle metadata and governed aggregates without
collecting the document content it evaluates.

## Alternatives considered

- Treat all product use as analytics consent: rejected as insufficiently
  transparent across regions.
- Store everything and delete later: rejected because it maximizes irreversible
  privacy risk.
- Remove all behavioral learning: rejected because privacy-preserving,
  purpose-limited learning is feasible.

## Consequences

- Some journey data may be unavailable when optional consent is absent.
- Retention, access, deletion, and audit workflows become required operations.

## Implementation constraints

No unknown event properties. Deletion creates an auditable request and removes
or irreversibly anonymizes identity linkage while preserving lawful,
non-identifying aggregates.

## Privacy or security impact

This ADR is the primary privacy boundary. Legal review may be required before
production collection in target regions.

## Cross-product impact

Cross-product linkage is off by default. Knowledge transfer uses aggregate
evidence and explicit scope, not shared personal profiles.

## Reversibility

Policy can be tightened. Data already collected cannot always be made
uncollected, so conservative defaults are required.

## Evidence required for verification

- Approved consent copy and policy versions.
- Retention schedule and purge tests.
- Access/deletion workflow and audit.
- Automated PII scans of Core tables and indexes.

## Unresolved founder decision

Approve consent experience, retention periods, deletion policy, permitted use
of direct identifiers, and cross-product sharing boundaries.
