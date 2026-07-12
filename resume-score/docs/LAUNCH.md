# ScoreLab Launch Checklist

ScoreLab's minimum sellable loop is:

Landing page -> resume upload -> text extraction -> Resume Engine analysis -> free preview -> Paddle Checkout -> payment verification -> full report -> PDF download.

This document is intentionally practical. It covers only the launch-critical setup.

## Required Environment Variables

Use `.env.local` for local development and Vercel Project Settings for deployment.

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

PADDLE_API_KEY=
PADDLE_CLIENT_TOKEN=
PADDLE_WEBHOOK_SECRET=
PADDLE_STANDARD_PRICE_ID=
PADDLE_FULL_PRICE_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000

KV_REST_API_URL=
KV_REST_API_TOKEN=
```

Optional local proxy variables can be used when Node.js cannot reach OpenAI directly:

```bash
HTTPS_PROXY=
HTTP_PROXY=
ALL_PROXY=
```

## OpenAI Real Mode

Resume analysis now uses the real OpenAI API through the server-side Resume Engine.

Expected behavior:

- Missing `OPENAI_API_KEY` returns a clear AI configuration error.
- OpenAI quota or billing errors are shown clearly to the user.
- Network timeouts return: `Unable to connect to AI service. Please try again later.`
- API keys are never exposed to the browser.

## Paddle Checkout

Use Paddle Checkout for the one-time $4.99 Standard Report and $9.99 Full Report.

Required setup:

- `PADDLE_API_KEY`: server-side Paddle API key.
- `PADDLE_CLIENT_TOKEN`: client-side Paddle token for Paddle.js.
- `PADDLE_WEBHOOK_SECRET`: Paddle notification destination secret.
- `PADDLE_STANDARD_PRICE_ID`: price ID for the $4.99 Standard Report.
- `PADDLE_FULL_PRICE_ID`: price ID for the $9.99 Full Report.
- `NEXT_PUBLIC_APP_URL`: local or deployed app URL.

The API key controls environment:

- Sandbox keys beginning with `pdl_sdbx_` use Paddle sandbox.
- Live keys beginning with `pdl_live_` use Paddle production.

Checkout opens from the existing preview page CTA. The user flow remains:

```text
Preview -> selected plan checkout -> Paddle verification -> Standard or Full Report
```

## Payment Verification

Production should rely on the Paddle webhook:

```text
POST /api/paddle/webhook
```

The webhook listens for:

- `transaction.completed`
- `transaction.paid`

When Paddle sends a paid transaction with `custom_data.reportId`, ScoreLab marks the matching report as paid.

Local fallback:

- The `/success` page can verify a Paddle transaction server-side when a `transaction_id` is present.
- If the webhook arrives first, the success page redirects to the unlocked report.
- If Paddle has accepted checkout but the webhook has not arrived, the user sees a clear pending confirmation state.

## Report Persistence

Local and production environments require the configured KV REST store. There is no process-local storage fallback.

For Vercel or any production deployment, configure:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Stored report records include:

- `reportId`
- file name
- creation and update timestamps
- resume text hash
- short text preview for debugging
- analysis JSON
- preview and paid report data through the same analysis object
- payment status
- analysis mode
- Paddle transaction ID after payment

Raw resume files are not stored.

Production checkout is blocked if a report was generated in non-production analysis mode. This prevents accidentally charging a real customer for a non-production report.

## Locked and Unlocked States

Before payment, users can access only:

- Overall score
- ATS score
- Interview readiness level
- Top 3 issues

Before payment, these are locked:

- Full report page
- Detailed scoring
- Rewrite examples
- Action plan
- PDF download

After payment verification, the report is marked paid and the user can access:

- Full report
- PDF download

## Vercel Deployment Notes

Build settings:

```text
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
Install Command: use Vercel default
```

Required Vercel environment variables:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
PADDLE_API_KEY=
PADDLE_CLIENT_TOKEN=
PADDLE_WEBHOOK_SECRET=
PADDLE_STANDARD_PRICE_ID=
PADDLE_FULL_PRICE_ID=
NEXT_PUBLIC_APP_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

Deployment steps:

1. Add all required env vars in Vercel Project Settings.
2. Set `NEXT_PUBLIC_APP_URL` to the deployed production URL.
3. Confirm Paddle account verification is approved before using live Paddle credentials.
4. Add a Paddle notification destination for the deployed `NEXT_PUBLIC_APP_URL`:

```text
<NEXT_PUBLIC_APP_URL>/api/paddle/webhook
```

5. Copy the Paddle webhook secret into `PADDLE_WEBHOOK_SECRET`.
6. Configure KV/Upstash REST variables before accepting real customers.
7. Keep Paddle in sandbox until one full test transaction works.
8. Switch to live Paddle credentials only after sandbox checkout, webhook unlock, full report, and PDF download all work.

## Final Launch Checklist

1. Paddle account verification approved.
2. Paddle Standard and Full products/prices created.
3. One-time prices created for `$4.99 USD` and `$9.99 USD`.
4. `PADDLE_STANDARD_PRICE_ID` and `PADDLE_FULL_PRICE_ID` copied from those prices.
5. `PADDLE_API_KEY` configured for the correct environment.
6. `PADDLE_CLIENT_TOKEN` configured for the same environment.
7. Paddle notification destination configured at `<NEXT_PUBLIC_APP_URL>/api/paddle/webhook`.
8. Paddle events enabled: `transaction.completed`, `transaction.paid`.
9. `PADDLE_WEBHOOK_SECRET` copied from that notification destination.
10. `OPENAI_API_KEY` configured and OpenAI billing/quota confirmed.
11. `KV_REST_API_URL` and `KV_REST_API_TOKEN` configured.
12. Vercel build succeeds with `next build`.
13. Sandbox flow verified: upload -> analysis -> preview -> Paddle checkout -> success -> full report -> PDF.
14. Live Paddle credentials deployed.
15. One small live payment tested and refunded if appropriate.
16. First real customer traffic can begin.

## Current Launch Status Format

Use this format after each launch sprint:

- `Working`: implemented and verified locally or by build/typecheck.
- `Needs configuration`: code exists but requires real environment keys or external dashboard setup.
- `Not implemented`: intentionally not built in this sprint.

Do not add login, dashboard, subscriptions, analytics, email delivery, or live Paddle payments until the sandbox commercial loop is stable.
