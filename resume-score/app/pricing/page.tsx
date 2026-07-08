import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, paymentProvider, productName } from "@/lib/site";

export default function PricingPage() {
  return (
    <LegalPage eyebrow="Pricing" title="Simple resume review pricing.">
      <LegalSection title="Free preview">
        <p>
          {productName} lets you upload a resume and receive a free AI-estimated preview before paying. The free preview includes an overall resume score, ATS readiness score, interview readiness level, and the top 3 issues.
        </p>
      </LegalSection>

      <LegalSection title="Paid report">
        <p>
          The full Resume Improvement Plan costs <strong className="text-[#171714]">$4.99 USD</strong> as a one-time purchase.
        </p>
        <p>
          After payment, you receive the full AI-generated report, detailed scoring, recruiter-style feedback, prioritized improvement plan, rewrite examples, and a downloadable PDF report.
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
        <Link href="/upload" className="nexx-button-primary mt-2">
          Analyze My Resume - Free
        </Link>
      </LegalSection>
    </LegalPage>
  );
}
