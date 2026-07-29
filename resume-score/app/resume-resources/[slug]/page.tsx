import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { JsonLd } from "@/components/json-ld";
import { LegalPage } from "@/components/legal-page";
import { getResumeResourceArticle, resumeResourceArticles } from "@/lib/resume-resources";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return resumeResourceArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getResumeResourceArticle(slug);
  if (!article) return {};
  const url = absoluteUrl(`/resume-resources/${article.slug}`);
  return {
    title: `${article.title} | Resume Resources`,
    description: article.description,
    alternates: { canonical: `/resume-resources/${article.slug}` },
    openGraph: { type: "article", url, title: article.title, description: article.description, images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: ["/opengraph-image"] }
  };
}

export default async function ResumeResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getResumeResourceArticle(slug);
  if (!article) notFound();
  const articleUrl = absoluteUrl(`/resume-resources/${article.slug}`);
  const related = article.relatedSlugs.map((relatedSlug) => getResumeResourceArticle(relatedSlug)).filter(Boolean);

  return (
    <>
      <BreadcrumbJsonLd label={article.title} path={`/resume-resources/${article.slug}`} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, articleSection: article.category, mainEntityOfPage: articleUrl, url: articleUrl, datePublished: "2026-07-25", dateModified: "2026-07-25", author: { "@type": "Organization", name: "ResuNexx", url: siteUrl }, publisher: { "@type": "Organization", name: "ResuNexx", url: siteUrl } }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} />
      <LegalPage eyebrow={`${article.category} / Resume Resources`} title={article.title}>
        <article className="max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-[0.1em] text-white/45">
            <Link href="/resume-resources" className="transition hover:text-[#d7ff4f]">Resume Resources</Link>
            <span className="mx-2">/</span>
            <span>{article.category}</span>
          </nav>

          <section className="rounded-2xl border border-[#d7ff4f]/30 bg-[#d7ff4f]/[0.08] p-6 sm:p-8" aria-labelledby="quick-answer">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d7ff4f]">Quick Answer</p>
            <h2 id="quick-answer" className="sr-only">Quick Answer</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#f3f0e9]">{article.quickAnswer}</p>
          </section>

          <div className="mt-12 space-y-12">
            <section aria-labelledby="why-it-matters">
              <h2 id="why-it-matters" className="text-2xl font-semibold text-[#f3f0e9]">Why It Matters</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-white/70">{article.whyItMatters.map((item) => <li key={item} className="flex gap-3"><span className="text-[#d7ff4f]">-</span><span>{item}</span></li>)}</ul>
            </section>

            <section aria-labelledby="step-by-step-guide">
              <h2 id="step-by-step-guide" className="text-2xl font-semibold text-[#f3f0e9]">Step-by-Step Guide</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {article.steps.map((step, index) => (
                  <section key={step.title} className="rounded-2xl border border-white/15 bg-white/[0.055] p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7ff4f]">Step {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-3 text-lg font-semibold text-[#f3f0e9]">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/70">{step.body}</p>
                    {step.bullets ? <ul className="mt-4 grid gap-2 text-sm leading-6 text-white/70">{step.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span className="text-[#d7ff4f]">-</span><span>{bullet}</span></li>)}</ul> : null}
                  </section>
                ))}
              </div>
            </section>

            <section aria-labelledby="real-example">
              <h2 id="real-example" className="text-2xl font-semibold text-[#f3f0e9]">Real Example</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">Before</p><p className="mt-4 text-base leading-7 text-white/75">{article.realExample.before}</p></div>
                <div className="rounded-2xl border border-[#d7ff4f]/35 bg-[#d7ff4f]/[0.09] p-6"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7ff4f]">After</p><p className="mt-4 text-base leading-7 text-[#f3f0e9]">{article.realExample.after}</p></div>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/65">{article.realExample.explanation}</p>
            </section>

            <section aria-labelledby="common-mistakes">
              <h2 id="common-mistakes" className="text-2xl font-semibold text-[#f3f0e9]">Common Mistakes</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-white/70">{article.commonMistakes.map((item) => <li key={item} className="flex gap-3"><span className="text-[#ff7048]">-</span><span>{item}</span></li>)}</ul>
            </section>

            <section aria-labelledby="frequently-asked-questions">
              <h2 id="frequently-asked-questions" className="text-2xl font-semibold text-[#f3f0e9]">Frequently Asked Questions</h2>
              <div className="mt-5 grid gap-6">{article.faqs.map((faq) => <div key={faq.question} className="border-b border-white/15 pb-5"><h3 className="text-base font-semibold text-[#f3f0e9]">{faq.question}</h3><p className="mt-2 text-sm leading-7 text-white/70">{faq.answer}</p></div>)}</div>
            </section>
          </div>

          <section className="mt-14 border-t border-white/15 pt-9" aria-labelledby="improve-with-resunexx">
            <h2 id="improve-with-resunexx" className="text-2xl font-semibold text-[#f3f0e9]">Improve Your Resume with ResuNexx</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">Use these ideas as a practical starting point, then run a free AI Resume Signal Check to see what gets noticed, what may get ignored, and what to fix first.</p>
            <Link href="/upload?plan=free" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Run the Free Resume Signal Check <span className="ml-2">↗</span></Link>
          </section>

          <nav aria-label="Related resume resources" className="mt-12 border-t border-white/15 pt-8">
            <h2 className="text-lg font-semibold text-[#f3f0e9]">Related resources</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">{related.map((item) => item ? <Link key={item.slug} href={`/resume-resources/${item.slug}`} className="rounded-xl border border-white/15 p-4 text-sm leading-5 text-white/70 transition hover:border-[#d7ff4f]/70 hover:text-[#d7ff4f]">{item.title}</Link> : null)}</div>
          </nav>
        </article>
      </LegalPage>
    </>
  );
}
