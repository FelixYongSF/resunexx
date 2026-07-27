# Gate B Staging Preparation

## Status

**Gate B staging delivery validation passed on 2026-07-27.**
An authenticated Vercel Preview browser session delivered one minimized
`page.viewed` Shadow Mode event to the dedicated Neon staging database. Vercel
Preview Protection remained enabled throughout; a temporary Preview-only
shareable access credential used during an earlier anonymous check was revoked.
This is not a production enablement record and does not authorize Nexx Core
collection from the deployed ResuNexx application.

## Isolated staging boundary

- Neon project resource: existing founder-owned `neon-amethyst-harbor` Free
  resource in AWS US East 1.
- Neon branch: `staging-nexx-core`.
- Branch source: schema-only; it contains no copied development events and no
  production data.
- Database: a separate empty `nexx_core_staging` database inside that branch.
- Branch retention: no automatic deletion; it remains available for the Gate B
  staging work until the founder retires it.
- Local configuration: ignored `.env.staging.local`, owner-readable only. It
  is never committed or added to Vercel Production.
- Preview configuration: eight Nexx Core variables exist in Vercel **Preview**
  scope only; `NEXX_CORE_ENABLED=false`, the target is `staging`, and the only
  permitted remote destination is the same Preview deployment's
  `/api/nexx-core/shadow-ingest` endpoint.
- Local founder replica: a separate encrypted staging replica, never mixed
  with the development replica.

## Validation completed

| Check | Result |
| --- | --- |
| Reviewed migrations | 5/5 applied to `nexx_core_staging` |
| Transaction rollback probe | Passed |
| Staging localhost ingest receiver | Bound only to `127.0.0.1:4318` |
| FREE/PRO/ELITE synthetic lifecycle fixture | 12 minimized events accepted |
| Encrypted local staging replication | 12 events, 1 registry record, no payment facts |
| Shadow data quality | Passed; four inspected low-cardinality event types matched source and replica |
| Preview deployment | Built and Ready at `dpl_SDVKMjNErmVgPdZooHs4ce6uqXYX`; no Production deployment occurred |
| Authenticated Preview Shadow delivery | Passed: a signed-in Preview page delivered one minimized `page.viewed` event to `nexx_core_staging` (event count 16 to 17); no user-facing console error observed |
| Preview access control | Anonymous requests remain rejected by Vercel Preview Protection; temporary shareable access was revoked after the earlier verification attempt |
| Staging rollback recovery verification | Passed: the intentional write was rolled back and its probe record was absent afterward |
| Staging founder-owned local replication | Passed: five new staging events synchronized into the encrypted local replica; read-only replica totals match the source total of 17 events and contain zero payment facts |
| Production safety | No production database connection, Production Vercel configuration change, deployment, or customer event collection |

## Controls introduced

- Migrations and rollback verification accept only explicit `development` or
  `staging` targets; `production` remains rejected.
- Staging requires `NEXX_CORE_STAGING_DATABASE_URL`; it cannot silently fall
  back to the development URL.
- The migrator refuses a database that has Core tables but no migration ledger,
  preventing unsafe replay against a schema-only clone.
- Shadow Mode requires its requested environment to match its target. Local
  receivers remain localhost-only; Preview permits only same-deployment staging
  ingest, forwarding an authenticated caller's short-lived Vercel OIDC token or
  same-origin Preview cookie without logging either credential.
- The staging replica uses an independent encrypted local volume.

## Gate B outcome and remaining gates

Gate B's isolated Preview-to-staging delivery requirement is complete. The
following are separate release and production gates; they are not authorized by
this Gate B result:

1. Create a clean, reviewed release commit with reproducible provenance and
   pinned runtime/package-manager policy.
2. Provision a separately approved production Core database with an explicit
   recovery objective and provider-level point-in-time restore drill.
3. Complete the founder's final production privacy, consent, retention, and
   deletion operating approval.

The current staging validation is intentionally local-to-Neon and local-to-Mac.
It proves the staging data boundary and adapter behavior without exposing the
public ResuNexx site to Core collection.
