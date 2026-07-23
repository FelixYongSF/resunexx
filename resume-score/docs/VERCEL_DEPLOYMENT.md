# Vercel Deployment

## Project settings

- Root Directory: `resume-score`
- Framework Preset: Next.js
- Build Command: `pnpm build`
- Output Directory: leave empty

## Production environment variables

```text
OPENAI_API_KEY
OPENAI_MODEL
POLAR_ACCESS_TOKEN
POLAR_WEBHOOK_SECRET
POLAR_STANDARD_PRODUCT_ID
POLAR_FULL_PRODUCT_ID
NEXT_PUBLIC_APP_URL=https://resunexx.com
KV_REST_API_URL
KV_REST_API_TOKEN
```

Use the same Polar organization for the access token, the two product IDs, and the webhook.
Do not expose server secrets through variables beginning with `NEXT_PUBLIC_`.

## Polar webhook

Configure Polar to send these events to:

```text
https://resunexx.com/api/polar/webhook
```

- `order.created`
- `order.paid`
- `refund.created`

Copy the generated signing secret to `POLAR_WEBHOOK_SECRET`. Production reports are stored in
Upstash Redis so checkout redirects and webhook deliveries can access the same record.

## Deployment verification

1. Confirm the homepage, pricing, upload, preview, report, and legal routes render.
2. Upload a supported PDF or DOCX file and confirm a free preview appears.
3. Start each paid checkout and confirm Polar opens the matching product.
4. Confirm `order.paid` unlocks the report only after the webhook arrives.
5. Download the unlocked PDF report.
