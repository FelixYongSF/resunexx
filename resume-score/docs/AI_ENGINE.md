# ScoreLab AI Engine Operating Document

## AI Engine Goal

ScoreLab engines should combine deterministic rule checks with GPT-based understanding and coaching.

The goal is not to generate long reports. The goal is to help users decide what to improve next.

## Core Principle

Use Rule Engine for deterministic checks.

Use GPT only for:

- Understanding resume content
- Recruiter-style feedback
- Improvement examples
- Coaching tone
- Human explanation
- Prioritizing nuanced improvements

Avoid unnecessary API calls.

## Engine Architecture

Each engine should be versioned and modular.

Example:

```text
lib/engines/resume/resumeEngine.ts
```

Each engine should expose:

- `engineName`
- `engineVersion`
- `scoringCategories`
- `analysisPrompt`
- `expectedJsonSchema`
- `analyzeResume(input)`
- `generateOpenAIReport(input)`

Page components should not hardcode engine logic.

## Resume Engine Positioning

The Resume Engine should produce recruiter-style feedback for early-career job seekers.

It should not optimize for senior executive resumes.

## Resume Engine Scoring Categories

Total score: 100 points.

- ATS Compatibility: 20 points
- Clarity & Structure: 20 points
- Impact & Achievements: 20 points
- Keyword Relevance: 20 points
- Professional Presentation: 20 points

## Required Structured Output

The AI must return structured JSON only.

Required fields:

- `engineVersion`
- `overallScore`
- `atsCompatibilityScore`
- `clarityStructureScore`
- `impactAchievementsScore`
- `keywordRelevanceScore`
- `professionalPresentationScore`
- `interviewReadinessLevel`
- `topIssues`
- `strengths`
- `weaknesses`
- `missingKeywords`
- `sectionFeedback`
- `rewriteExamples`
- `finalActionPlan`
- `recruiterFirstImpression`
- `wouldRecruiterKeepReading`
- `whatStandsOut`
- `whatMayCauseHesitation`
- `fiveMostImportantChanges`
- `whatToFixFirst`
- `whyThisMattersToRecruiters`
- `encouragingClosingNote`

## Report Quality Rules

- Be honest but supportive.
- Do not guarantee interviews.
- Use "may", "can help", and "AI-estimated" where appropriate.
- Prioritize 5 high-impact changes over many low-value suggestions.
- Explain why each issue matters to recruiters.
- Give improvement examples that are realistic for early-career candidates.
- Keep the report action-oriented.

## OpenAI Production Mode

Resume analysis uses the real OpenAI API through the server-side Resume Engine.

OpenAI responses must use the same structured JSON schema expected by the report UI,
Polar checkout flow, full report page, and PDF download.

Local and production testing should use a real `OPENAI_API_KEY` with billing/quota enabled.
If OpenAI is unavailable, return a clear user-facing error instead of generating a fake report.

## Prompting Rules

The prompt should:

- State the target user clearly.
- Ask for JSON only.
- Include the scoring framework.
- Include tone requirements.
- Include disclaimer constraints.
- Ask for fewer, sharper recommendations.
- Avoid claims of guaranteed outcomes.

## Validation Rules

Before showing the report:

- Validate that required fields exist.
- Normalize scores to 0-100.
- Handle malformed AI output gracefully.
- Return a safe, user-friendly error when OpenAI output cannot be used.

## Future Engines

Future engines should reuse the same architecture:

- Website Engine
- LinkedIn Engine
- Pitch Deck Engine
- Startup Idea Engine
- Job Match Engine
- Interview Kit Engine

Each engine should define its own scoring categories, prompt, schema, mock output, and report structure.
