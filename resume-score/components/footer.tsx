import Link from "next/link";
import { contactEmail, productName } from "@/lib/site";

const links = [
  ["Pricing", "/pricing"],
  ["Terms", "/terms"],
  ["Privacy", "/privacy"],
  ["Refund", "/refund"],
  ["Contact", "/contact"]
];

export function Footer() {
  return (
    <footer className="border-t border-[#e3ddd2] bg-[#fbfaf7]">
      <div className="nexx-shell flex flex-col gap-6 py-8 text-sm text-[#625c52] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-[#171714]">{productName}</p>
          <p className="mt-1">AI-estimated resume feedback for early-career job seekers.</p>
          <a className="mt-2 inline-flex hover:text-[#171714]" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-[#171714]">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
