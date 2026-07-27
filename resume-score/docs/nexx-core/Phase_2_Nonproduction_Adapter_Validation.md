# Phase 2 Non-Production Adapter Validation

## Status

**Complete for the founder-authorized local/non-production scope.** This document records the adapter slice
that is safe to run with a local Nexx Core development database. It is not an
authorization to collect production customer data or enable Nexx Core in
Vercel production.

## What the adapter emits

The ResuNexx adapter emits only catalog-approved, coarse metadata to its local
Shadow Mode endpoint:

| Product action | Core event | Authority | Properties retained |
| --- | --- | --- | --- |
| Home visit | `page.viewed` | client | fixed page key/type |
| Upload begins | `artifact_upload.started` | client | fixed artifact type |
| Upload completes | `artifact_upload.completed` | server | format, size band, extraction method |
| Free or verified paid analysis begins | `assessment.started` | server | tier, engine version |
| Analysis completes | `assessment.completed` | server | tier, duration band, engine version |
| Preview or paid report opens | `report.viewed` | server | report tier |
| Checkout requested/created/cancelled | `checkout.*` | server | plan and fixed provider only |
| Paid PDF download | `report.downloaded` | server | tier and format |

The adapter never sends resume text, filenames, report IDs, customer email,
job descriptions, payment references, prices, or provider payloads.

## Payment boundary

Payment facts remain a separate signed-provider path. Generic analytics events
cannot create `payment.completed` data. Phase 2 tests explicitly assert that
client-originated payment claims and report references are rejected or dropped.

## Journey guarantees under test

- **FREE**: upload, analysis, and preview map only to the free lifecycle.
- **PRO**: upload and checkout map before payment; paid analysis maps only
  after the trusted `polar_verified_payment` server source.
- **ELITE**: follows the same pre-payment boundary and maps only full-tier
  post-payment activity.
- A cancellation maps to `checkout.cancelled` and never maps to analysis.

## Current production boundary

`getShadowConfig` disables all Shadow Mode delivery when `VERCEL_ENV` or
`NEXX_CORE_ENVIRONMENT` is `production`, rejects remote destinations, and
requires an explicit localhost development opt-in. Existing ResuNexx customer
flow remains non-blocking if local Core delivery is unavailable.

## Verification record (2026-07-27)

- Phase 2 metadata, mapping, FREE/PRO/ELITE journey, cancellation, authority,
  and reference-redaction tests passed locally.
- The full local Nexx Core test suite passed: Phase 1 contracts, payment facts,
  encrypted founder replica, Shadow data quality, and Phase 2 adapter tests.
- TypeScript and the ResuNexx production build passed.
- The live development-database delivery check passed. The local-only ingest
  server accepted the Phase 2 lifecycle fixture, then the encrypted
  founder-owned replica synchronized 12 newly delivered events without a
  cursor restart.
- The Shadow data-quality check passed against 18 minimal development events:
  source and encrypted-local-replica counts matched for every inspected event
  type. No production connection was attempted and no production data changed.

## Gate B still required before production enablement

1. Reproducible production release provenance tied to a reviewed Git commit.
2. A separately approved production Core database and tested provider-level
   point-in-time recovery.
3. A registered staging Core environment and real staging Shadow validation.
4. Founder approval of the final production privacy/consent and retention
   operating controls.
