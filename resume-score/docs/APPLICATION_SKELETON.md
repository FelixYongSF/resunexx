# Application Skeleton

This is the reusable AI SaaS skeleton for future NEXX products.

The domain engine changes. The commercial loop should not be rebuilt from zero.

## 1. Core Application Shell

- Landing page: one clear promise, one primary action, clear price and trust signals.
- Upload/input flow: accept the minimum useful input format, validate early, and explain errors clearly.
- API route layer: keep all secrets server-side, validate inputs, time each major step, and return user-safe errors.
- AI processing layer: extraction, deterministic checks, AI analysis, schema validation, normalization, and persistence.
- Report/result page: show the free preview before payment and the premium report after verified unlock.
- Payment lock: never expose premium content before payment verification.
- Premium access: retrieve saved report data after checkout redirect and page refresh.
- PDF/export: generate from saved structured report data, not from client-only state.
- Error handling: every failure should say what happened and what the user can do next.
- Logging: log configuration booleans, timings, step names, and provider status. Never log secrets or full private inputs.

## 2. Infrastructure Layer

- Vercel deployment: set the correct root directory, Next.js framework preset, build command, and production URL.
- GitHub workflow: push every deployable change and keep the hosting provider connected to the correct branch.
- Redis/database persistence: save analysis results before redirecting to any page that must retrieve them later.
- Environment variable strategy: use exact names, document required vs optional values, and verify production runtime detection.
- External API integration: isolate provider client creation and use safe timeout/error handling.
- Payment webhook: verify signatures, handle successful payment events idempotently, and mark the saved report as paid.
- Production diagnostics: expose only safe truth values such as "configured: true/false" and durations.

## 3. AI Engine Layer

- Extraction: convert uploaded/user input into clean text or structured input.
- Analysis: use deterministic checks for facts that should not require AI.
- Scoring: make scoring categories and weights explicit.
- Recommendation engine: connect each recommendation to observed evidence, user impact, and the next action.
- Report writer: turn analysis into premium human-quality communication without changing facts.
- Benchmark runner: analyze a permanent dataset and produce comparable results.
- Quality gate: check pass rate, tier calibration, latency, issue diversity, actionability, and regression changes.

## 4. Reusable Product Pattern

Future products should reuse the same skeleton and replace only the domain-specific engine:

- Resume Analyzer -> Resume Engine
- Contract Analyzer -> Contract Risk Engine
- ESG Analyzer -> Compliance Engine
- Landing Page Analyzer -> Conversion Engine
- Pitch Deck Analyzer -> Investor Readiness Engine

Each engine should expose:

- engine metadata
- rulebook
- deterministic checks
- AI prompt
- output schema
- normalizer
- report writer
- benchmark dataset
- benchmark runner

## 5. Credit Efficiency Rules

- Do not rebuild the shell for every product.
- Do not re-debug deployment, Redis, payment unlock, or PDF export from zero.
- Do not manually search benchmark samples repeatedly.
- Build permanent benchmark datasets once and reuse them.
- Run automated benchmark commands before and after engine changes.
- Use Codex for technical execution and founder time for decisions, account access, and secret entry.
- Document every recurring operational lesson before starting the next sprint.

## 6. Minimum Sellable Loop

Every future AI SaaS MVP should prove this loop before adding features:

1. User lands on the product.
2. User provides input.
3. System validates input.
4. Engine creates a credible free preview.
5. User understands what premium unlocks.
6. User pays.
7. System verifies payment.
8. User receives the premium output.
9. User can export or save the result.
10. The result remains available after refresh or redirect.
