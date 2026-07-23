# ResuNexx

Automated AI resume analysis and feedback for early-career job seekers.

## Customer flow

1. A visitor uploads an existing resume.
2. ResuNexx extracts the text and creates an AI-generated free preview.
3. The visitor may unlock the Standard ($4.99) or Full ($9.99) report with Polar Checkout.
4. A signed Polar `order.paid` webhook unlocks the matching stored report.
5. The report is shown in the existing report view and can be downloaded as a PDF.

The preview is intentionally generated before payment. Payment unlocks that same stored
analysis, so a customer never needs to upload again or spend a second AI analysis call.

## Local setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Required `.env.local` values:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
POLAR_ACCESS_TOKEN=...
POLAR_WEBHOOK_SECRET=...
POLAR_STANDARD_PRODUCT_ID=...
POLAR_FULL_PRODUCT_ID=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

`HTTPS_PROXY`, `HTTP_PROXY`, and `ALL_PROXY` are optional local settings for networks where
Node.js cannot reach the OpenAI API directly.

## Polar payments

Every paid action uses the internal checkout route:

```text
POST /api/checkout?plan=standard
POST /api/checkout?plan=full
```

The browser sends the completed `reportId`, while the server selects the matching Polar
product ID, creates the checkout, and redirects the customer to Polar. The browser never
receives the Polar access token or webhook secret.

Configure the Polar webhook endpoint as:

```text
https://resunexx.com/api/polar/webhook
```

Enable `order.created`, `order.paid`, and `refund.created`. ResuNexx records the order when
created, unlocks access only after a signed paid event, and revokes paid access on a signed
refund event. Detailed setup is in [setup.md](./setup.md).

## Engine architecture

Resume analysis is handled by the versioned engine in:

```text
lib/engines/resume/resumeEngine.ts
```

The engine remains separate from page components so future document-analysis engines can
reuse the same architecture.

## Vercel deployment

Set these environment variables for Production:

```text
OPENAI_API_KEY
OPENAI_MODEL
POLAR_ACCESS_TOKEN
POLAR_WEBHOOK_SECRET
POLAR_STANDARD_PRODUCT_ID
POLAR_FULL_PRODUCT_ID
NEXT_PUBLIC_APP_URL
KV_REST_API_URL
KV_REST_API_TOKEN
```

Both KV variables are required for reports to persist across serverless functions and the
checkout redirect. Never expose `OPENAI_API_KEY`, `POLAR_ACCESS_TOKEN`,
`POLAR_WEBHOOK_SECRET`, or KV credentials through `NEXT_PUBLIC_` variables.

## Notes

- No login, dashboard, or subscription is required in v1.
- The product analyzes an existing resume; it does not create resumes or guarantee outcomes.
- Paid content and PDF downloads stay locked until verified Polar payment.
