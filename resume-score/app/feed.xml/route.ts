import { resumeResourceArticles } from "@/lib/resume-resources";
import { absoluteUrl, siteDescription, siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const publishedAt = "Sat, 25 Jul 2026 00:00:00 GMT";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] || character);
}

export function GET() {
  const items = resumeResourceArticles
    .map((article) => {
      const url = absoluteUrl(`/resume-resources/${article.slug}`);
      return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(article.description)}</description><category>${escapeXml(article.category)}</category><pubDate>${publishedAt}</pubDate></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>ResuNexx Resume Resources</title><link>${siteUrl}</link><description>${escapeXml(siteDescription)}</description><language>en</language><lastBuildDate>${publishedAt}</lastBuildDate>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
