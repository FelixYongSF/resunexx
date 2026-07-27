# Nexx Core Identity, Privacy, Consent, and Retrieval Governance

## Status

Proposed governance specification. Founder policy choices are listed in the
decision register. No production collection is authorized by this document.

## Identity model

### Identifiers

- `anonymous_id`: first-party, random, product-scoped browser identifier.
- `actor_id`: Core pseudonymous subject, never an email or report ID.
- `session_id`: versioned inactivity-bounded interaction period.
- `journey_id`: derived path across eligible touchpoints.
- `upload_id`: metadata-only lifecycle reference; not file content.
- `analysis_run_id`: one engine execution and version.
- `report_id`: product operational artifact reference.
- `checkout_id`, `order_id`, `transaction_id`, `refund_id`: separate
  commercial references.

No browser fingerprinting. No probabilistic identity merging.

### Identity linking

Link only through deterministic server-confirmed facts, such as an authenticated
product account or verified provider/customer relationship approved by policy.
Store the link in a protected identity vault. Events reference only
pseudonymous IDs.

Cross-product identity linking is disabled by default. Aggregate knowledge
transfer does not require personal linking.

## Direct identifiers

Email, name, phone, address, LinkedIn URL, and provider customer details remain
in operational product/provider systems or a separately encrypted identity
vault. They are absent from:

- general Core events;
- metric properties;
- evidence summaries;
- observed patterns;
- semantic indexes;
- founder-facing AI prompts.

## Sensitive resume boundary

The following never enters general Core learning storage:

- uploaded file bytes;
- extracted resume text or previews;
- original filename;
- person-specific report prose;
- raw target job description;
- raw OpenAI prompt or response;
- generated rewrite text linked to a person.

Allowed analytical metadata is enumerated, for example file format, safe size
band, extraction outcome, engine version, duration band, report tier, and safe
error category.

## Consent

Consent records include:

- pseudonymous subject;
- product/environment;
- purpose;
- state;
- consent-copy version;
- privacy-policy version;
- region/rule set;
- action and receipt times;
- source surface;
- withdrawal or replacement relationship.

Essential operational processing is separated from optional analytics.
Optional events are not emitted or accepted when the required consent state is
absent.

## Data minimization

- Event schemas use property allowlists.
- Unknown properties are rejected, not silently stored.
- Free-form analytics metadata is prohibited.
- Values use controlled taxonomies and bands where exact values are unnecessary.
- Collection must map to a governed metric, evidence need, security purpose, or
  explicit product operation.
- “May be useful later” is not a collection purpose.

## Retention proposal

Final durations require founder policy approval and legal review.

| Data class | Proposed default |
|---|---|
| Rejected-payload safe diagnostics | 30 days |
| Raw pseudonymous events | 13 months |
| Identity links | Only while operationally required |
| Consent proof | Policy/legal duration |
| Non-identifying governed metric facts | Long-term, versioned |
| Evidence, decisions, experiments, outcomes, knowledge | Long-term with review |
| Payment facts | Finance/legal duration |
| Retrieval audit | Security-policy duration |

Retention is enforced by scheduled jobs with deletion audit. Operational
ResuNexx report TTL remains separate from Core governance.

## Deletion and anonymization

1. Create an auditable deletion/access request.
2. Verify the requester through an approved product process.
3. Delete or irreversibly anonymize direct identity and identity links.
4. Delete person-specific operational records according to product/legal rules.
5. Remove subject-level pseudonymous records where required.
6. Preserve only lawful non-identifying aggregates that cannot be relinked.
7. Propagate deletion to semantic indexes, caches, exports, and backups under
   documented schedules.
8. Record completion without retaining deleted personal values.

Knowledge or evidence that accidentally depends on removed personal content is
invalidated and recomputed or retired.

## Product and tenant separation

- Every record carries organization, product, and environment.
- Production and non-production never mix.
- Database roles and retrieval tools enforce scope.
- Product adapters cannot read another product’s raw records.
- Cross-product metrics require approved comparable definitions.
- Cross-product knowledge uses aggregate evidence and explicit scope review.

## Founder-facing retrieval

### Structured quantitative retrieval

Numbers come only from allowlisted, parameterized structured queries over:

- governed metric facts;
- funnels and journeys;
- purchasing and refund facts;
- experiments and measured outcomes;
- evidence lineage;
- decision and knowledge status.

The AI receives query results and citations, not database credentials. It may
not write arbitrary SQL or invent a value when evidence is absent.

### Semantic retrieval

Eligible corpus:

- approved knowledge versions;
- privacy-safe evidence summaries;
- experiment conclusions;
- founder decisions and rationale;
- recommendations with lifecycle status;
- governed aggregate report snapshots.

Ineligible corpus:

- raw events;
- identity tables;
- resume or report content tied to a person;
- emails or direct identifiers;
- prompts/responses tied to a person;
- unreviewed AI summaries;
- full provider payloads;
- secrets and internal error logs.

## ChatGPT and Codex boundary

ChatGPT/Codex access is mediated by versioned tools with:

- authenticated caller;
- authorized product/environment scope;
- parameter validation;
- result row and aggregation limits;
- privacy policy checks;
- source record IDs and definition versions;
- audit logging;
- explicit “insufficient evidence” behavior.

No unrestricted database, Redis, object storage, identity vault, or provider
dashboard access is granted to a model.

## Retrieval audit

Record:

- caller and interface;
- question/request fingerprint where policy permits;
- authorized scope;
- tool and version;
- parameters;
- source records and definition versions;
- citations returned;
- denial or warning;
- answer timestamp;
- model/version when an answer is generated.

Do not log secrets or sensitive raw customer content.

## Security controls

- encryption in transit and at rest;
- separate ingest, worker, migration, founder-read, and identity-vault roles;
- secret manager, never source control;
- row-level or equivalent product/environment isolation;
- rate limiting and abuse prevention;
- schema and payload scanning;
- backup/restore tests;
- access review;
- immutable decision/knowledge promotion audit;
- incident and deletion procedures.

## Founder policy approvals required

- consent surfaces and regional behavior;
- final retention periods;
- deletion/anonymization policy;
- whether direct identifiers are retained in a vault;
- aggregate-only versus limited pseudonymous founder retrieval;
- cross-product knowledge and identity-sharing boundaries.
