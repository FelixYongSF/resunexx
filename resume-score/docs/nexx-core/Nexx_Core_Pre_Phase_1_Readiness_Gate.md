# Nexx Core Pre-Phase-1 Readiness Gate

## Gate run

- Date: 2026-07-25
- Scope: architecture and governance readiness only
- Production changes: none
- Phase 1 implementation: **frozen pending Founder-Owned Local Data Replication**
- Governing architecture: Review Draft 1.1
- Current ResuNexx Git baseline: `main@2bad7908318aaac1dd4a98770afe3b857ac34fba`
- Current production deployment evidence:
  `dpl_75tm1iLJbVWQXj426x3DqwUkQk6h`

## Documents reviewed

- `Nexx-Core-Learning-Infrastructure-V1-Architecture.md`
- `Nexx_Core_Systems_of_Record_Specification.md`
- `Nexx_Core_Identity_Privacy_Consent_Retrieval_Governance.md`
- `ResuNexx_Production_Reproducibility_Plan.md`
- `ResuNexx_Production_Environment_Contract.md`
- `Nexx_Core_Founder_Decision_Register.md`
- `Nexx_Core_Phase_0_5_Readiness_Closure.md`
- ADR-001 through ADR-012
- Phase 0 audit, gap matrix, ADR status, learning-loop validation, and Phase
  1-2 implementation plan

## Gate rules

- **Pass:** artifact and explicit evidence satisfy the gate.
- **Conditional:** design is complete but named approval or later evidence is
  still required.
- **Blocked:** Phase 1 must not begin until resolved.
- **Production blocked:** local/non-production work may later begin, but
  production enablement is prohibited.

## Gate matrix

| Gate | Evidence | Result | Required closure |
|---|---|---|---|
| G01 Governing specification exists | Architecture V1.1 includes the complete learning loop and invariants; founder approved it on 2026-07-25 | Pass | Apply only after Gate A fully passes |
| G02 Self-Growing Engine integrity | Promotion, outcome, counter-evidence, correction, retrieval, and cross-product rules are explicit | Pass | Enforce later with schemas/tests |
| G03 ADR completeness | 12 ADRs contain all required decision fields and evidence tests; founder approved the recommended direction on 2026-07-25 | Pass | Execute phase-specific conditions when their phase begins |
| G04 Ordinary technical decisions resolved | Boundary, PostgreSQL, event contract, versioning, transformations, retrieval implementation, and release governance have preferred choices | Pass | Engineering acceptance during architecture review |
| G05 Founder policy decisions minimized | Eight genuine policy/business decisions are isolated in FDR-001–008; FDR-001–006 were approved on 2026-07-25 | Pass | FDR-007 and FDR-008 remain scheduled for their later phases |
| G06 Systems of record explicit | Authorities, IDs, immutability, timestamps, scope, retention, retrieval, and audits are defined | Pass | Implement only after gate approval |
| G07 Identity/privacy/consent model explicit | Default-deny, pseudonymous identity, protected direct identifiers, deletion, and retrieval boundaries are defined; FDR-001–006 are approved | Pass | Implement and test only after Gate A is fully passed |
| G08 Payment truth explicit | Provider facts are distinct from entitlement; full payment/refund state model exists | Pass for capture design | FDR-007 required before governed pricing metrics |
| G09 Phase 1-2 scope coherent | Phase 1 Core foundation and Phase 2 ResuNexx adapter match architecture roadmap | Pass | Keep Phase 3-6 work out of Phase 1-2 |
| G10 Future-loop compatibility | IDs/contracts reserve later decisions, outcomes, knowledge, retrieval, and cross-product scope | Pass | Contract conformance tests later |
| G11 Environment contract documented | Current and proposed variables have names, ownership, validation, and secret rules | Pass | Pin contract version in future release |
| G12 PostgreSQL procurement ready | Founder approved Neon Free Plan through Vercel Marketplace in AWS US East 1 (Virginia), with a US$0 validation budget, on 2026-07-26 | Pass for Phase 1 foundation | Do not store production Core data until a restore test and production recovery-window decision are complete |
| G13 Production reproducibility | Root cause and safe closure plan are documented | Production blocked | Create one clean Git-traceable release before production Core emission |
| G14 Production data/migration safety | No Phase 1 migration or production change has occurred | Pass | Continue prohibition until gate approval |
| G15 Acceptance and rollback defined | Phase 1-2 criteria, privacy tests, outage isolation, reconciliation, and rollback are documented | Pass | Convert into executable tests during authorized implementation |
| G16 Founder-Owned Local Data Replication | Encrypted macOS replica, scheduled sync, manifest integrity, interrupted recovery, and synthetic-data verification are recorded | **Pass for local/non-production** | Production use remains prohibited until Gate B passes |

## Two separate authorization gates

### Gate A: permission to begin Phase 1 implementation

Required:

1. Architecture V1.1 is approved and recorded.
2. ADR-001 through ADR-012 are approved and recorded; later-phase dependencies remain scheduled.
3. FDR-001 through FDR-006 conservative defaults are approved and recorded.
4. Approve managed PostgreSQL region, budget, backup, and recovery objectives.
5. Confirm the Phase 1 scope is contracts, registry, PostgreSQL foundation,
   ingestion, privacy, payment facts, roles, and outbox only.
6. Complete and verify the Founder-Owned Local Data Replication Gate defined in
   `Founder_Owned_Local_Data_Replication_Gate.md`.

Gate A status: **PASSED FOR THE FOUNDER-AUTHORIZED LOCAL/NON-PRODUCTION SCOPE**

### Gate B: permission to enable Nexx Core in production

Requires every Gate A item plus:

1. Execute the ResuNexx production reproducibility plan.
2. Produce a clean Git commit and deployment record.
3. Pin Node and pnpm versions and resolve workspace build policy.
4. Apply reviewed non-production migrations and complete restore testing.
5. Pass contract, privacy, idempotency, outage, retry, and reconciliation tests.
6. Validate the production environment against
   `resunexx-env-v1` and the future Core contract.
7. Complete staging shadow emission and prove no customer-flow dependency.

Gate B status: **NOT PASSED**

### Gate B preparation record (2026-07-27)

An isolated Neon `staging-nexx-core` branch and empty `nexx_core_staging`
database were created under the founder-authorized staging-only scope. Reviewed
migrations, rollback verification, localhost-only Shadow delivery, encrypted
local staging replication, and Shadow data-quality checks passed. This does
not satisfy the remote Vercel staging-release requirement and does not alter
the Gate B status. See `Gate_B_Staging_Preparation.md`.

## Pre-Phase-1 approval packet

### Engineering recommendations accepted

- ADR-001: same repository, separate deployable modular monolith and data roles.
- ADR-002: managed PostgreSQL as the Core system of record.
- ADR-003: versioned append-only, default-deny events.
- ADR-004: product-scoped pseudonymous identity; deterministic links only.
- ADR-005: default-deny privacy, versioned consent, retention, and auditable
  deletion, subject to the founder policy choices below.
- ADR-006: immutable provider facts separated from entitlement.
- ADR-007: effective-dated versions preserve historical meaning.
- ADR-008: deterministic transformations and governed evidence.
- ADR-009: closed decision/outcome/knowledge lifecycle.
- ADR-010: allowlisted structured retrieval plus curated semantic retrieval.
- ADR-011: independent validation before cross-product promotion.
- ADR-012: one commit per release; no autonomous AI deployment or knowledge
  promotion.

### Founder choices required now

Approve or revise the recommended defaults in:

- FDR-001 consent;
- FDR-002 retention;
- FDR-003 deletion/anonymization;
- FDR-004 direct-identifier boundary;
- FDR-005 founder retrieval;
- FDR-006 cross-product sharing.

FDR-001 through FDR-006 are approved. FDR-007 is required before Phase 4
commercial metrics. FDR-008 is required before Phase 3 decision workflow
design, although accepting the conservative founder-approval default now
reduces later ambiguity.

## Contradiction review

No unresolved architectural contradiction was found between:

- the governing learning loop;
- systems of record;
- ADR-001 through ADR-012;
- the privacy/retrieval specification;
- the revised Phase 1-2 scope.

Historical `NOT READY` conclusions remain intentionally visible in the Phase 0
documents. Their Phase 0.5 appendices supersede readiness status without
erasing audit history.

The only operational contradiction remains production provenance: the live CLI
deployment does not map to one Git commit. It blocks production enablement, not
the act of reviewing or later beginning non-production Phase 1 work after Gate
A approval.

## Current decision

**PRE-PHASE-1 LOCAL/NON-PRODUCTION READINESS PASSED**

On 2026-07-26, the founder stated that the next development phase must first
complete and verify Founder-Owned Local Data Replication. That local,
non-production gate is now passed with synthetic-data evidence recorded in
`Founder_Owned_Local_Data_Replication_Gate.md`. The existing authorization now
permits Phase 1 only locally and outside production.

The local foundation artifacts and empty-schema migrations remain unwired to
ResuNexx customer flows. This gate does not authorize real customer-data
collection, deployment, a production database connection, or Core production
emission.

## Phase 1 local/non-production closeout update

On 2026-07-27, the authorized Phase 1 foundation was completed and verified
using only the dedicated Neon development database and synthetic data. The
formal evidence is recorded in `Phase_1_Local_Nonproduction_Closeout.md`.
This records completion of the local/non-production Phase 1 scope; it does not
alter Gate B, authorize Phase 2, or permit any production Core operation.

## Gate update: founder policy approval

On 2026-07-25, the founder approved FDR-001 through FDR-006. This closes the
former identity, consent, retention, deletion, direct-identifier, retrieval,
and cross-product-policy sub-gate. Gate A remains not passed because the
architecture/ADR approvals and PostgreSQL provider/region/budget approval are
still outstanding.

## Gate update: architecture and ADR approval

On 2026-07-25, the founder approved Architecture V1.1 and ADR-001 through
ADR-012. This closes G01 and G03. Gate A is now blocked only by selection of a
managed PostgreSQL provider, region, budget, backup strategy, and recovery
objective under ADR-002.

## Gate update: PostgreSQL foundation approval

On 2026-07-26, the founder approved Neon Free Plan through the Vercel
Marketplace in AWS US East 1 (Virginia), with a US$0 validation budget. This
closes G12 for Phase 1 foundation work. The accepted recovery boundary is the
Free Plan's limited restore history; it is adequate only before production Core
data is enabled. A restore test and a separate production recovery decision are
mandatory before Gate B can pass.
