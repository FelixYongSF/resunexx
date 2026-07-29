import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Resume Score Check",
  description: "Get a free AI-estimated resume score, ATS readiness score, recruiter first impression, and practical improvement priorities.",
  alternates: { canonical: "/resume-score" },
  openGraph: { url: absoluteUrl("/resume-score") }
};

export default function ResumeScorePage() {
  return (
    <>
      <BreadcrumbJsonLd label="Free Resume Score Check" path="/resume-score" />
      <LegalPage eyebrow="Free resume score" title="See the signals your resume is sending.">
        <LegalSection title="What the free resume check includes">
          <p>Your FREE Resume Signal Check includes an AI-estimated Resume Score, ATS readiness score, recruiter first impression, what recruiters may notice, what they may miss, and three priority improvements.</p>
        </LegalSection>
        <LegalSection title="Can it help with ATS?"><p>Yes. ResuNexx evaluates whether essential resume information and role-relevant signals are likely to be easy for applicant tracking systems and recruiters to find. It does not guarantee ATS outcomes.</p></LegalSection>
        <LegalSection title="Who is it for?"><p>It is designed for entry-level and early-career applicants who want to understand how their existing resume may read before sending more applications.</p></LegalSection>
        <LegalSection title="What happens next?"><p>You can act on the free priorities immediately, or choose PRO or ELITE for more detailed analysis, improvement examples, and a downloadable PDF report.</p></LegalSection>
        <Link href="/upload?plan=free" className="inline-flex min-h-11 items-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Check my resume for free</Link>
      </LegalPage>
    </>
  );
}
