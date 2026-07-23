# ScoreLab Engineering Operating Document

## Engineering Goal

Build small, reliable, automated product flows that can be shipped quickly, tested with real users, and reused across future ScoreLab engines.

## Technical Principles

- Keep the user flow automated end to end.
- Avoid unnecessary API calls.
- Prefer deterministic logic where possible.
- Use GPT only where language understanding, recruiter-style feedback, improvement guidance, coaching, or human explanation is needed.
- Keep future engines modular and reusable.
- Prioritize speed, cost control, and reliability.
- Do not overbuild infrastructure before product demand is proven.

## Current Stack

- Next.js
- Tailwind CSS
- OpenAI API
- Polar Checkout
- Vercel-ready deployment
- PDF text extraction
- Server-side OpenAI analysis

## Core Flow

Upload resume PDF -> extract text -> analyze resume -> show preview -> checkout -> verify payment -> show full report -> download PDF.

No human intervention should be required.

## What Not To Add In V1

- Login
- User dashboard
- Subscription billing
- Admin panel
- Manual review
- Manual report writing
- Complex database model
- Background job system unless required

## Error Handling Standards

The UI must never spin forever.

Show clear user-facing messages for:

- PDF extraction failed
- AI service unavailable
- Polar not configured
- Payment not verified
- Report not found

Development logs may include technical details. User-facing errors should be clear but not scary.

## Environment Variables

Required or supported:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `POLAR_ACCESS_TOKEN`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_STANDARD_PRODUCT_ID`
- `POLAR_FULL_PRODUCT_ID`
- `NEXT_PUBLIC_APP_URL`

Local development may also use:

- `HTTP_PROXY`
- `HTTPS_PROXY`
- `ALL_PROXY`

Never print API keys or secrets in logs.

## Polar Principles

- Create Polar Checkout server-side with the exact selected product ID.
- Verify the signed `order.paid` webhook and exact Polar product before granting plan access.
- Do not expose Standard or Full report content before the matching successful payment.
- If Polar variables are missing, show a clear developer error.
- Keep one-time purchase simple before adding upgrades.

## Data Storage

Use the configured KV REST store in local and production environments so report behavior matches Vercel.

Before public launch on Vercel, add persistent storage for report/payment state. Keep it simple:

- Vercel KV
- Upstash Redis
- Supabase
- Neon

Do not add a full user account model until needed.

## Performance And Cost Control

- Use real OpenAI analysis for end-to-end launch testing.
- Avoid repeated AI calls for the same upload.
- Keep prompts structured.
- Keep reports concise and useful.
- Add timeouts for external API calls.
- Prefer small deterministic checks before GPT.

## Code Organization

Future engines should live under a modular structure such as:

```text
lib/engines/resume/
lib/engines/website/
lib/engines/linkedin/
lib/engines/pitch-deck/
lib/engines/startup-idea/
```

Pages should call engine APIs, not contain engine logic directly.

## Verification Checklist

Before considering a development task complete:

- Run typecheck or build when practical.
- Confirm the main flow still works.
- Confirm no infinite loading state exists.
- Confirm user-facing errors are readable.
- Confirm secrets are not printed.
- Confirm the change does not add unnecessary scope.
