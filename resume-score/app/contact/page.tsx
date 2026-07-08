import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, productName } from "@/lib/site";

export default function ContactPage() {
  return (
    <LegalPage eyebrow="Contact" title="Contact ResuNexx.">
      <LegalSection title="Support email">
        <p>
          For product, billing, refund, privacy, or payment questions, email <a className="font-semibold text-[#171714]" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection title="What to include">
        <p>
          For billing or report access issues, include the email address used at checkout and a brief description of what happened.
        </p>
      </LegalSection>

      <LegalSection title="Product">
        <p>
          {productName} provides AI-estimated resume feedback for university students, recent graduates, first job seekers, and early-career professionals.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
