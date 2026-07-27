# Nexx Core Founder Decision Register

## Purpose

This register contains only genuine business or policy decisions. Ordinary
technical architecture is resolved in the ADR recommendations.

## Decision register

Current disposition: **FDR-001 through FDR-006 approved by the founder on
2026-07-25.** FDR-007 and FDR-008 remain pending. The approved decisions adopt
the recommended conservative defaults recorded below.

## Founder approval record

The founder approved the following policy statement on 2026-07-25:

> Nexx Core will use anonymous, data-minimized, deletable records; it will not
> track a person across products by default; and founder-facing AI will begin
> with aggregate data only.

This approval accepts the recommended defaults in FDR-001 through FDR-006:

- separate essential operations from optional learning analytics;
- use the proposed retention defaults pending legal review;
- delete direct identity and person-level data after verified requests while
  retaining only lawful non-identifying aggregates;
- keep direct identifiers outside general Core records;
- restrict founder-facing AI to aggregate governed facts and approved,
  privacy-safe decision/knowledge materials;
- permit aggregate knowledge transfer while prohibiting cross-product identity
  linking by default.

This record does not authorize Phase 1 implementation, production data
collection, deployment, or a change to the current ResuNexx privacy notice. It
authorizes the policy assumptions needed to finalize the Phase 1 design gate.

On 2026-07-26, the founder separately authorized Phase 1 local and
non-production implementation. That authorization excludes deployment,
production database access, production data writes, and production event
collection. It is now frozen until Founder-Owned Local Data Replication has
passed its dedicated readiness gate.

| ID | Question | Recommended choice | Reason | Meaningful tradeoff | Risk of delay | Latest decision phase |
|---|---|---|---|---|---|---|
| FDR-001 | What consent experience and regional policy should govern optional learning analytics? | Separate essential operations from optional analytics; use explicit, versioned consent where regional rules require it | Preserves product operation while making learning transparent and lawful | Lower event coverage for users who do not consent | Phase 1 schemas and instrumentation cannot be approved | Before Phase 1 event contract freeze |
| FDR-002 | How long should raw pseudonymous events, identity links, payment facts, and retrieval audits be retained? | Start with 13 months for raw pseudonymous events, 30 days for safe rejection diagnostics, operational-only identity links, and legal/finance duration for payment facts; review annually | Supports annual comparison without indefinite raw retention | Shorter retention limits long-horizon analysis; longer retention increases privacy/cost | Purge jobs and privacy notices cannot be finalized | Before Phase 1 production collection |
| FDR-003 | What deletion and anonymization promise will customers receive? | Delete direct identity and person-level operational data after verification; irreversibly anonymize eligible learning linkage; retain only lawful non-identifying aggregates | Gives a clear user promise while preserving aggregate history | Strong deletion can reduce cohort continuity and requires operational work | Data models may become impossible to purge safely | Before Phase 1 database approval |
| FDR-004 | May Nexx Core retain or use direct identifiers? | Keep email/direct identifiers outside general Core; permit only a separately encrypted vault when operationally necessary | Minimizes breach and retrieval risk without blocking payment/support | Less convenient cross-session linking | Identity design and access roles remain ambiguous | Before Phase 1 identity implementation |
| FDR-005 | What may founder-facing ChatGPT/Codex retrieve? | Aggregate governed facts plus approved decisions, outcomes, evidence summaries, and knowledge; no raw resume content or direct identifiers; pseudonymous drill-down disabled initially | Delivers decision value with the smallest privacy surface | Harder to investigate individual anomalies | Retrieval contracts and privacy controls cannot be approved | Before any retrieval phase; aggregate boundary should be accepted in Phase 1 |
| FDR-006 | What cross-product sharing is permitted? | Share only aggregate evidence, reusable hypotheses, and approved knowledge; prohibit personal identity linking by default; require explicit future opt-in for any account-level linkage | Enables reusable learning without covert customer profiling | Some cross-product journey continuity is unavailable | Product registration and knowledge scope may drift | Before second-product onboarding; default prohibition should be accepted in Phase 1 |
| FDR-007 | Which commercial definitions govern pricing learning? | Use provider currency facts; report gross paid amount, refunds, and net separately; do not combine currencies without a versioned FX rule; treat discounts, tax, fees, partial refunds, and disputes explicitly | Prevents misleading revenue and conversion conclusions | More complex metrics and reconciliation | Pricing evidence cannot become governed | Before Phase 4 commercial metrics |
| FDR-008 | Who may approve supported knowledge and production changes? | Founder approval required for production changes and supported/cross-product knowledge; delegated reviewers may mark proposed/under-review only | Keeps irreversible business learning and production authority accountable | Slower promotion and review queue | AI or engineering may accidentally over-promote conclusions | Before Phase 3 decision workflow design |
| FDR-009 | Must the founder retain a usable, local copy of Core data before Phase 1 proceeds? | Yes. Formal Core data must have an encrypted, founder-owned local replica with scheduled sync, watermark-based recovery, and local analysis access | Prevents the company from depending solely on a hosted database or vendor console | Adds local security, backup, and operational responsibilities | Founder cannot independently inspect, retain, or recover the Core record | **Before any further Phase 1 work or event emission** |

## Decisions intentionally kept out of this register

Engineering owns:

- modular monolith and adapter boundary;
- PostgreSQL as Core system of record;
- append-only event design;
- versioning and idempotency;
- worker/retry architecture;
- structured-versus-semantic retrieval implementation;
- release provenance and compatibility testing.

The founder needs to approve provider budget/region selections, but not choose
database schemas, event serialization, or job orchestration details.
