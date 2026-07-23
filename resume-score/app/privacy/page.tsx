import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, paymentProvider, productName } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacy" title="Privacy policy.">
      <LegalSection title="Information we process">
        <p>
          {productName} processes the resume file you upload, extracted resume text, generated report data, payment status, and basic technical information needed to operate the service.
        </p>
      </LegalSection>

      <LegalSection title="Resume files">
        <p>
          The service is designed for lightweight report generation, not long-term resume file storage. We do not store the original uploaded resume file as a customer dashboard asset.
        </p>
        <p>
          We may store generated report records so paid users can view and download their report after payment.
        </p>
      </LegalSection>

      <LegalSection title="AI processing">
        <p>
          Resume text may be sent to an AI provider to generate the analysis. Do not upload sensitive information that is not needed for resume feedback.
        </p>
      </LegalSection>

      <LegalSection title="Payments">
        <p>
          Payments are processed by {paymentProvider}. {productName} does not store full payment card numbers. Payment status and transaction references may be stored to unlock purchased reports.
        </p>
      </LegalSection>

      <LegalSection title="Data requests">
        <p>
          To ask about your report data or privacy, contact <a className="font-semibold text-[#d7ff4f] hover:text-[#f3f0e9]" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
