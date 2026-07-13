import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, paymentProvider, productName } from "@/lib/site";
import { reportPlanConfig } from "@/lib/report-plan";

export default function PricingPage() {
  return (
    <LegalPage eyebrow="Pricing" title="Simple resume review pricing.">
      <LegalSection title="Free preview">
        <p>
          {productName} lets you upload a resume and receive a free AI-estimated preview before paying. The free preview includes an overall resume score, ATS readiness score, interview readiness level, and the top 3 issues.
        </p>
      </LegalSection>

      <LegalSection title="Standard Report">
        <p>
          The Standard Report costs <strong className="text-[#171714]">$4.99 USD</strong> as a one-time purchase.
        </p>
        <p>
          It includes recruiter-style feedback, five priority changes, suggested rewrite examples, and a downloadable standard PDF report.
        </p>
      </LegalSection>

      <LegalSection title="Full Report">
        <p>
          The Full Report costs <strong className="text-[#171714]">$9.99 USD</strong> as a one-time purchase.
        </p>
        <p>
          It includes everything in Standard plus target-role match, detailed keyword placement guidance, a factual rewrite toolkit, a 30-minute action plan, and a full PDF report.
        </p>
      </LegalSection>

      <LegalSection title="Payment provider">
        <p>
          Payments are processed by {paymentProvider}. {productName} does not store full card details.
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          Contact <a className="font-semibold text-[#171714]" href={`mailto:${contactEmail}`}>{contactEmail}</a> with billing or product questions.
        </p>
      </LegalSection>

      <section className="grid gap-4 sm:grid-cols-3">
        {(["free", "standard", "full"] as const).map((plan) => {
          const details = reportPlanConfig[plan];
          return (
            <article key={plan} className="rounded-2xl border border-[#e3ddd2] bg-[#f7f4ee] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#625c52]">{details.displayName}</p>
              <p className="mt-2 text-2xl font-semibold text-[#171714]">{details.priceLabel}</p>
              <ul className="mt-4 grid gap-2 text-xs leading-5 text-[#625c52]">
                {details.features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
              <Link href={`/upload?plan=${plan}`} className="nexx-button-primary mt-5 w-full">
                {plan === "free" ? "Start Free" : details.ctaLabel}
              </Link>
            </article>
          );
        })}
      </section>
    </LegalPage>
  );
}
