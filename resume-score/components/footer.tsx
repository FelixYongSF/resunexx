import Link from "next/link";
import { contactEmail, productName } from "@/lib/site";

const links = [
  ["Pricing", "/pricing"],
  ["Terms", "/terms"],
  ["Privacy", "/privacy"],
  ["Refund", "/refund"],
  ["Contact", "/contact"]
];

type FooterProps = {
  global?: boolean;
  showDisclaimer?: boolean;
};

export function Footer({ global = false, showDisclaimer = true }: FooterProps) {
  return (
    <footer data-site-footer={global ? "global" : undefined} className="border-t border-white/10 bg-[#151515]">
      <div className="nexx-shell flex flex-col gap-6 py-9 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-[#f3f0e9]">{productName}</p>
          <p className="mt-1">AI-powered resume analysis and feedback for early-career job seekers.</p>
          {showDisclaimer ? (
            <p className="mt-2 max-w-md text-xs leading-5">
              AI feedback only. No resume creation, recruitment services, or outcome guarantees.
            </p>
          ) : null}
          <a className="mt-2 inline-flex transition-colors hover:text-[#d7ff4f]" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="font-medium text-[#f3f0e9] transition-colors hover:text-[#d7ff4f]">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
