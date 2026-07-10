import type { MetadataRoute } from "next";

const baseUrl = "https://www.resunexx.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/pricing", "/upload", "/terms", "/privacy", "/refund", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7
  }));
}
