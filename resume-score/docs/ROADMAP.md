# ScoreLab Roadmap Operating Document

## Company Principle

Think Big. Build Small. Learn Fast.

The roadmap should stay focused on learning from real user behavior, not building a large platform before demand is proven.

## Phase 1: Resume MVP

Goal:

Prove that early-career job seekers will upload a resume, trust the preview, and pay $4.99 for a focused improvement plan.

Scope:

- Landing page
- Resume upload
- PDF text extraction
- Mock mode
- OpenAI analysis
- Free preview
- Paddle Checkout
- Payment verification
- Full improvement plan
- PDF download

Do not add:

- Login
- Dashboard
- Subscriptions
- Admin panel
- Manual review

## Phase 2: Conversion And Trust

Goal:

Improve upload, preview, and paid conversion.

Work:

- Refine landing page copy
- Improve mobile experience
- Improve preview page clarity
- Add stronger trust and disclaimer language
- Improve report readability
- Add analytics events
- Test price and CTA copy

Key questions:

- Do users understand the product in five seconds?
- Do they upload a resume?
- Do they trust the free preview?
- Does $4.99 feel worth it?

## Phase 3: Production Readiness

Goal:

Make the product reliable enough for public traffic.

Work:

- Add persistent report/payment storage
- Add basic rate limiting
- Add upload limits
- Add production Paddle webhook verification
- Add robust AI output validation
- Add better PDF generation
- Add monitoring and error logging
- Add privacy and terms pages

Keep the product account-free unless required.

## Phase 4: Target Match

Goal:

Help users improve a resume for a specific job posting.

Offer:

Target Match at $14.99-$19.99.

Flow:

Upload resume -> paste job description -> get match score -> unlock target-specific improvement plan.

Core value:

Show what to change before applying to a specific role.

## Phase 5: Interview Kit

Goal:

Help users prepare after they improve their resume.

Offer:

Interview Kit at $29.99-$39.99.

Inputs:

- Resume
- Target role
- Optional job description

Outputs:

- Likely questions
- Strong answer angles
- Resume-based talking points
- Weak spots to prepare
- Practice plan

## Phase 6: ScoreLab Engine Platform

Goal:

Turn ScoreLab into a reusable decision platform.

Possible engines:

- Resume Engine
- Website Engine
- LinkedIn Engine
- Pitch Deck Engine
- Startup Idea Engine
- Job Match Engine
- Interview Kit Engine

Each engine should help users understand what to improve next.

## Current Priorities

1. Complete the resume MVP flow.
2. Add Paddle sandbox keys and verify checkout.
3. Confirm PDF download quality.
4. Configure OpenAI billing and test real analysis.
5. Add production storage before public launch.
6. Add analytics before paid traffic.

## Decision Rule

Before adding a feature, ask:

- Does this help prove demand?
- Does this reduce user uncertainty?
- Does this improve conversion or trust?
- Can this be built smaller?
- Can this wait until after real user feedback?

If the answer is unclear, do not build it yet.
