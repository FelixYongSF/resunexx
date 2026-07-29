import { resourceArticles } from "@/lib/resources";
import { resumeResourceArticles } from "@/lib/resume-resources";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export const publicSeoPaths = [
  "",
  "/how-it-works",
  "/resume-score",
  "/pricing",
  "/faq",
  "/resources",
  "/resume-resources",
  "/terms",
  "/privacy",
  "/refund",
  "/contact",
  ...resourceArticles.map(({ slug }) => `/resources/${slug}`),
  ...resumeResourceArticles.map(({ slug }) => `/resume-resources/${slug}`)
] as const;

export const publicSeoUrls = publicSeoPaths.map((path) => absoluteUrl(path));

export function indexNowKeyLocation() {
  return `${siteUrl}/indexnow-key.txt`;
}
