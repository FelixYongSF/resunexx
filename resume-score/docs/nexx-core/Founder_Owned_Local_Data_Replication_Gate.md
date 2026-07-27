# Founder-Owned Local Data Replication Gate

## Status

**PASSED FOR LOCAL/NON-PRODUCTION ON 2026-07-26. Production use remains
prohibited.**

## Founder instruction

The founder requires Nexx Core / ResuNexx formal data to be automatically
backed up and synchronized to a founder-controlled local Mac before Phase 1
continues. This is a company-control and recoverability requirement, not a
browser cache or vendor-backup substitute.

## Required outcome

The founder can retain and inspect a current, encrypted local replica without
relying exclusively on Neon, Vercel, or a vendor dashboard.

## Approved design direction

1. The online PostgreSQL ledger remains the immediate durable system of record.
2. A replication worker creates encrypted, versioned exports on a daily or
   more frequent schedule.
3. Exports use an encrypted, canonical event-ledger representation. PostgreSQL
   dump and Parquet export remain planned compatibility enhancements where the
   required local tooling is available.
4. The founder Mac pulls or downloads exports into encrypted local storage,
   using DuckDB or local PostgreSQL for founder analysis.
5. Sync uses a durable cursor/watermark and manifest so it can resume after an
   offline period without duplicates or gaps.
6. GitHub stores code and schemas only; it must never receive customer data.
7. The local replica must remain encrypted at rest and exclude direct
   identifiers unless a separately approved, encrypted identity vault is
   introduced.

## Gate acceptance criteria

The gate passes only when all of the following are evidenced in a local,
non-production environment with synthetic data:

- scheduled export is created successfully;
- export is encrypted before local persistence;
- a Mac-local replica can be rebuilt from the export;
- a normal incremental sync updates the local replica;
- an interrupted sync resumes from its watermark without loss or duplication;
- manifest checks detect an incomplete or altered export;
- local data is not written to Git, browser storage, logs, or production;
- a founder can run one documented local read-only query against the replica;
- retention and secure deletion behavior for local copies is documented.

## Explicit prohibitions until the gate passes

- no further Phase 1 implementation;
- no ResuNexx event adapter wiring;
- no real customer event collection;
- no production deployment, production database connection, or production
  migration;
- no claim that Neon backup history alone satisfies founder-owned replication.

## Acceptance evidence

The following verification was completed using only the dedicated Neon
development database and synthetic events:

- an AES-256 encrypted macOS sparse bundle was created and verified as
  encrypted;
- a PGlite local PostgreSQL-compatible replica was created inside that bundle;
- an AES-256-GCM export and HMAC-protected manifest were created before local
  application;
- the initial synthetic ledger exported 3 events and 1 registry record;
- a deliberately interrupted export recovered on the next run with
  `resumed=true` and no duplicate local records;
- an incremental synthetic fixture was replicated and source/local event counts
  matched;
- a no-change run completed with `0 events` and `0 registry records`;
- unit tests reject a modified manifest before it can be applied;
- a read-only local event and payment-fact summary query succeeded; synthetic
  payment facts were encrypted and replicated alongside the event ledger;
- a macOS launchd job was installed to run every 6 hours and the encrypted
  volume is detached after each run.

No production database, production event, customer resume, report content, or
direct identifier was used.

## Next decision

ADR-013 records the approved local/non-production design. Phase 1 may now
resume only within the founder's previously authorized local/non-production
scope. Production Core enablement remains blocked by Gate B.
