import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, paymentProvider, productName } from "@/lib/site";

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Terms" title="Terms of service.">
      <LegalSection title="Service">
        <p>
          {productName} provides automated, AI-generated analysis and resume feedback for early-career job seekers. The service is intended to help users understand how their resume may be read by recruiters and applicant tracking systems.
        </p>
      </LegalSection>

      <LegalSection title="No guarantee">
        <p>
          {productName} does not guarantee interviews, callbacks, job offers, hiring outcomes, or legal/employment results. The report is informational feedback only and is not professional career, legal, or employment advice.
        </p>
      </LegalSection>

      <LegalSection title="User responsibility">
        <p>
          You are responsible for the resume content you upload and for deciding whether to apply any recommendation. Do not upload highly sensitive personal information that is not needed for resume review.
        </p>
      </LegalSection>

      <LegalSection title="Payment">
        <p>
          PRO and ELITE reports are one-time purchases processed by {paymentProvider}. Paid report access is unlocked after successful payment verification.
        </p>
      </LegalSection>

      <LegalSection title="Availability">
        <p>
          We aim to keep the service available, but temporary interruptions may occur due to hosting, payment processing, AI provider, or network issues.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For questions about these terms, contact <a className="font-semibold text-[#d7ff4f] hover:text-[#f3f0e9]" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
