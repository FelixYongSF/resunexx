import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { LegalPage } from "@/components/legal-page";
import { JsonLd } from "@/components/json-ld";
import { getResumeResourceCategory, resumeResourceCategories } from "@/lib/resume-resources";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Resume Resources | Resume, ATS, and Career Guides",
  description: "A practical ResuNexx knowledge center for resume clarity, ATS alignment, recruiter signals, job applications, and interview readiness.",
  alternates: { canonical: "/resume-resources" },
  openGraph: {
    title: "Resume Resources | ResuNexx",
    description: "Practical guides for clearer resumes, ATS alignment, and stronger job applications.",
    url: absoluteUrl("/resume-resources"),
    type: "website",
    images: ["/opengraph-image"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Resources | ResuNexx",
    description: "Practical guides for clearer resumes, ATS alignment, and stronger job applications.",
    images: ["/opengraph-image"]
  }
};

export default function ResumeResourcesPage() {
  return (
    <>
      <BreadcrumbJsonLd label="Resume Resources" path="/resume-resources" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Resume Resources",
          description: metadata.description,
          url: absoluteUrl("/resume-resources"),
          about: ["Resume", "ATS", "Recruiter", "Resume Screening", "Resume Keywords", "Job Application"]
        }}
      />
      <LegalPage eyebrow="Resume Resources" title="A clearer way to prepare your next application.">
        <div className="max-w-3xl">
          <p className="text-base leading-7 text-white/80">
            A structured library for understanding resume signals, ATS alignment, recruiter screening, and the changes worth making first.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Start with a direct answer, use the examples, and then run a free Resume Signal Check on your own document.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {resumeResourceCategories.map((category, categoryIndex) => {
            const articles = getResumeResourceCategory(category);
            return (
              <section key={category} aria-labelledby={`category-${categoryIndex}`}>
                <div className="flex items-end justify-between gap-5 border-b border-white/15 pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d7ff4f]">{String(categoryIndex + 1).padStart(2, "0")}</p>
                    <h2 id={`category-${categoryIndex}`} className="mt-2 text-2xl font-semibold text-[#f3f0e9] sm:text-3xl">{category}</h2>
                  </div>
                  <p className="hidden text-xs uppercase tracking-[0.12em] text-white/45 sm:block">{articles.length} guides</p>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {articles.map((article, articleIndex) => (
                    <article key={article.slug} className="group flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.055] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#d7ff4f]/70 hover:bg-white/[0.08]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{categoryIndex + 1}.{String(articleIndex + 1).padStart(2, "0")}</p>
                      <h3 className="mt-4 text-xl font-semibold leading-tight text-[#f3f0e9]">{article.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-white/65">{article.description}</p>
                      <Link href={`/resume-resources/${article.slug}`} className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] text-[#d7ff4f] transition group-hover:text-[#f3f0e9]">
                        Read the guide <span className="ml-2">↗</span>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-14 border-t border-white/15 pt-9" aria-labelledby="resume-resources-cta">
          <h2 id="resume-resources-cta" className="text-2xl font-semibold text-[#f3f0e9]">Ready to see your own recruiter signals?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Run a free, AI-estimated check to see what gets noticed, what may get missed, and what to fix first.</p>
          <Link href="/upload?plan=free" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Run the Free Resume Signal Check <span className="ml-2">↗</span></Link>
        </section>
      </LegalPage>
    </>
  );
}
