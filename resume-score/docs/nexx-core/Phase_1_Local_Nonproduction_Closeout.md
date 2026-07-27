# Nexx Core Phase 1 Local/Non-Production Closeout

## Decision

**Phase 1 is closed for the founder-authorized local/non-production scope on
2026-07-27.** This does not authorize Phase 2, production deployment,
production Core instrumentation, production database access, or collection of
real customer data.

## Scope that was closed

- versioned, default-deny Core event contract and product registry;
- development-only, authenticated local ingestion receiver;
- shared privacy sanitizer and rejection path;
- append-only, replay-protected payment fact capture and reconciliation;
- encrypted founder-owned local replication with watermark recovery;
- localhost-only, non-blocking ResuNexx Shadow Mode adapter;
- Shadow Mode data-quality and privacy validation.

## Formal evidence

| Area | Evidence | Result |
|---|---|---|
| Contract and privacy | 7 tests: registered event acceptance, production rejection, unknown/sensitive-property rejection, payment-source rejection, opaque-reference validation, fail-closed configuration, authenticated ingestion | Passed |
| Payment facts | 3 tests: verified fact recorded once, immutable refund, unverified/production facts rejected | Passed |
| Founder replica | 2 tests: encrypted export integrity, interrupted-apply recovery, altered manifest rejection | Passed |
| Shadow adapter | 4 tests: minimal mapping, production/remote rejection, explicit opt-in, non-blocking failed delivery | Passed |
| Shadow data quality | 2 tests: catalog-safe data accepted; sensitive values, duplicate idempotency keys, and replica drift rejected | Passed |
| Runtime ingestion | Local receiver accepted a synthetic event, protected replay, and rejected a privacy-invalid event | Passed |
| Runtime payment facts | Synthetic created/paid/refunded facts were immutable, replay-protected, and reconciled | Passed |
| Runtime Shadow Mode | Four minimized localhost events were accepted without entering a customer flow | Passed |
| Development schema | Five migrations verified idempotently against the dedicated Neon development database | Passed |
| Restore safety | Transaction rollback probe passed; Neon point-in-time restore remains a Gate B requirement | Passed for Phase 1 |
| Local data control | Aggregate source and encrypted local replica counts matched after sync | Passed |

## Final Shadow Mode consistency record

The validation inspected only the defined, low-cardinality Shadow event surface.
No resume text, filename, email, report content, job description, provider
payload, credential, or direct identifier was read or printed.

| Event | Development source | Encrypted local replica |
|---|---:|---:|
| `page.viewed` | 3 | 3 |
| `artifact_upload.started` | 3 | 3 |
| `cta.clicked` | 5 | 5 |
| `assessment.completed` | 3 | 3 |

The local replica separately contains synthetic payment-fact aggregates:
`order_created` 2, `order_paid` 2, and `order_refunded` 2. These are not
customer transactions.

## Operational boundaries retained

- Core is disabled for production by code and local configuration.
- The receiver binds only to `127.0.0.1`; remote Shadow destinations are
  rejected.
- A failed Shadow delivery returns without blocking a ResuNexx user action.
- The replica is encrypted at rest on the founder-controlled Mac and detached
  after local commands.
- Git must contain code and schemas only, never exports, mounted replica files,
  credentials, or customer data.

## Gate B remains blocked

Before any production Core enablement, complete the existing Gate B conditions:

1. make production reproducible from a clean Git-traceable release;
2. complete staging shadow emission without customer-flow dependency;
3. validate the future production environment contract and roles;
4. perform the separate Neon point-in-time restore and production recovery
   decision;
5. obtain explicit founder authorization for production enablement.

## Next permitted work

The next proposed work is a **Phase 1 acceptance review only**: verify the
closeout against this document and decide whether to authorize a separately
scoped Phase 2 design or implementation plan. Do not begin Phase 2 merely
because this local closeout passed.
