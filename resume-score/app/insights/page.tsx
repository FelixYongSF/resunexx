import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { JsonLd } from "@/components/json-ld";
import { LegalPage } from "@/components/legal-page";
import { getPublishedInsights } from "@/lib/insights";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Career Insights | ResuNexx",
  description: "Practical, evidence-led resume guidance for early-career job seekers, first-job applicants, and career changers.",
  alternates: { canonical: "/insights" },
  openGraph: { type: "website", url: absoluteUrl("/insights"), title: "Career Insights | ResuNexx", description: "Practical, evidence-led resume guidance for job seekers.", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Career Insights | ResuNexx", description: "Practical, evidence-led resume guidance for job seekers.", images: ["/opengraph-image"] }
};

export default function InsightsPage() {
  const articles = getPublishedInsights();

  return (
    <>
      <BreadcrumbJsonLd label="Career Insights" path="/insights" />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "ResuNexx Career Insights", url: absoluteUrl("/insights"), description: metadata.description }} />
      <LegalPage eyebrow="ResuNexx / Career Insights" title="Practical resume guidance, grounded in real evidence.">
        <div className="max-w-3xl">
          <p className="text-base leading-7 text-white/80">Clear, limited guidance for the moments when your resume feels hard to explain: your first job, a career change, or an application that is not getting noticed.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-2xl border border-[#d7ff4f]/30 bg-[#d7ff4f]/[0.08] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#d7ff4f]">Early career</p>
            <h2 className="mt-4 text-xl font-semibold leading-tight text-[#f3f0e9]">You May Be Qualified. So Why Does Your Resume Feel Invisible?</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-white/70">A practical pre-application check for job seekers who want their real experience to be easier to find.</p>
            <Link href="/insights/you-may-be-qualified-resume-feel-invisible" className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] text-[#d7ff4f] transition hover:text-[#f3f0e9]">Read the guide <span className="ml-2">↗</span></Link>
          </article>
          {articles.map((article) => (
            <article key={article.slug} className="group flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.055] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#d7ff4f]/70 hover:bg-white/[0.08]">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{article.audience}</p>
              <h2 className="mt-4 text-xl font-semibold leading-tight text-[#f3f0e9]">{article.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-white/65">{article.description}</p>
              <Link href={`/insights/${article.slug}`} className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] text-[#d7ff4f] transition group-hover:text-[#f3f0e9]">Read the guide <span className="ml-2">↗</span></Link>
            </article>
          ))}
        </div>
      </LegalPage>
    </>
  );
}
