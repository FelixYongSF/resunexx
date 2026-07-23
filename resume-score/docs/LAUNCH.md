# ResuNexx Launch Checklist

## Required production configuration

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

## Payment launch steps

1. Create the Standard one-time Polar product at USD 4.99.
2. Create the Full one-time Polar product at USD 9.99.
3. Set their IDs in `POLAR_STANDARD_PRODUCT_ID` and `POLAR_FULL_PRODUCT_ID`.
4. Add the Polar organization access token and webhook signing secret to Vercel.
5. Configure `https://resunexx.com/api/polar/webhook` for `order.created`, `order.paid`,
   `refund.created`, `refund.updated`, and `order.refunded`.
6. Deploy with the final `NEXT_PUBLIC_APP_URL`.
7. Complete one controlled transaction: upload -> free preview -> Polar Checkout -> verified
   `order.paid` -> report unlock -> PDF download.
8. Confirm a cancelled checkout returns to the same report preview and can be retried.

## Safety rules

- The client never receives the Polar access token or webhook secret.
- A return URL is not payment proof; only a verified `order.paid` webhook unlocks paid access.
- Redis report persistence must be configured before accepting payment in production.
- Refund webhooks revoke paid-report access while preserving the original free preview.
