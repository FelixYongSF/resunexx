# NEXX Design Skill

This document is the reusable design brain for ScoreLab and future NEXX products.

Use it before creating or changing any page, component, flow, or product surface. The goal is not to copy Stripe, Linear, OpenAI, Notion, Vercel, or Raycast. The goal is to consistently ship the same level of clarity, restraint, hierarchy, and trust.

## North Star

NEXX products should feel like premium software that respects the user's attention.

The experience should be:

- Calm, not empty
- Premium, not luxurious
- Clear, not simplistic
- Human, not cute
- Modern, not trendy
- Confident, not loud
- Fast, not rushed

Every screen should make the user think: "I understand what to do next."

## Product Design Principles

1. One screen, one job.
   Each viewport should answer one user question or drive one action. Remove anything that competes with that job.

2. Product before marketing.
   Show the actual product value, result, workflow, or output as early as possible. Avoid generic SaaS feature grids as the main persuasion device.

3. Fewer choices convert better.
   Prefer one primary CTA, one secondary path, and clear next steps. Do not make users evaluate many similar actions.

4. Trust is built in the quiet details.
   Clear pricing, honest limitations, privacy language, loading states, and useful errors are design, not afterthoughts.

5. Warmth without softness.
   The tone should be supportive and direct. Do not shame users. Do not overpromise.

## Visual References

Use these as principle references only:

- Stripe: layout confidence, conversion clarity, elegant information density
- Linear: spacing discipline, product UI credibility, calm hierarchy
- OpenAI: restraint, trust, simplicity, neutral surfaces
- Notion: approachable productivity, readable structure
- Vercel: developer-grade polish, sharp typography, minimal chrome
- Raycast: modern product feel, crisp interaction, refined contrast

Never clone their pages, colors, or component shapes.

## Design Tokens

Use a soft neutral system with one primary accent.

### Color

- Page: warm white or soft gray
- Surface: white
- Surface subtle: warm gray / off-white
- Text primary: near-black neutral
- Text secondary: muted gray-brown or slate
- Border: low-contrast neutral
- Primary accent: one confident blue/indigo
- Success: muted green
- Warning/error: only for true system states

Avoid:

- Multiple competing accent colors
- Heavy gradients
- Purple-blue startup gradients as the default identity
- Loud saturated backgrounds
- Decorative color blobs

### Typography

Typography is the primary visual asset.

- H1: large, confident, short
- H2: memorable, fewer words
- Body: concise, readable, 150 percent line height or better
- Small labels: semibold, muted, never decorative
- Button text: action-oriented and specific

Rules:

- Do not use negative letter spacing.
- Do not scale text with raw viewport width unless clamped.
- Avoid long headlines inside cards.
- Use sentence case unless a product convention requires title case.

### Spacing

Use whitespace as structure.

- Page horizontal padding: 20px mobile, 32px tablet, 48px+ desktop
- Section padding: 64px mobile, 96px desktop
- Card padding: 20px mobile, 28px desktop
- Stack spacing: 12 / 16 / 24 / 32 / 48 / 64
- Keep related items close. Separate decisions with space.

### Radius And Shadows

- Buttons: pill or 14px radius depending on surface
- Cards: 24px to 32px for premium surfaces
- Inner elements: 16px to 24px
- Shadows: soft, large, low opacity
- Borders: subtle and consistent

Do not nest decorative cards inside decorative cards.

## Component Standards

### Buttons

Primary button:

- Dark neutral background
- White text
- Clear verb
- One per decision area
- Hover: small lift or contrast shift
- Focus: visible ring
- Disabled: visibly inactive

Secondary button:

- White or transparent surface
- Border or subtle background
- Used only when it helps the user recover or compare

Never use vague labels like "Submit" when a specific action exists.

### Cards

Cards should represent:

- A real product object
- A result
- A repeated item
- A checkout/decision surface
- A system state

Cards should not exist only because the page needs decoration.

### Forms

Forms must feel safe and easy.

- Label the action, not just the field
- State accepted formats and limits before submission
- Validate obvious problems before network requests
- Show selected file or selected value
- Keep error messages specific and recoverable
- Never leave users wondering whether something is happening

### Icons

Use icons only when they improve scanning.

- Keep icon style consistent
- Use simple line icons
- Pair unfamiliar icons with text
- Do not decorate every card with an icon

### Status And Errors

Every error should answer:

- What happened
- Why it matters
- What the user can do next

Avoid raw technical language for users. Keep detailed logs server-side.

## Interaction And Motion

Motion should feel premium and calm.

Use:

- Fade in
- Gentle slide up
- Soft hover lift
- Subtle scale on clickable surfaces
- Loading message rotation

Avoid:

- Bouncy animation
- Constant moving backgrounds
- Flashy reveal chains
- Motion that delays task completion

Respect reduced-motion preferences when possible.

## Information Flow

Every commercial product page should follow this order unless there is a strong reason not to:

1. What is this?
2. Why should I trust it?
3. What do I get?
4. What does it cost?
5. What happens next?

For transactional flows:

1. Start action
2. Progress state
3. Preview or confirmation
4. Clear upgrade or payment
5. Success state
6. Deliver the paid asset
7. Recovery path if anything fails

## Mobile-First Rules

- The primary CTA must be visible without hunting.
- Text must not overflow cards, buttons, or score surfaces.
- Avoid multi-column dependence for comprehension.
- Make cards stack in the right order.
- Keep tap targets at least 44px tall.
- Do not hide critical trust information on mobile.

## Accessibility

Minimum standards:

- Keyboard focus must be visible.
- Color contrast must pass readable thresholds.
- Inputs need labels or screen-reader labels.
- Buttons must be real buttons or links.
- Error messages must be text, not color alone.
- Avoid content that depends only on hover.
- Respect semantic heading order.

## Copy Style

Write like an experienced mentor, not a marketer.

Use:

- Short sentences
- Direct language
- Honest limitations
- Encouraging next steps
- Specific outcomes

Avoid:

- Hype
- Guarantees
- Corporate jargon
- Shame
- "AI-powered" as a substitute for value

## Product QA Checklist

Before shipping any page:

- Is there one obvious next action?
- Can the user understand the value in five seconds?
- Is the pricing or tradeoff clear?
- Are the empty, loading, error, success, and locked states handled?
- Does the mobile layout preserve the same intent?
- Are all buttons consistent?
- Are all cards serving a real purpose?
- Does the page feel calmer after the change?
- Would this still feel premium without decorative assets?
- Does the interaction increase trust?

## ScoreLab-Specific Application

ScoreLab should feel like:

- A smart recruiter
- A supportive career coach
- A premium AI product

Core positioning:

See your resume through a recruiter's eyes.

For ScoreLab, every flow should move toward:

Upload resume -> free recruiter-style preview -> unlock improvement plan -> download report.

Do not add complexity unless it improves this path.
