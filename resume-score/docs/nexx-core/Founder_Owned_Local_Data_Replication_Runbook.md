# Founder-Owned Local Data Replication Runbook

## Scope

This runbook is only for the independent Neon development or staging database
and synthetic/non-production Nexx Core events. It must not be used with
production data without a separate Gate B decision.

## What is installed on this Mac

- Encrypted replica: `~/.resunexx/nexx-core/founder-replica.sparsebundle`
- Key custody: macOS Keychain only, service
  `com.resunexx.nexx-core.local-replication`
- Local database: PGlite inside the encrypted replica
- Schedule: launchd label `com.resunexx.nexx-core-local-replication`, every 6
  hours
- Logs: `~/.resunexx/nexx-core/logs/`

GitHub and this repository contain code, schema, and documentation only. They
must never contain replica exports, mounted database files, credentials, or
customer data.

## Safe local commands

From the repository root:

```sh
pnpm run nexx-core:replicate:local
pnpm run nexx-core:replica:query
```

Each command uses an exclusive lock. The encrypted volume mounts for the work
and is detached after the Node process exits.

The read-only query prints aggregate event and payment-fact counts only. It
does not print customer, resume, payment-card, or provider payload data.

For the separate staging database, use the matching staging commands. They
read the ignored `.env.staging.local` and use a distinct encrypted local
replica volume:

```sh
pnpm run nexx-core:migrate:staging
pnpm run nexx-core:restore-test:staging
pnpm run nexx-core:ingest:staging
pnpm run nexx-core:verify-shadow:staging
pnpm run nexx-core:replicate:staging
pnpm run nexx-core:validate-shadow-quality:staging
```

Staging remains localhost-only until a separate deployment authorization is
granted. None of these commands writes Vercel variables or deploys ResuNexx.

## Local ingestion verification

The Phase 1 event receiver is a development-only service. It is never mounted
in the ResuNexx web application and listens only on `127.0.0.1` when started:

```sh
pnpm run nexx-core:ingest:dev
pnpm run nexx-core:verify-ingest:dev
```

`NEXX_CORE_INGEST_TARGET=development`, `NEXX_CORE_ENVIRONMENT=development`,
and a local `NEXX_CORE_SERVER_TOKEN` are required in `.env.local`. The token
is local-only, must not be committed, and must never be copied to Vercel.

## ResuNexx Shadow Mode

Shadow Mode is a development-only, non-blocking bridge from existing
ResuNexx server analytics to the localhost ingestion API. It requires all of:

```sh
NEXX_CORE_SHADOW_MODE=true
NEXX_CORE_SHADOW_TARGET=development
NEXX_CORE_INGEST_URL=http://127.0.0.1:4317/v1/events
```

Production and remote destinations are rejected. Events are minimized before
delivery; report identifiers, resume material, filenames, direct identifiers,
and payment facts are excluded. A failed local delivery never changes a user
operation.

## Recovery behavior

Every export has an AES-256-GCM archive, SHA-256 checksum, and HMAC-protected
manifest. If a run stops after creating an export but before local apply, the
next run verifies and applies that pending export before reading newer events.
The source read has a small time overlap and local event-ID deduplication, so a
boundary retry does not duplicate local records or skip a late event.

## Local retention and device loss

The source database remains the retention authority. The local replica is an
encrypted founder-owned copy. If the Mac is lost, revoke or replace the
Keychain secret and recreate the local replica from the non-production source;
do not place its data in Git or cloud-sync folders. Any future production use
requires a new retention, deletion, and device-loss decision under Gate B.
