# Nexx Core Event Catalog V1

This is the human-readable companion to the executable ResuNexx catalog in
`packages/contracts/src/event-catalog.ts`.

| Event family | Authority | Safe examples | Explicitly excluded |
|---|---|---|---|
| Public page and CTA | Client or server | page key, CTA key, placement | IP, user agent, free-form referrer URL |
| Upload lifecycle | Server for completion/failure | format, size band, extraction method, failure category | filename, bytes, extracted text, preview |
| Assessment lifecycle | Server | engine version, tier, duration band | prompt, response, score prose, target-job text |
| Checkout/payment | Server or verified webhook | plan, provider, currency, amount minor | email, full provider payload, secrets |
| Report access | Authorized server route | tier, PDF format | report content, user identity |

All events are default-deny. An event is accepted only when its name, version,
source, properties, and references match the registered schema.
