import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { JsonLd } from "@/components/json-ld";
import { LegalPage } from "@/components/legal-page";
import { getResourceArticle, resourceArticles } from "@/lib/resources";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return resourceArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/resources/${article.slug}` },
    openGraph: { type: "article", url: absoluteUrl(`/resources/${article.slug}`), title: article.title, description: article.description },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: ["/opengraph-image"] }
  };
}

export default async function ResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) notFound();
  const articleUrl = absoluteUrl(`/resources/${article.slug}`);
  const related = resourceArticles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd label={article.title} path={`/resources/${article.slug}`} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, mainEntityOfPage: articleUrl, url: articleUrl, datePublished: "2026-07-24", dateModified: "2026-07-24", author: { "@type": "Organization", name: "ResuNexx", url: siteUrl }, publisher: { "@type": "Organization", name: "ResuNexx", url: siteUrl } }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} />
      <LegalPage eyebrow="Resume Intelligence Library" title={article.title}>
        <article className="max-w-3xl">
          <p className="text-base leading-7 text-white/85">{article.directAnswer}</p>
          <div className="mt-10 space-y-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold leading-tight text-[#f3f0e9]">{section.heading}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-white/70">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets ? <ul className="grid gap-2 pl-5 text-white/75">{section.bullets.map((bullet) => <li key={bullet} className="list-disc">{bullet}</li>)}</ul> : null}
                  {section.example ? <aside className="rounded-2xl border border-[#d7ff4f]/30 bg-[#d7ff4f]/[0.08] p-5 text-[#f3f0e9]"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7ff4f]">{section.example.label}</p><p className="mt-2 text-sm leading-6">{section.example.text}</p></aside> : null}
                </div>
              </section>
            ))}
            <section>
              <h2 className="text-2xl font-semibold leading-tight text-[#f3f0e9]">Before you apply</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/75">{article.checklist.map((item) => <li key={item} className="flex gap-3"><span className="text-[#d7ff4f]">-</span><span>{item}</span></li>)}</ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold leading-tight text-[#f3f0e9]">Common questions</h2>
              <div className="mt-4 space-y-5">{article.faqs.map((faq) => <div key={faq.question}><h3 className="text-base font-semibold text-[#f3f0e9]">{faq.question}</h3><p className="mt-2 text-sm leading-6 text-white/70">{faq.answer}</p></div>)}</div>
            </section>
          </div>
        </article>
        <section className="mt-10 border-t border-white/15 pt-8">
          <h2 className="text-2xl font-semibold text-[#f3f0e9]">See what recruiters may see in your resume.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Get a FREE Resume Signal Check with an AI-estimated score, ATS readiness signals, and clear next steps.</p>
          <Link href="/upload?plan=free" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Run the Free Resume Signal Check</Link>
        </section>
        <nav aria-label="Related resume guides" className="mt-10 border-t border-white/15 pt-8">
          <h2 className="text-lg font-semibold text-[#f3f0e9]">Related guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">{related.map((item) => <Link key={item.slug} href={`/resources/${item.slug}`} className="rounded-xl border border-white/15 p-4 text-sm leading-5 text-white/75 transition hover:border-[#d7ff4f]/70 hover:text-[#d7ff4f]">{item.title}</Link>)}</div>
        </nav>
      </LegalPage>
    </>
  );
}
