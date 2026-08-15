import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { JsonLd } from "@/components/json-ld";
import { LegalPage } from "@/components/legal-page";
import { getInsight, isPublishedInsight } from "@/lib/insights";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);

  if (!article || !isPublishedInsight(article)) {
    return {};
  }

  const url = absoluteUrl(`/insights/${article.slug}`);
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: { type: "article", url, title: article.title, description: article.description, images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: ["/opengraph-image"] }
  };
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getInsight(slug);

  if (!article || !isPublishedInsight(article)) {
    notFound();
  }

  const articleUrl = absoluteUrl(`/insights/${article.slug}`);
  const ctaHref = `/upload?plan=free&utm_source=article&utm_medium=referral&utm_campaign=${article.slug}`;

  return (
    <>
      <BreadcrumbJsonLd label={article.title} path={`/insights/${article.slug}`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          mainEntityOfPage: articleUrl,
          url: articleUrl,
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
          author: { "@type": "Organization", name: "ResuNexx", url: siteUrl },
          publisher: { "@type": "Organization", name: "ResuNexx", url: siteUrl }
        }}
      />
      <LegalPage eyebrow={`ResuNexx / Career Guide / ${article.audience}`} title={article.title}>
        <article className="max-w-3xl text-white/75">
          {article.opening.map((paragraph) => <p key={paragraph} className="mt-4 first:mt-0 text-base leading-8 text-white/85">{paragraph}</p>)}

          <div className="mt-12 space-y-10">
            {article.sections.map((section) => {
              const id = section.heading.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");
              return (
                <section key={section.heading} aria-labelledby={id}>
                  <h2 id={id} className="text-2xl font-semibold text-[#f3f0e9]">{section.heading}</h2>
                  <div className="mt-4 space-y-4 leading-7">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.example && (
                      <div className="rounded-2xl border border-[#d7ff4f]/30 bg-[#d7ff4f]/[0.08] p-6 text-[#f3f0e9]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7ff4f]">Illustrative example</p>
                        <blockquote className="mt-4 border-l-2 border-[#d7ff4f] pl-4 leading-7 text-white/80">{section.example.before}</blockquote>
                        <blockquote className="mt-4 border-l-2 border-white/40 pl-4 leading-7">{section.example.after}</blockquote>
                        <p className="mt-4 text-sm leading-6 text-white/70">{section.example.note}</p>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="mt-12 border-t border-white/15 pt-9" aria-labelledby="practical-takeaway">
            <h2 id="practical-takeaway" className="text-2xl font-semibold text-[#f3f0e9]">The practical takeaway</h2>
            <div className="mt-4 space-y-4 leading-7">{article.conclusion.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>

          <section className="mt-12 border-t border-white/15 pt-9" aria-labelledby="article-cta">
            <h2 id="article-cta" className="text-2xl font-semibold text-[#f3f0e9]">Check the signals your resume is sending</h2>
            <p className="mt-3 leading-7 text-white/70">{article.cta}</p>
            <Link href={ctaHref} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Get Your Free ResuNexx Resume Preview <span className="ml-2">↗</span></Link>
          </section>

          <section className="mt-12 border-t border-white/15 pt-9" aria-labelledby="article-sources">
            <h2 id="article-sources" className="text-lg font-semibold text-[#f3f0e9]">Sources</h2>
            <ul className="mt-4 grid gap-2 text-sm leading-6">
              {article.sources.map((source) => <li key={source.href}><a className="text-[#d7ff4f] underline decoration-[#d7ff4f]/40 underline-offset-4 hover:text-[#f3f0e9]" href={source.href} rel="noreferrer">{source.label}</a></li>)}
            </ul>
          </section>
        </article>
      </LegalPage>
    </>
  );
}
