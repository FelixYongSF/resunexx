# ResuNexx Production Reproducibility Plan

## Status

Phase 0.5 documentation only. No production change or deployment is authorized.

## Current production evidence

| Item | Observed state |
|---|---|
| Repository | `https://github.com/FelixYongSF/resunexx.git` |
| Repository root | `/Users/felix/Documents/PP` |
| Next.js app root | `/Users/felix/Documents/PP/resume-score` |
| Active branch | `main` |
| Local and `origin/main` HEAD | `2bad7908318aaac1dd4a98770afe3b857ac34fba` |
| Current Vercel project | `resunexx-prod` / `prj_KeB9Nj7lnTFwyNpFs9mVv8TKoC4W` |
| Current production deployment | `dpl_75tm1iLJbVWQXj426x3DqwUkQk6h` |
| Production deployment URL | `resunexx-prod-b4vb2pi1i-nexx52.vercel.app` |
| Production aliases | `resunexx.com`, `www.resunexx.com`, and Vercel aliases |
| Deployment source | Vercel CLI |
| Deployment Git metadata | No Git SHA in current deployment metadata |
| Best prior Git-traceable deployment | `2bad790` |
| Hosting | Vercel, region observed as `iad1` |
| Framework | Next.js App Router |
| Build command | `pnpm run build` |
| Install command | `pnpm install --frozen-lockfile` |
| Package manager | pnpm with `pnpm-lock.yaml` |
| Lockfile/workspace | pnpm lockfile and `pnpm-workspace.yaml` |
| Node runtime | Node serverless functions; exact supported major is not pinned in repository |
| SQL migration state | None; no SQL database or migration ledger |
| Operational storage | Upstash Redis REST |
| Generated production artifact | Yes: isolated staging directory with selected files and generated `.next` output |

## Why production is not reproducible from one commit

The latest production deployment was created through Vercel CLI from an
isolated staging directory. That directory was based on `main@2bad790` plus a
selected set of uncommitted Resume Resources and PDF/report-engine files.
Vercel therefore records the deployment actor and runtime shape but no
`githubCommitSha`.

At the same time, the active working tree contains many modified and untracked
files. Some are represented in production, some are not, and the selection is
not encoded in a committed manifest. Rebuilding from `2bad790` alone will omit
production content; building the current dirty tree may include unrelated work.

The exact problem is release provenance, not a missing Git remote.

## Production differences and external configuration

### Source differences

- production includes selected files absent from `2bad790`;
- the active worktree includes additional unrelated or later files;
- the temporary deployment tree has no `.git` directory;
- generated `.next` output exists but is not an authoritative source artifact.

### Build configuration

`vercel.json` currently specifies:

- framework: `nextjs`;
- install: `pnpm install --frozen-lockfile`;
- build: `pnpm run build`.

The repository does not pin a Node major through `engines`, `.nvmrc`, or
`.node-version`. The pnpm workspace file also contains unresolved build-policy
placeholder text and must be made deterministic before a governed release.

### Required environment-variable names

Values remain secret and are intentionally omitted.

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `POLAR_ACCESS_TOKEN`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_STANDARD_PRODUCT_ID`
- `POLAR_FULL_PRODUCT_ID`
- `NEXT_PUBLIC_APP_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN` if retained
- `KV_REST_API_KV_URL` if retained by the Upstash integration
- `KV_REST_API_REDIS_URL` if retained by the Upstash integration
- `REPORT_PROCESSING_TTL_SECONDS`
- `REPORT_FREE_TTL_SECONDS`
- `REPORT_PAID_TTL_SECONDS`

Legacy Paddle environment variables still exist in Vercel but are not part of
the active Polar runtime contract. Their removal should occur only after a
separate production configuration review.

### External services

- Vercel project and domain aliases;
- GitHub repository;
- OpenAI API;
- Polar production products and signed webhook;
- Upstash Redis;
- DNS/TLS for `resunexx.com`.

## Shortest safe closure path

1. Freeze deployment activity while creating a release candidate.
2. Inventory the exact current production source from the retained isolated
   staging tree and compare it with `main@2bad790`.
3. Classify differences into:
   - intended production source;
   - generated output;
   - local-only or unrelated work.
4. Create a clean release branch from `main`.
5. Apply only intended production source changes.
6. Remove generated `.next`, output samples, local artifacts, and unrelated
   files from release scope.
7. Pin:
   - Node major;
   - package manager version;
   - lockfile;
   - workspace build policy;
   - Vercel root, framework, install, and build settings.
8. Create and validate a versioned environment contract containing names,
   required/optional classification, validation rules, and secret ownership,
   never values.
9. Build and test from a clean clone using the same commands as Vercel.
10. Commit all intended production source as one reviewed release commit.
11. Deploy from Git/CI using that commit, not a dirty directory.
12. Record deployment ID, commit SHA, lockfile hash, runtime versions,
    environment-contract version, and artifact/build identity.
13. Verify aliases, public routes, FREE/PRO/ELITE flows, payment security,
    report retrieval, and PDF access.
14. Retain the previous deployment as the documented rollback target.

## Required future release record

Every production deployment must preserve:

- repository and branch;
- exact commit SHA;
- clean-tree assertion;
- build command and framework;
- Node and pnpm versions;
- lockfile hash;
- migration version or explicit `none`;
- environment-contract version;
- Vercel project and deployment ID;
- deployment actor and approval;
- build result;
- smoke-test result;
- rollback deployment ID.

The versioned variable-name and validation contract is maintained in
`ResuNexx_Production_Environment_Contract.md`. Secret values remain outside the
repository.

## Migration state

ResuNexx currently has no SQL database or migration ledger. Its Redis keys are
created operationally by code. Until Nexx Core exists, release records must say
`migration_state: none` rather than leaving the field ambiguous.

Future Core deployments must include the PostgreSQL migration ledger and schema
compatibility status.

## Acceptance criteria for reproducibility closure

- A clean clone of one commit produces the same route and feature inventory.
- CI and Vercel use pinned compatible Node and pnpm versions.
- `pnpm install --frozen-lockfile` and `pnpm run build` pass.
- No uncommitted file is required for production.
- No generated artifact is treated as source.
- Environment names and validation are documented without secrets.
- Deployment metadata contains the release commit SHA.
- The release record contains migration state and rollback target.
- A second operator can reproduce the build using only repository access and
  authorized environment/service credentials.

## Rollback

No rollback is performed in Phase 0.5. During a future governed release, retain
`dpl_75tm1iLJbVWQXj426x3DqwUkQk6h` as the initial rollback candidate until the
new Git-traceable deployment passes all production checks.

## Conclusion

The shortest safe repair is to encode the already-approved production source
in one clean release commit and return deployment authority to Git/CI. Copying
the current dirty tree or treating the staging directory as a permanent source
would preserve the provenance defect.
