# Product Development Checklist

This checklist is the reusable operating system for future NEXX AI SaaS products.

Principle: Think Big. Build Small. Learn Fast.

## 1. Product Definition

- Target user: define the exact buyer or user segment. Do not design for everyone.
- Core pain: name the painful moment the user already feels before finding the product.
- First value moment: specify the first screen or output that makes the user think, "This understands my problem."
- Free vs paid logic: define what the free experience proves and what the paid experience unlocks.
- Success metric: choose one primary launch metric, such as paid conversion, completed analyses, or report downloads.
- Trust promise: state what the product will never claim, especially around AI guarantees.
- Minimum sellable result: describe the smallest paid output that a real customer would reasonably value.

## 2. Architecture Checklist

- Frontend: landing, input/upload, loading, preview, checkout handoff, success, premium result, export/download.
- Backend: API route layer, validation, domain engine, payment route, webhook route, report retrieval route.
- Persistence: use production persistence before testing payment unlock. Do not rely on memory storage.
- AI model and prompt architecture: separate extraction, deterministic checks, AI analysis, scoring, and report writing.
- Output schema: use structured JSON and validate required fields before saving.
- Payment: use environment variables only and keep provider code server-side where required.
- Webhook: verify payment before unlocking premium content.
- Storage: save the complete report before checkout so redirect/reload can retrieve it.
- Environment variables: document local, preview, and production values separately.
- Deployment: confirm root directory, framework preset, build command, runtime, and webhook URL.

## 3. Production Readiness Checklist

- Local build passes.
- TypeScript check passes.
- Production deployment succeeds.
- Environment variable names match exactly between code and hosting provider.
- Persistence save/retrieve works across serverless function boundaries.
- External API request works from production runtime.
- Upload, parse, save, retrieve, preview, checkout, unlock, and download are tested as one flow.
- Payment unlock works after redirect and after browser refresh.
- Error messages are user-friendly and logs are safe.
- No secret values are printed in logs or chat.

## 4. AI Product Quality Checklist

- Permanent benchmark dataset exists before repeated quality work begins.
- Benchmark command records scores, timings, failures, and regressions.
- Scoring calibration separates strong, medium, and weak samples.
- Output quality rubric checks warmth, specificity, actionability, personalization, recruiter realism, premium feel, and perceived value.
- Hallucination checks prevent invented employers, metrics, certifications, or outcomes.
- Latency checks record parsing, AI request, processing, and persistence time.
- Paid-value check confirms the premium output is meaningfully more useful than the free preview.
- Report writer is separated from scoring so tone can improve without destabilizing core analysis.

## 5. Founder / Codex Workflow

- Codex handles engineering execution whenever possible.
- Founder handles account access, approvals, secrets, payments, and business decisions.
- Avoid manual UI exploration unless it is required for account setup or payment provider approval.
- Use integrated high-quality prompts instead of fragmented repeated instructions.
- Commit and push production fixes in small, reversible batches.
- Record what was learned in docs before moving to the next product.

## ResuNexx Mistakes To Avoid Repeating

- Do not build payment before production persistence.
- Do not test checkout unlock with memory storage.
- Do not discover environment variable mismatches after deployment.
- Do not manually search for benchmark data every sprint.
- Do not spend Codex credit repeatedly debugging the same deployment class.
- Do not make the paid report longer without making it more useful.
- Do not let AI output sound like a checklist when the product promise is coaching.
