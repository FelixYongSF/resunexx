# Nexx Core Systems of Record Specification

## Governing principle

Operational access state, immutable evidence, derived facts, decisions, and
knowledge are separate records. A mutable product record or provider dashboard
cannot substitute for the complete historical system of record.

PostgreSQL is the proposed authoritative Core store. Polar remains authoritative
for provider-side payment occurrence; Core preserves signed provider facts and
derives product entitlement.

## Common record rules

Every Core record carries:

- stable identifier;
- organization, product, environment, and tenant boundary;
- occurrence/effective time and Core receipt/record time;
- schema/definition version;
- source and lineage;
- Core release or job-run version;
- privacy classification and retention class;
- created-by or authoritative producer;
- audit or lifecycle history where applicable.

Immutable records are corrected by a new linked record. Versioned definitions
and knowledge are superseded, never overwritten.

## Record specification

| Record type | Authoritative source | Identifier | Immutability/version rule | Timestamp semantics | Scope/boundary | Retention and deletion | Permitted retrieval | Audit requirement |
|---|---|---|---|---|---|---|---|---|
| Immutable events | Core ingestion after schema and privacy validation | `event_id` plus product environment | Append-only; corrections reference original | `occurred_at`, `received_at` | organization/product/environment | Founder-approved raw-event period; actor linkage anonymized on valid deletion | Approved aggregate/parameterized tools, not unrestricted AI | ingestion request, producer, schema, rejection/correction |
| Identities and links | Identity service from deterministic server facts | `actor_id`, `identity_id`, `identity_link_id` | Link/unlink transitions append-only | first/last valid time and record time | product-scoped by default | Direct link deleted/anonymized under policy; non-identifying aggregates may remain | Restricted identity service only | every link reason, source fact, access, deletion |
| Consent | Consent service/user action | `consent_record_id` | Append-only state changes with policy version | decision time and receipt time | actor/anonymous ID, purpose, product/region | Legal/policy duration; retain minimal proof | Privacy/admin tools; aggregate eligibility queries | copy/policy version, source, state, withdrawal |
| Sessions and journeys | Versioned transformation jobs | `session_id`, `journey_id`, `journey_step_id` | Derived immutable run versions | activity window plus `computed_at` | product/environment, pseudonymous actor | Follows source-event and actor policy | Governed metrics/journey tools | definition version, job run, source events |
| Governed metrics | Approved metric registry and metric engine | `metric_definition_id`, `metric_run_id`, `metric_fact_id` | Definitions immutable by version; runs append-only | source window, effective time, computed time | product/segment/funnel scope | Long-term aggregate if non-identifying | Structured quantitative tools | numerator, denominator, filters, source, warnings |
| Evidence bundles | Evidence builder from governed facts | `evidence_bundle_id`, `evidence_item_id` | Frozen per version; additions create new bundle/version | evidence window and assembly time | product/context/decision scope | Long-term with privacy-safe lineage | Decision tools and approved semantic summaries | supporting/counter-evidence, query hash, reviewer |
| Observed patterns | Versioned detector or reviewed analysis | `observed_pattern_id` | Append-only detector run; status versioned | observation window and detection time | bounded product/segment/context | Long-term when aggregate and governed | Decision tools; semantic retrieval when approved | rule/version, threshold, evidence, counter-signals |
| Hypotheses | Human or model-assisted hypothesis service | `hypothesis_id` | Immutable versions | proposed/reviewed times | explicit context and product scope | Long-term decision history | Founder decision tools | author/model, evidence, alternatives, status |
| Recommendations | Recommendation service | `recommendation_id` | Immutable versions and lifecycle events | proposed/reviewed times | target product/context | Long-term with decisions/outcomes | Founder decision tools | evidence, target metric, effort, risks, test |
| Founder decisions | Founder Decision Interface | `decision_id` | Append-only decision/revision records | decision/effective/review dates | explicit product/cross-product scope | Long-term | Authorized founder retrieval | actor, options, rationale, evidence, reversal |
| Experiments | Experiment registry | `experiment_id`, `variant_id`, `assignment_id` | Definition/version locked before exposure | planned/start/end/assignment times | product/environment/eligible population | Long-term aggregate and decision lineage | Experiment/decision tools | approval, assignment, metric bindings, changes |
| Product changes | Change registry/release process | `product_change_id` | Append-only approved version and deployment link | approved/deployed/reverted times | product/environment | Long-term | Decision and release tools | owner, decision, release, guardrails, rollback |
| Measured outcomes | Outcome engine | `outcome_id` | Append-only result versions | evaluation window, measured time | experiment/change and product context | Long-term aggregate | Decision and knowledge tools | definition, baseline, result, quality, source |
| Knowledge items | Knowledge governance service | `knowledge_item_id` | Stable item with immutable `knowledge_version_id` | valid/review/effective times | product-specific/reusable/cross-product | Long-term; retire rather than delete unless privacy requires | Approved semantic and structured retrieval | promotion evidence, review, scope, counter-evidence |
| Knowledge revisions/supersession | Knowledge governance service | `knowledge_review_id`, relationship ID | Append-only transitions and relationships | transition/review time | inherited plus changed scope | Long-term history | Retrieval includes current and historical when authorized | actor, reason, predecessor/successor |
| Provider payment facts | Signed provider webhook adapter/reconciliation | `provider_event_id`, provider order/transaction/refund ref | Append-only and idempotent | provider occurrence and Core receipt time | product/environment/provider | Finance/legal policy | Governed commercial queries; no semantic PII | signature result, adapter version, reconciliation |
| Entitlement state | Entitlement service derived from payment facts | `entitlement_id` | Current projection plus append-only activation/revocation ledger | activation/revocation/effective time | product, report/artifact, plan | Operational lifetime plus audit policy | Product authorization and aggregate metrics | source payment/refund fact, reason, actor |
| Retrieval audits | Retrieval gateway | `retrieval_audit_id` | Append-only | request/answer time | caller and authorized product scope | Security policy | Security/admin review only | tools, parameters, sources, citations, denial |

## Payment truth state model

| State or fact | Authority | Core behavior |
|---|---|---|
| Checkout created | Core checkout service and provider response | Record checkout/product/price/plan/report references; no entitlement |
| Payment authorized | Signed provider fact if provider exposes it | Record authorization only; no paid completion assumption |
| Payment succeeded | Verified signed `order.paid` or equivalent success fact | Record immutable commercial fact; activate matching entitlement exactly once |
| Payment failed | Signed provider fact or reconciled provider state | Record failure reason category; no entitlement |
| Checkout cancelled | Signed provider fact or explicit safe return state | Record cancellation; preserve operational retry context; no entitlement |
| Checkout expired/abandoned | Provider fact or governed timeout classification | Record outcome separately from failure; no entitlement |
| Refund requested/created | Signed provider fact | Record request/pending state; do not revoke until approved policy state |
| Refund succeeded/order refunded | Verified signed final refund fact | Record refund amount/status; revoke applicable entitlement according to policy |
| Duplicate delivery | Existing provider event ID/idempotency record | Preserve delivery audit but do not duplicate fact or side effect |
| Entitlement activated | Entitlement service after verified success and plan/product match | Append activation record and current projection |
| Entitlement revoked | Entitlement service after verified final refund/charge state | Append revocation record and deny paid report/PDF |

Polar authorization or a success redirect alone is never sufficient historical
commercial evidence.

## Timestamp semantics

- `occurred_at`: when the source says the business event occurred.
- `received_at`: when Core durably accepted it.
- `effective_at`: when a definition, decision, entitlement, or knowledge version
  takes effect.
- `computed_at`: when a derived run produced a fact.
- `recorded_at`: when a human or service committed the record.

Late arrival changes receipt order, not business occurrence time. Historical
queries state whether they use event time, receipt time, or effective time.

## Audit invariant

The engine must be able to traverse:

`event -> journey -> metric fact -> evidence -> pattern -> hypothesis ->
recommendation -> founder decision -> experiment/product change -> outcome ->
knowledge version -> retrieval answer`

Each edge is represented by an identifier, not inferred from prose.
