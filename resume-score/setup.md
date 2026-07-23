# Polar Setup

ResuNexx uses Polar for one-time Standard ($4.99) and Full ($9.99) report purchases.
Checkout is created server-side and report access is granted only after a signed Polar
`order.paid` webhook is received.

## Environment variables

Add these values to `.env.local` for local development and to the matching Vercel
environment for deployment:

```bash
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_STANDARD_PRODUCT_ID=
POLAR_FULL_PRODUCT_ID=
NEXT_PUBLIC_APP_URL=https://resunexx.com
```

`POLAR_ACCESS_TOKEN` and `POLAR_WEBHOOK_SECRET` are server-only. Do not prefix either
with `NEXT_PUBLIC_` and never place them in client-side code.

## Create the Polar products

1. In Polar, create two one-time products in the same organization.
2. Price the Standard product at `USD 4.99` and the Full product at `USD 9.99`.
3. Set `POLAR_STANDARD_PRODUCT_ID` to `73bf4f74-27df-477c-ad25-e14dbd238e70`.
4. Set `POLAR_FULL_PRODUCT_ID` to `37e6e212-82af-4021-ac34-efd03c3d2e13`.
5. Create an organization access token with checkout access and store it in
   `POLAR_ACCESS_TOKEN`.

The product IDs are checked server-side. A browser-selected plan alone can never
grant paid access.

## Configure the webhook

Create a Polar webhook endpoint at:

```text
https://resunexx.com/api/polar/webhook
```

Subscribe to these events:

- `order.created`
- `order.paid`
- `refund.created`

Copy the webhook signing secret into `POLAR_WEBHOOK_SECRET`. The official Polar Next.js
webhook handler verifies this signature before processing an event.

## Customer flow

1. A resume is analyzed once to create the free preview.
2. The selected paid plan creates a Polar checkout with the report ID in checkout metadata.
3. Polar sends `order.created` to record the pending order.
4. Polar sends signed `order.paid`; ResuNexx validates the product, plan, order status,
   and stored report before unlocking the same report.
5. The success page waits for verified payment, then redirects to the existing report page.
6. `refund.created` revokes paid-report access while keeping the original free preview.

If checkout is cancelled, Polar returns the visitor to the existing report preview through
`/pricing?report_id=...`; the selected report remains stored and checkout can be retried
without another upload or AI analysis.

## Sandbox and production

Set the corresponding Polar access token, product IDs, webhook secret, and
`NEXT_PUBLIC_APP_URL` together for each environment. The application currently initializes
Polar against production; use production credentials and the `https://resunexx.com` URL for
the live launch.

For implementation details, see the official [Polar Next.js integration](https://polar.sh/docs/integrate/sdk/adapters/nextjs)
and [Orders documentation](https://polar.sh/docs/features/orders).
