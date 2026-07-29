import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { LegalPage } from "@/components/legal-page";
import { resourceArticles } from "@/lib/resources";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Resume Intelligence Library",
  description: "Practical guides to recruiter signals, ATS alignment, resume clarity, measurable achievements, role alignment, and interview readiness.",
  alternates: { canonical: "/resources" },
  openGraph: { url: absoluteUrl("/resources") }
};

export default function ResourcesPage() {
  return (
    <>
      <BreadcrumbJsonLd label="Resume Intelligence Library" path="/resources" />
      <LegalPage eyebrow="Resources" title="Resume Intelligence Library.">
        <p className="max-w-2xl text-base leading-7 text-white/75">
          Practical guides for understanding what gets noticed, what gets ignored, and what to fix first in an existing resume.
        </p>
        <section aria-labelledby="library-guides" className="mt-8 grid gap-4 sm:grid-cols-2">
          <h2 id="library-guides" className="sr-only">Resume evaluation guides</h2>
          {resourceArticles.map((article, index) => (
            <article key={article.slug} className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-[#d7ff4f]/70">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7ff4f]">Guide {String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-4 text-xl font-semibold leading-tight text-[#f3f0e9]">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">{article.description}</p>
              <Link href={`/resources/${article.slug}`} className="mt-6 inline-flex text-xs font-bold uppercase tracking-[0.08em] text-[#d7ff4f] hover:text-[#f3f0e9]">Read the guide <span className="ml-2">↗</span></Link>
            </article>
          ))}
        </section>
        <div className="mt-10 border-t border-white/15 pt-8">
          <h2 className="text-2xl font-semibold text-[#f3f0e9]">Ready to see your own signals?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Run a FREE Resume Signal Check to see your AI-estimated score, ATS readiness, recruiter first impression, and what to fix first.</p>
          <Link href="/upload?plan=free" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Run the Free Resume Signal Check</Link>
        </div>
      </LegalPage>
    </>
  );
}
