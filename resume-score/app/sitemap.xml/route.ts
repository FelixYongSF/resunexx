import { publicSeoUrls } from "@/lib/seo-indexing";

export const dynamic = "force-dynamic";

const sitemapNamespace = "http://www.sitemaps.org/schemas/sitemap/0.9";

export function GET() {
  const urls = publicSeoUrls
    .map((url) => `    <url><loc>${escapeXml(url)}</loc></url>`)
    .join("\n");

  const body = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="${sitemapNamespace}">`,
    urls,
    `</urlset>`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
