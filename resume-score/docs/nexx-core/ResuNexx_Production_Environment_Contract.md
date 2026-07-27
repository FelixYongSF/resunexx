# ResuNexx Production Environment Contract

## Status

Documentation contract only. It records variable names and validation rules,
never values. It does not authorize changing Vercel configuration.

Contract version: `resunexx-env-v1`

## Current runtime variables

| Variable | Required in production | Secret | Owner/source | Runtime purpose | Safe validation |
|---|---:|---:|---|---|---|
| `OPENAI_API_KEY` | Yes | Yes | OpenAI account owner | Server-side resume analysis | Exists, non-empty, server-only; never print |
| `OPENAI_MODEL` | Yes | No | Engineering configuration | Pins analysis model | Approved model identifier; record with analysis run |
| `POLAR_ACCESS_TOKEN` | Yes | Yes | Polar organization owner | Server-side checkout/provider API | Exists, server-only; test authorized API metadata without logging token |
| `POLAR_WEBHOOK_SECRET` | Yes | Yes | Polar webhook owner | Signed webhook verification | Exists; invalid-signature fixture rejected |
| `POLAR_STANDARD_PRODUCT_ID` | Yes | No | Polar production catalog | PRO mapping | Equals approved Standard product ID and cannot map to Full |
| `POLAR_FULL_PRODUCT_ID` | Yes | No | Polar production catalog | ELITE mapping | Equals approved Full product ID and cannot map to Standard |
| `NEXT_PUBLIC_APP_URL` | Yes | No | Production domain policy | Canonical redirects and absolute links | Exactly approved HTTPS origin with no path |
| `KV_REST_API_URL` | Yes | Sensitive configuration | Upstash/Vercel integration | Redis REST endpoint | Valid HTTPS endpoint; do not log full value |
| `KV_REST_API_TOKEN` | Yes | Yes | Upstash/Vercel integration | Redis read/write access | Exists; scoped connectivity test |
| `KV_REST_API_READ_ONLY_TOKEN` | Optional | Yes | Upstash/Vercel integration | Read-only diagnostics if code uses it | Remove if unused after separate review |
| `KV_REST_API_KV_URL` | Optional/legacy integration alias | Sensitive configuration | Upstash/Vercel integration | Marketplace-generated alias | Document or remove only after runtime-reference audit |
| `KV_REST_API_REDIS_URL` | Optional/legacy integration alias | Yes | Upstash/Vercel integration | Direct Redis alias if used | Document or remove only after runtime-reference audit |
| `REPORT_PROCESSING_TTL_SECONDS` | Yes | No | Engineering policy | Pending/processing retention | Positive bounded integer |
| `REPORT_FREE_TTL_SECONDS` | Yes | No | Product/privacy policy | Free report retention | Positive integer matching approved policy |
| `REPORT_PAID_TTL_SECONDS` | Yes | No | Product/privacy policy | Paid report retention | Positive integer matching approved policy |

Legacy Paddle variables are not part of this active runtime contract. They may
remain in Vercel until a separate configuration-removal review proves no active
or rollback runtime depends on them.

## Environment invariants

- Secrets are stored in Vercel or an approved secret manager, never Git.
- Public variables contain no credentials.
- Production, preview, and development use separate values and provider
  environments.
- Product IDs are validated as a pair and cross-mapping is rejected.
- `NEXT_PUBLIC_APP_URL` is `https://resunexx.com` or the explicitly approved
  canonical production origin.
- Build logs and runtime logs print only configured true/false status, never
  values.
- Every deployment records this contract version.

## Phase 1 Nexx Core variables

Names are proposed and remain inactive until ADR approval:

| Variable | Secret | Purpose |
|---|---:|---|
| `NEXX_CORE_ENABLED` | No | Server-side feature gate; defaults false |
| `NEXX_CORE_DATABASE_URL` | Yes | Neon PostgreSQL connection string; server-only and never logged |
| `NEXX_CORE_INGEST_URL` | Sensitive configuration | Core ingestion origin |
| `NEXX_CORE_PRODUCT_KEY` | No | Registered product key |
| `NEXX_CORE_ENVIRONMENT` | No | Development/staging/production boundary |
| `NEXX_CORE_SERVER_TOKEN` | Yes | Product-to-Core server authentication |
| `NEXX_CORE_CONTRACT_VERSION` | No | Product adapter contract version |
| `NEXX_CORE_PRIVACY_POLICY_VERSION` | No | Payload policy version |
| `NEXX_CORE_OUTBOX_SIGNING_KEY` | Yes | Optional message authenticity when transport requires it |

The Core adapter must be non-blocking. Missing Core variables while
`NEXX_CORE_ENABLED=false` must not affect ResuNexx. Enabling Core with missing
required variables must fail configuration validation before release.

### Approved Phase 1 database foundation

The founder approved Neon Free Plan through the Vercel Marketplace in AWS US
East 1 (Virginia) on 2026-07-26, with a US$0 validation budget. An isolated
development database was provisioned and its credentials are used locally only
for Phase 1 migration and verification. Vercel Production and Preview contain
no Neon connection variables. The Free Plan's limited restore history is not
approved as a production recovery objective; restore testing and a new
production decision are required before `NEXX_CORE_ENABLED` may be enabled in
production.

## Release validation

For each environment:

1. Compare configured names against this contract.
2. Confirm required values exist without reading them into logs.
3. Validate non-secret enumerations and URLs.
4. Validate Standard and Full product mappings.
5. Run signed-webhook negative and fixture tests.
6. Run Redis connectivity and TTL-policy checks.
7. Record contract version in the release record.

## Change process

Adding, removing, or changing a variable requires:

- contract version change;
- owner and purpose;
- migration/rollback behavior;
- preview validation;
- production approval;
- documentation update without secret values.
