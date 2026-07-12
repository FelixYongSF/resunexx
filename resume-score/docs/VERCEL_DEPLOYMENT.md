# ResuNexx Vercel Deployment Checklist

This checklist deploys the current product without changing its UI, customer flow, pricing, or business logic.

## Build Configuration

- Framework preset: Next.js
- Root directory: `resume-score`
- Install command: Vercel default
- Build command: `npm run build`
- Output directory: leave blank (Vercel detects `.next`)
- Node.js runtime: Node.js 22.x
- Analysis function duration: 90 seconds

## Required Production Environment Variables

Configure these for the Production environment in Vercel:

```text
OPENAI_API_KEY
OPENAI_MODEL
PADDLE_API_KEY
PADDLE_CLIENT_TOKEN
PADDLE_WEBHOOK_SECRET
PADDLE_STANDARD_PRICE_ID
PADDLE_FULL_PRICE_ID
NEXT_PUBLIC_APP_URL
KV_REST_API_URL
KV_REST_API_TOKEN
```

Recommended values and rules:

- `OPENAI_MODEL`: `gpt-4o-mini`
- `NEXT_PUBLIC_APP_URL`: the canonical deployed URL, with no trailing slash
- Paddle API key, client token, webhook secret, and price ID must all belong to the same Paddle environment.
- Do not configure `HTTP_PROXY`, `HTTPS_PROXY`, or `ALL_PROXY` on Vercel. They are only needed for local development behind Anticloud.
- Never expose `OPENAI_API_KEY`, `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`, or KV credentials through `NEXT_PUBLIC_` variables.

## Persistent Storage

Production checkout is intentionally blocked unless both variables are configured:

```text
KV_REST_API_URL
KV_REST_API_TOKEN
```

Connect an Upstash Redis database through Vercel Marketplace or provide compatible Upstash REST credentials. This preserves the report across serverless invocations and the Paddle redirect/webhook.

## Paddle Configuration

1. Create the `ResuNexx Standard Report` and `ResuNexx Full Report` products, or two prices beneath one product.
2. Create one-time `$4.99 USD` and `$9.99 USD` prices.
3. Add their IDs as `PADDLE_STANDARD_PRICE_ID` and `PADDLE_FULL_PRICE_ID`.
4. Create a notification destination:

```text
https://YOUR_DOMAIN/api/paddle/webhook
```

5. Enable `transaction.completed` and `transaction.paid`.
6. Add the destination secret as `PADDLE_WEBHOOK_SECRET`.
7. Use sandbox credentials for the first deployed test, then replace all four Paddle values together with live credentials.

## Upload Limit

Vercel Functions enforce a 4.5 MB request or response payload limit. Although local validation currently allows files up to 10 MB, production uploads larger than approximately 4.5 MB will be rejected by Vercel before the application route runs.

For the current deployment, test with PDF or DOCX resumes below 4 MB. Supporting larger files later requires direct-to-storage uploads and is outside this launch deployment.

## Deployment Sequence

1. Push the project to its Git repository.
2. Import the repository into Vercel and select `resume-score` as the root directory if the repository root is its parent folder.
3. Add every required production environment variable.
4. Connect Upstash Redis and confirm both KV variables are present.
5. Deploy.
6. Set `NEXT_PUBLIC_APP_URL` to the final Vercel or custom-domain URL and redeploy if the URL changed.
7. Configure the Paddle webhook using the final URL.
8. Run the complete sandbox flow:

```text
Upload -> extraction -> OpenAI analysis -> preview -> Paddle Checkout
-> webhook/payment verification -> full report -> PDF download
```

9. Inspect Vercel Function logs for `/api/analyze` and `/api/paddle/webhook`.
10. Replace sandbox Paddle credentials with live credentials only after the sandbox flow succeeds.

## Launch Gate

- [ ] Production build passes
- [ ] TypeScript check passes
- [ ] OpenAI billing and production key are active
- [ ] Upstash REST storage is connected
- [ ] Paddle account is approved
- [ ] Paddle Standard `$4.99` and Full `$9.99` prices exist
- [ ] Paddle credentials all use the same environment
- [ ] Paddle webhook is configured on the final domain
- [ ] `NEXT_PUBLIC_APP_URL` matches the final domain
- [ ] Sandbox purchase unlocks the matching report
- [ ] Paid PDF download succeeds
- [ ] Live Paddle credentials are installed
- [ ] One live purchase and refund are verified
