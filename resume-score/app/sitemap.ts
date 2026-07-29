import type { MetadataRoute } from "next";
import { publicSeoPaths, publicSeoUrls } from "@/lib/seo-indexing";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSeoUrls.map((url, index) => {
    const path = publicSeoPaths[index];
    return {
      url,
    changeFrequency: path === "" || path === "/resources" || path === "/resume-resources" ? "weekly" : "monthly",
    priority: path === "" ? 1 : ["/how-it-works", "/resume-score", "/pricing", "/faq"].includes(path) ? 0.8 : 0.6
    };
  });
}
