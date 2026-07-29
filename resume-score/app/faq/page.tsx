import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { JsonLd } from "@/components/json-ld";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { absoluteUrl } from "@/lib/seo";

const faqs = [
  ["What is ResuNexx?", "ResuNexx is an AI resume analysis and feedback platform. It reviews an existing resume and provides AI-generated recruiter-style insights, ATS readiness signals, and improvement recommendations."],
  ["Who is ResuNexx for?", "It is designed for university students, recent graduates, first-job seekers, and early-career professionals who want clearer feedback before applying."],
  ["What does the free resume check include?", "The free check includes a Resume Score, ATS readiness score, recruiter first impression, what recruiters may notice, what they may miss, and three priority improvements."],
  ["What does the PRO report include?", "PRO includes a detailed recruiter-style resume analysis, section-by-section feedback, a priority improvement roadmap, keyword insights, improvement examples, and a downloadable PDF report."],
  ["What does the ELITE report include?", "ELITE includes everything in PRO plus target-role insights, keyword coverage feedback, professional summary improvement suggestions, achievement improvement recommendations, and a role-focused final checklist."],
  ["How is ResuNexx different from a generic AI resume writer?", "ResuNexx does not create a resume or promise a job outcome. It analyzes the existing document you upload and explains the signals that may be clear, missing, or easy to improve."],
  ["Can ResuNexx help with ATS?", "It can help you understand ATS readability and role-relevant keyword signals. It does not guarantee that a resume will pass a specific applicant tracking system."],
  ["Does ResuNexx guarantee interviews or job offers?", "No. ResuNexx provides AI-generated feedback only. It does not provide recruitment services or guarantee interviews, callbacks, or employment outcomes."]
];

export const metadata: Metadata = {
  title: "Resume Analysis FAQ",
  description: "Answers about ResuNexx AI resume analysis, ATS readiness feedback, FREE checks, PRO reports, and ELITE reports.",
  alternates: { canonical: "/faq" },
  openGraph: { url: absoluteUrl("/faq") }
};

export default function FaqPage() {
  return (
    <>
      <BreadcrumbJsonLd label="FAQ" path="/faq" />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }} />
      <LegalPage eyebrow="FAQ" title="Straight answers before you upload.">
        {faqs.map(([question, answer]) => <LegalSection key={question} title={question}><p>{answer}</p></LegalSection>)}
        <Link href="/upload?plan=free" className="inline-flex min-h-11 items-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Start free</Link>
      </LegalPage>
    </>
  );
}
