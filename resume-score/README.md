# Resume Score by ScoreLab

Fully automated AI resume analyzer MVP.

Flow:

1. Visitor uploads a PDF resume.
2. The app extracts resume text.
3. Resume Engine generates a structured JSON report through OpenAI.
4. The user sees a free preview score.
5. The user pays $4.99 through Paddle Checkout.
6. Paddle success/webhook marks the report as paid.
7. The user views and downloads the full report.

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
HTTPS_PROXY=http://127.0.0.1:7890 # optional, use your VPN client's local proxy port
PADDLE_API_KEY=...
PADDLE_CLIENT_TOKEN=...
PADDLE_WEBHOOK_SECRET=...
PADDLE_PRICE_ID=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local proxy for OpenAI

Node.js does not automatically use a browser extension VPN. If the browser can reach OpenAI
but the Next.js server cannot, configure a local HTTP proxy from your VPN client:

```bash
HTTPS_PROXY=http://127.0.0.1:7890
HTTP_PROXY=http://127.0.0.1:7890
```

Replace `7890` with the local HTTP proxy port shown by your VPN client. Common local ports
include `7890`, `1087`, and `6152`. Restart `pnpm dev` after changing `.env.local`.

## Paddle checkout

The checkout route creates a one-time $4.99 payment using Paddle Checkout.

Configure the Paddle notification destination at `/api/paddle/webhook` and copy its
secret into `PADDLE_WEBHOOK_SECRET`.

## Engine architecture

Resume analysis is handled by a versioned engine module:

```text
lib/resumeEngine.ts
lib/engines/resume/resumeEngine.ts
```

The engine exposes `engineName`, `engineVersion`, `scoringCategories`, `analysisPrompt`,
`expectedJsonSchema`, and `analyzeResume(input)`. This keeps the scoring logic separate from
page components and API flow, so future engines can follow the same shape:

- Website Engine
- LinkedIn Engine
- Pitch Deck Engine
- Startup Idea Engine

## Vercel deployment

This MVP is Vercel-ready, but production needs persistent report storage.

Set these environment variables in Vercel:

```bash
OPENAI_API_KEY
OPENAI_MODEL
PADDLE_API_KEY
PADDLE_CLIENT_TOKEN
PADDLE_WEBHOOK_SECRET
PADDLE_PRICE_ID
NEXT_PUBLIC_APP_URL
KV_REST_API_URL
KV_REST_API_TOKEN
```

Both KV variables are required. The app does not fall back to process-local memory storage.

## Notes

- No login system in v1.
- No dashboard in v1.
- No subscription in v1.
- Download is a generated PDF report.
- The full report is locked until Paddle payment is verified.
- Reports are AI-generated and do not guarantee interviews or job offers.
