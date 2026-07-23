import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, productName } from "@/lib/site";

export default function RefundPage() {
  return (
    <LegalPage eyebrow="Refund policy" title="Refunds and billing help.">
      <LegalSection title="Digital report purchase">
        <p>
          A PRO or ELITE Resume Intelligence report is delivered digitally after payment. Because access is provided immediately after successful payment, completed purchases are generally final.
        </p>
      </LegalSection>

      <LegalSection title="When we review refunds">
        <p>
          We will review refund requests when a duplicate charge occurred, payment succeeded but the report could not be accessed, or a technical issue prevented delivery of the paid report.
        </p>
      </LegalSection>

      <LegalSection title="How to request help">
        <p>
          Email <a className="font-semibold text-[#d7ff4f] hover:text-[#f3f0e9]" href={`mailto:${contactEmail}`}>{contactEmail}</a> within 7 days of purchase. Include the email address used at checkout and a short description of the issue.
        </p>
      </LegalSection>

      <LegalSection title="No outcome guarantee">
        <p>
          Refunds are not provided because a resume does not lead to interviews or job offers. {productName} provides AI-generated feedback and cannot guarantee hiring outcomes.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
