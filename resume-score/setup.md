# Paddle Setup Guide For ScoreLab

This guide prepares ScoreLab for Paddle approval. After Paddle approves the account, no code changes should be required.

## Required Environment Variables

Add these to `.env.local` for local testing and to Vercel Project Settings for deployment:

```bash
PADDLE_API_KEY=
PADDLE_CLIENT_TOKEN=
PADDLE_WEBHOOK_SECRET=
PADDLE_PRICE_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

ScoreLab also needs the existing app variables:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

## OpenAI API Key

Used server-side for real resume analysis.

1. Open the OpenAI API dashboard.
2. Create or copy an API key.
3. Paste it into `OPENAI_API_KEY`.
4. Confirm billing/quota is active before testing paid checkout.

## Where To Find Each Paddle Key

### `PADDLE_API_KEY`

Used server-side to verify transactions.

In Paddle:

1. Open Paddle Dashboard.
2. Go to **Developer tools**.
3. Open **Authentication**.
4. Create or copy an API key.
5. Paste it into `PADDLE_API_KEY`.

Sandbox keys normally begin with `pdl_sdbx_`. Live keys normally begin with `pdl_live_`.

ScoreLab automatically uses Paddle sandbox when the API key starts with `pdl_sdbx_`. Otherwise it uses production.

### `PADDLE_CLIENT_TOKEN`

Used client-side by Paddle.js to open Paddle Checkout.

In Paddle:

1. Open Paddle Dashboard.
2. Go to **Developer tools**.
3. Open **Authentication**.
4. Create or copy a client-side token.
5. Paste it into `PADDLE_CLIENT_TOKEN`.

Use a sandbox client token with a sandbox API key. Use a live client token with a live API key.

### `PADDLE_WEBHOOK_SECRET`

Used by ScoreLab to verify Paddle webhook signatures.

In Paddle:

1. Open Paddle Dashboard.
2. Go to **Developer tools**.
3. Open **Notifications**.
4. Create a notification destination.
5. Set the destination URL:

Use the deployed `NEXT_PUBLIC_APP_URL` followed by `/api/paddle/webhook`.

```text
<NEXT_PUBLIC_APP_URL>/api/paddle/webhook
```

For local testing with a tunnel:

```text
<public tunnel URL>/api/paddle/webhook
```

6. Select transaction events:

```text
transaction.completed
transaction.paid
```

7. Copy the endpoint secret and paste it into `PADDLE_WEBHOOK_SECRET`.

### `PADDLE_PRICE_ID`

Used by Paddle Checkout to sell the full report.

In Paddle:

1. Create a product.
2. Create a one-time price for that product.
3. Copy the price ID.
4. Paste it into `PADDLE_PRICE_ID`.

Price IDs normally look like `pri_...`.

## Create The Product

In Paddle Dashboard:

1. Go to **Catalog**.
2. Open **Products**.
3. Create a product:

```text
Name: Resume Improvement Plan
Description: AI-estimated recruiter-style resume feedback by ScoreLab.
```

4. Save the product.

## Create The Price

In Paddle Dashboard:

1. Open the product you created.
2. Add a price.
3. Configure:

```text
Type: One-time
Currency: USD
Amount: 4.99
Billing period: none / one-time
```

4. Save the price.
5. Copy the price ID into `PADDLE_PRICE_ID`.

The app pricing copy already says `$4.99`. Keep the Paddle price aligned with that copy.

## Configure Webhooks

Create a Paddle notification destination for the deployed app URL:

```text
<NEXT_PUBLIC_APP_URL>/api/paddle/webhook
```

Required events:

```text
transaction.completed
transaction.paid
```

ScoreLab verifies the `Paddle-Signature` header with `PADDLE_WEBHOOK_SECRET`.

When Paddle sends a successful transaction with `custom_data.reportId`, ScoreLab marks the matching report as paid and unlocks:

- Full report page
- PDF download

## Switch From Sandbox To Production

Sandbox:

```bash
PADDLE_API_KEY=pdl_sdbx_...
PADDLE_CLIENT_TOKEN=...
PADDLE_WEBHOOK_SECRET=...
PADDLE_PRICE_ID=pri_sandbox_or_sandbox_created_price
```

Production:

```bash
PADDLE_API_KEY=pdl_live_...
PADDLE_CLIENT_TOKEN=...
PADDLE_WEBHOOK_SECRET=...
PADDLE_PRICE_ID=pri_live_created_price
```

Important:

- Use sandbox API key with sandbox client token, sandbox webhook secret, and sandbox price ID.
- Use live API key with live client token, live webhook secret, and live price ID.
- Update `NEXT_PUBLIC_APP_URL` to the deployed production URL.
- Configure production webhook destination with the production domain.

No code change is needed to switch. ScoreLab detects sandbox vs production from `PADDLE_API_KEY`.

## Test A Successful Payment

1. Set Paddle sandbox variables in `.env.local`.
2. Set:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Confirm `OPENAI_API_KEY` is configured and billing/quota is active.
4. Start the app.
5. Upload a resume.
6. Confirm the free preview appears.
7. Click **Unlock My Improvement Plan — $4.99**.
8. Complete Paddle sandbox checkout.
9. Confirm the app returns to the success page.
10. Confirm the full report unlocks.
11. Click **Download PDF Report** and confirm the PDF downloads.

## Vercel Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
PADDLE_API_KEY=
PADDLE_CLIENT_TOKEN=
PADDLE_WEBHOOK_SECRET=
PADDLE_PRICE_ID=
NEXT_PUBLIC_APP_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

Vercel build settings:

```text
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
Install Command: use Vercel default
```

Before production launch:

1. Confirm OpenAI billing/quota is active.
2. Configure KV/Upstash variables so reports persist after checkout redirects.
3. Run one full sandbox payment test.
4. Switch to live Paddle credentials.
5. Run one small live payment if Paddle allows it, then refund it from Paddle Dashboard.

## Production Safety Checks

ScoreLab blocks checkout in production when:

- Production report storage is not configured.
- Persistent report storage is not configured.
- Paddle credentials are missing.
- The report is already unlocked.

The full report and PDF download remain locked until payment is verified.

## Useful Paddle Docs

- Paddle API authentication: https://developer.paddle.com/api-reference/overview
- Paddle Checkout: https://developer.paddle.com/build/checkout/overview
- Paddle webhooks / notifications: https://developer.paddle.com/webhooks/overview
- Paddle sandbox: https://developer.paddle.com/build/sandbox/overview
