# ADR-010: Governed AI Retrieval

- Status: Proposed, retrieval scope pending founder approval
- Decision owner: Engineering; founder approves accessible scope
- Date: 2026-07-25

## Context

Founder-facing ChatGPT or Codex access must answer quantitative and qualitative
questions without unrestricted database access, unsupported numbers, or
personal-data leakage.

## Decision

Use a retrieval gateway with allowlisted, parameterized structured tools for
quantitative facts and curated semantic retrieval for approved evidence
summaries, decisions, experiment conclusions, and knowledge versions. Every
answer includes scope, freshness, definition versions, citations, caveats, and
retrieval audit.

## Rationale

SQL is authoritative for numbers. Semantic retrieval is useful for governed
qualitative history but cannot establish numeric truth.

## Alternatives considered

- Direct model database access: rejected for security and unsupported-query
  risk.
- Vector search over all records: rejected because unverified prose and PII
  would become retrievable.
- Reports only: rejected because snapshots cannot answer governed follow-ups.

## Consequences

- Tools and semantic corpora require versioning and access policy.
- “Insufficient evidence” must be returned instead of inference.
- Retrieval activity is auditable.

## Implementation constraints

No raw event, identity, resume, prompt/response, or provider payload access.
Semantic indexing starts only after knowledge governance is operational.

## Privacy or security impact

Least-privilege views, product/environment authorization, citation filtering,
and audit logs are mandatory.

## Cross-product impact

Cross-product answers require authorized scope and comparable definitions.

## Reversibility

High. Tools and indexes can be disabled or superseded without changing facts.

## Evidence required for verification

- Authorization and prompt-injection tests.
- Unsupported-number rejection.
- Citation and as-of version tests.
- PII corpus scans and retrieval audits.

## Unresolved founder decision

Approve whether founder retrieval may access aggregate-only data or limited
pseudonymous drill-down, and which products may be queried together.
