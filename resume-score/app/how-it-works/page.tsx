import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how ResuNexx turns an existing PDF or DOCX resume into AI-generated recruiter-style feedback and practical next steps.",
  alternates: { canonical: "/how-it-works" },
  openGraph: { url: absoluteUrl("/how-it-works") }
};

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbJsonLd label="How It Works" path="/how-it-works" />
      <LegalPage eyebrow="How it works" title="A clearer read on your existing resume.">
        <LegalSection title="1. Upload your existing resume">
          <p>Upload a text-based PDF or DOCX. ResuNexx analyzes the resume you already have; it does not create a resume for you.</p>
        </LegalSection>
        <LegalSection title="2. Get a FREE Resume Signal Check">
          <p>See your Resume Score, ATS readiness, recruiter first impression, what recruiters may notice, what they may miss, and three focused improvement priorities.</p>
        </LegalSection>
        <LegalSection title="3. Choose the depth you need">
          <p>Upgrade to PRO for a recruiter-style analysis and downloadable report, or ELITE for role-focused insights and a stronger final application checklist.</p>
        </LegalSection>
        <LegalSection title="Designed for early-career applicants">
          <p>ResuNexx is for students, recent graduates, first-job seekers, and professionals with roughly 0-5 years of experience who want clearer feedback before applying again.</p>
        </LegalSection>
        <Link href="/upload?plan=free" className="inline-flex min-h-11 items-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Start your FREE check</Link>
      </LegalPage>
    </>
  );
}
