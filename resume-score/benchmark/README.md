# ResuNexx Resume Benchmark

## Purpose

This directory is the permanent quality benchmark for Resume Engine releases.
It prevents scoring and writing changes from being judged through isolated examples.

The dataset is synthetic and contains no names, emails, phone numbers, addresses,
LinkedIn URLs, or real candidate records.

## Dataset

`dataset.mjs` contains 30 English early-career resumes across:

- graduates
- software engineering
- product management
- marketing
- sales
- finance
- operations
- product design
- customer success
- cross-functional business roles

Every core role family contains strong, medium, and weak controls. Each record includes
its expected tier, target role, source type, privacy status, and generated resume text.

## Run

Run against a deployed ResuNexx environment:

```bash
BENCHMARK_BASE_URL=https://your-resunexx-deployment.example pnpm benchmark
```

If the Node.js runtime requires a local proxy:

```bash
HTTPS_PROXY=http://127.0.0.1:7890 BENCHMARK_BASE_URL=https://your-resunexx-deployment.example pnpm benchmark
```

Useful options:

```bash
pnpm benchmark -- --base-url=https://example.com --limit=3
pnpm benchmark -- --base-url=https://example.com --baseline=baselines/current.json
pnpm benchmark -- --base-url=https://example.com --update-baseline
pnpm benchmark -- --base-url=https://example.com --strict
```

The benchmark uses the real upload and analysis flow. It therefore consumes OpenAI API
usage and writes reports to the configured production report store.

## Outputs

Each run creates:

- `benchmark/results/latest.json`
- `benchmark/results/latest.md`
- a timestamped JSON result

Generated results are local artifacts and are not committed. A reviewed result can be
promoted to `benchmark/baselines/current.json` with `--update-baseline`.

## Quality Gate

The automated gate checks:

- all analyses succeed
- strong average score exceeds medium
- medium average score exceeds weak
- strong-to-weak separation is at least 15 points
- top issues do not repeat the same topic
- at least 80% of issues contain a concrete action

Human review should additionally assess:

- factual grounding
- recruiter realism
- emotional tone
- recommendation specificity
- improvement-suggestion truthfulness
- paid-report perceived value

The benchmark measures product quality, not actual hiring probability. Scores must never
be represented as guarantees of interviews or employment outcomes.
