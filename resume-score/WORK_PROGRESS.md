# ResuNexx Work Progress

## Current payment state

ResuNexx uses Polar for Standard ($4.99) and Full ($9.99) report checkout.

```text
Upload -> AI analysis -> free preview -> Polar Checkout -> signed order.paid webhook
-> same report unlocks -> PDF download
```

- Checkout is created by `POST /api/checkout` using server-only Polar credentials.
- `app/api/polar/webhook/route.ts` handles `order.created`, `order.paid`, and `refund.created`.
- Report/payment records persist in Redis, so checkout redirects and webhook delivery can run in
  separate Vercel functions.
- Cancelled checkout returns to the original stored preview, allowing a retry without another
  upload or analysis.
- Full reports remain locked until the signed paid-order webhook verifies the matching report
  ID, selected plan, and Polar product ID.

## Required launch configuration

```text
POLAR_ACCESS_TOKEN
POLAR_WEBHOOK_SECRET
POLAR_STANDARD_PRODUCT_ID
POLAR_FULL_PRODUCT_ID
NEXT_PUBLIC_APP_URL=https://resunexx.com
KV_REST_API_URL
KV_REST_API_TOKEN
OPENAI_API_KEY
```

See `setup.md` and `docs/LAUNCH.md` for the exact deployment checklist.
