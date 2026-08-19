import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, productName } from "@/lib/site";

export default function RefundPage() {
  return (
    <LegalPage eyebrow="Refund policy" title="Refunds and billing help.">
      <LegalSection title="Digital report purchase">
        <p>
          A PRO or ELITE Resume Intelligence report is a digital product. Customers may cancel a purchase and request a refund within 14 days of the purchase date, subject to the Paddle Buyer Terms and any non-waivable rights under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="How refunds work">
        <p>
          When a cancellation is valid, the payment provider will process the refund using the original payment method. Access to a paid report may be revoked when a refund is issued. A refund may also be considered when a duplicate charge occurred, payment succeeded but the report could not be accessed, or a technical issue prevented delivery of the paid report.
        </p>
      </LegalSection>

      <LegalSection title="How to request help">
        <p>
          Email <a className="font-semibold text-[#d7ff4f] hover:text-[#f3f0e9]" href={`mailto:${contactEmail}`}>{contactEmail}</a> within 14 days of purchase, or contact Paddle Buyer Support at <a className="font-semibold text-[#d7ff4f] hover:text-[#f3f0e9]" href="https://paddle.net">paddle.net</a>. Include the email address used at checkout, the purchase date, and a short description of the request. Do not send payment card details by email.
        </p>
      </LegalSection>

      <LegalSection title="Chargeback and refund alerts">
        <p>
          Paddle may issue a refund without separately asking us when it receives an alert that a chargeback may be imminent. This helps resolve the payment dispute and does not remove any rights you may have under applicable consumer-protection or payment rules.
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
