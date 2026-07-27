# Nexx Core Phase 1 Data Governance

- Environment separation is mandatory. Phase 1 accepts only `development`,
  `test`, and `staging` events; `production` is rejected by the local service.
- Event payloads never carry resumes, filenames, email addresses, target-job
  text, report prose, prompts, responses, secrets, raw IP addresses, or user
  agents.
- Each event has an idempotency key scoped to product and environment.
- Rejections retain only a safe reason code and expiry metadata.
- Core acceptance is asynchronous by design; it is never a dependency of the
  customer upload, checkout, payment, or report delivery flow.
- No AI retrieval, dashboards, metrics, evidence, or knowledge promotion is
  implemented in Phase 1.
