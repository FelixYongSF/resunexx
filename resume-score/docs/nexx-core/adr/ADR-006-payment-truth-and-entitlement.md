# ADR-006: Payment Truth, Commercial History, and Entitlement

- Status: Proposed
- Decision owner: Engineering; founder approves accounting policy where needed
- Date: 2026-07-25

## Context

ResuNexx correctly fulfills paid access from signed Polar `order.paid`, but
stores only a mutable summary on an expiring report. Authorization is not a
complete commercial history.

## Decision

Store immutable provider payment facts separately from entitlement state.
Distinguish checkout creation, authorization, successful payment, failure,
cancellation, expiry, refund, duplicate delivery, entitlement activation, and
revocation. Only a verified provider success event can activate paid access.

## Rationale

Payment analysis requires provider event history, while access control requires
a current derived state. Combining them loses repeated payments, refunds, and
historical pricing meaning.

## Alternatives considered

- Report record as payment ledger: rejected because it mutates and expires.
- Browser redirect as payment success: rejected because it is forgeable.
- Provider dashboard as the only history: rejected because Core cannot build
  governed metrics or reconcile entitlement.

## Consequences

- Provider event IDs are idempotency keys.
- Entitlements are derived and auditable.
- Reconciliation jobs compare Core facts with provider records.

## Implementation constraints

Store provider, order/transaction/refund references, product and price version,
plan, amount, currency, discount, subtotal, tax, fee/net when available,
status, provider occurrence time, receipt time, and source event ID. Never store
credentials or full provider payloads in analytical records.

## Privacy or security impact

Payment email remains in the provider or protected identity/finance boundary,
not general events or founder semantic retrieval.

## Cross-product impact

The commercial fact model is provider-neutral and product-scoped.

## Reversibility

High at adapter level; immutable historical facts remain.

## Evidence required for verification

- Signed webhook fixtures.
- Product/plan/report cross-swap rejection tests.
- Duplicate, delayed, refund, repeated-payment, and partial-refund tests.
- Provider reconciliation report.

## Unresolved founder decision

Approve business definitions for gross and net revenue, discounts, taxes,
fees, disputes, currency conversion, and partial refunds before pricing metrics
are treated as governed.
