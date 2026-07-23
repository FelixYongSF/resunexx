import Link from "next/link";
import { redirect } from "next/navigation";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, productName } from "@/lib/site";
import { reportPlanConfig } from "@/lib/report-plan";

export default async function PricingPage({
  searchParams
}: {
  searchParams: Promise<{ report_id?: string }>;
}) {
  const { report_id: reportId } = await searchParams;
  if (reportId && /^[0-9a-f-]{36}$/i.test(reportId)) redirect(`/preview/${reportId}`);

  return (
    <LegalPage eyebrow="Pricing" title="Choose the right level of Resume Intelligence.">
      <LegalSection title="FREE — Resume Signal Check">
        <p>
          Discover what&apos;s holding your resume back. Upload your existing resume for a FREE Resume Signal Check with a Resume Score, Recruiter First Impression, what recruiters notice, what they miss, and your top 3 priority improvements.
        </p>
      </LegalSection>

      <LegalSection title="PRO — Resume Intelligence Report">
        <p>
          Know exactly how to improve it. The PRO Resume Intelligence Report costs <strong className="text-[#f3f0e9]">$4.99 USD</strong> as a one-time purchase.
        </p>
        <p>
          It includes detailed Resume Intelligence analysis, section-by-section review, a priority improvement roadmap, resume keyword insights, professional improvement examples, and a downloadable PRO PDF report.
        </p>
      </LegalSection>

      <LegalSection title="ELITE — Resume Intelligence Engine">
        <p>
          See what your stronger resume could look like. The ELITE Resume Intelligence Engine costs <strong className="text-[#f3f0e9]">$9.99 USD</strong> as a separate one-time premium purchase.
        </p>
        <p>
          It includes everything in PRO plus target-role optimization, a professional summary draft, achievement statement drafts, recruiter-ready content suggestions, job-match insights, a high-impact resume blueprint, and a premium ELITE PDF report. You remain responsible for verifying and personalizing every draft before using it.
        </p>
      </LegalSection>

      <LegalSection title="Payment provider">
        <p>
          Payments are processed by Polar. {productName} does not store full card details.
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          Contact <a className="font-semibold text-[#d7ff4f] hover:text-[#f3f0e9]" href={`mailto:${contactEmail}`}>{contactEmail}</a> with billing or product questions.
        </p>
      </LegalSection>

      <section className="grid gap-4 sm:grid-cols-3">
        {(["free", "standard", "full"] as const).map((plan) => {
          const details = reportPlanConfig[plan];
          return (
            <article key={plan} className="rounded-2xl border border-white/15 bg-[#f3f0e9] p-5 text-[#151515]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#625c52]">{details.displayName}</p>
              <p className="mt-1 text-sm font-semibold text-[#171714]">{details.productName}</p>
              <p className="mt-2 text-2xl font-semibold text-[#171714]">{details.priceLabel}</p>
              <p className="mt-1 text-xs text-[#625c52]">{details.positioning}</p>
              <ul className="mt-4 grid gap-2 text-xs leading-5 text-[#625c52]">
                {details.features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
              <Link href={`/upload?plan=${plan}`} className="mt-5 flex min-h-11 w-full items-center justify-center rounded-md bg-[#151515] px-4 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#f3f0e9] transition hover:bg-[#7e9700]">
                {details.ctaLabel}
              </Link>
            </article>
          );
        })}
      </section>
    </LegalPage>
  );
}
