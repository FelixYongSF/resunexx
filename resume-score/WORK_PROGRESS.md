# Work Progress

Updated: 2026-07-08 CST

## Project

ResuNexx - automated AI resume feedback product for early-career job seekers.

Workspace:

```text
/Users/felix/Documents/PP/resume-score
```

Local app:

```text
http://localhost:3000
```

## Current Product Flow

```text
Landing page
-> Resume upload
-> Text extraction
-> Resume Engine analysis
-> Free preview
-> Paddle Checkout
-> Payment verification
-> Full report
-> PDF download
```

No login, dashboard, subscription, admin panel, or manual review has been added.

## Completed Earlier

- Built the Next.js MVP app.
- Built upload, analysis, free preview, paid report gate, full report, and PDF download.
- Built modular Resume Engine under `lib/engines/resume/`.
- Added Resume Engine v1.0.0, v1.1.0 structured rules, and v1.2.0 deterministic prechecks.
- Added PDF, DOC, DOCX, JPG, JPEG, and PNG upload validation.
- Added stable PDF extraction and DOCX XML text extraction.
- Added graceful DOC/image fallback handling.
- Added report persistence abstraction with local in-memory fallback and optional KV/Upstash REST.
- Added production lock so full report and PDF download require verified payment.
- Added core docs:
  - `docs/PRODUCT.md`
  - `docs/DESIGN.md`
  - `docs/ENGINEERING.md`
  - `docs/COPYWRITING.md`
  - `docs/AI_ENGINE.md`
  - `docs/PRICING.md`
  - `docs/ROADMAP.md`
  - `docs/resume-engine-v1.md`
  - `docs/design-skill.md`

## Completed Today

- Replaced Stripe implementation with Paddle.
- Removed Stripe runtime routes, helper, package dependency, and environment variables.
- Added Paddle helper at `lib/paddle.ts`.
- Added Paddle checkout preparation through existing `/api/checkout` route.
- Added Paddle.js overlay checkout in `components/checkout-button.tsx`.
- Added Paddle webhook route:

```text
app/api/paddle/webhook/route.ts
```

- Added Paddle transaction verification on success page.
- Added required Paddle env vars:

```text
PADDLE_API_KEY
PADDLE_CLIENT_TOKEN
PADDLE_WEBHOOK_SECRET
PADDLE_STANDARD_PRICE_ID
PADDLE_FULL_PRICE_ID
```

- Added production checkout guard requiring Paddle config, persistent storage, and non-mock analysis mode.
- Updated `.env.example`.
- Updated `docs/LAUNCH.md` with final Vercel and Paddle launch checklist.
- Added `setup.md` with Paddle product, price, API key, client token, webhook, OpenAI, and Vercel setup steps.
- Created public Paddle approval pages:
  - `/pricing`
  - `/terms`
  - `/privacy`
  - `/refund`
  - `/contact`
- Added footer links to Pricing, Terms, Privacy, Refund, and Contact.
- Added public contact email:

```text
support@resunexx.com
```

- Updated site identity constants in `lib/site.ts`.
- Updated homepage copy to clearly explain:
  - what ResuNexx does
  - who it is for
  - what paid customers receive
  - $4.99 price
  - Paddle as payment provider
  - contact email
- Improved Resume Engine prompt quality so the report reads more like an experienced hiring manager and career coach.
- Added stricter AI report rules:
  - recommendations must be grounded in resume evidence
  - no invented companies, titles, tools, achievements, or metrics
  - no generic AI advice unless paired with a specific edit
  - every major recommendation should explain what was noticed, why recruiters care, and what to change next
  - rewrite examples must stay truthful to the resume
- Improved mock/fallback report language so non-production testing output is less generic.

## Current Environment Notes

Local `.env.local` may still contain older development settings. For launch testing, use:

```text
ALLOW_MOCK_AI=false
OPENAI_API_KEY=<real OpenAI API key>
PADDLE_API_KEY=<Paddle sandbox or live API key>
PADDLE_CLIENT_TOKEN=<matching Paddle client token>
PADDLE_WEBHOOK_SECRET=<matching Paddle webhook secret>
PADDLE_STANDARD_PRICE_ID=<matching Paddle Standard Report price ID>
PADDLE_FULL_PRICE_ID=<matching Paddle Full Report price ID>
NEXT_PUBLIC_APP_URL=<local or deployed app URL>
KV_REST_API_URL=<production storage URL>
KV_REST_API_TOKEN=<production storage token>
```

Do not accept real payments while `ALLOW_MOCK_AI=true`.

## Verified Today

- `tsc --noEmit` passed.
- `next build` passed.
- Build includes all public approval pages:
  - `/pricing`
  - `/terms`
  - `/privacy`
  - `/refund`
  - `/contact`
- Active runtime scan found no Stripe payment implementation.
- Paddle integration has no mock payment path.

## Current Blockers

- Paddle account approval is still required before live payments.
- Paddle product must be created.
- Paddle one-time $4.99 price must be created.
- Paddle env vars must be added.
- Paddle webhook must be configured:

```text
<NEXT_PUBLIC_APP_URL>/api/paddle/webhook
```

- OpenAI billing/quota must be active.
- `ALLOW_MOCK_AI=false` must be used for real launch tests.
- KV/Upstash persistent storage must be configured before real customers.
- One full Paddle sandbox transaction must be tested end to end.
- One small live payment should be tested after Paddle approval and live credentials are deployed.

## Next Steps

1. Wait for Paddle approval.
2. Create Paddle product: `Resume Improvement Plan`.
3. Create Paddle one-time price: `$4.99 USD`.
4. Add Paddle env vars.
5. Configure Paddle webhook events:
   - `transaction.completed`
   - `transaction.paid`
6. Configure KV/Upstash env vars.
7. Confirm OpenAI billing/quota with `ALLOW_MOCK_AI=false`.
8. Run full sandbox payment flow:

```text
upload -> analysis -> preview -> Paddle checkout -> success -> full report -> PDF download
```

9. Deploy to Vercel.
10. Switch to live Paddle credentials.
11. Run one small live payment and refund if needed.
