# Shadow Mode Data Quality Validation

## Scope

This validation is restricted to synthetic, development-only Nexx Core data. It does not deploy ResuNexx, write production data, or inspect resume content, contact details, payment credentials, or report text.

## Checks

- Only the four Shadow Mode event names are inspected: `page.viewed`, `artifact_upload.started`, `cta.clicked`, and `assessment.completed`.
- Every inspected event is revalidated against the shared event catalog and privacy sanitizer.
- Person, session, journey, correlation, causation, and entity references are forbidden for this Shadow surface.
- Sensitive-looking property values and duplicate event or idempotency identifiers fail validation.
- Aggregate counts must match between the Neon development source and the encrypted founder-owned local replica.
- A local ingestion delivery failure returns `false` and never blocks the calling product workflow.

## Local Command

```bash
pnpm run nexx-core:validate-shadow-quality:dev
```

The command is development-only and requires the locally stored replication key. It prints aggregate counts only.

## Validation Record — 2026-07-27

Status: passed.

- Inspected minimal Shadow events: 9
- `page.viewed`: source 2 / encrypted local replica 2
- `artifact_upload.started`: source 2 / encrypted local replica 2
- `cta.clicked`: source 3 / encrypted local replica 3
- `assessment.completed`: source 2 / encrypted local replica 2

No deployment occurred. Production systems, production data, and real customer records were not used.
