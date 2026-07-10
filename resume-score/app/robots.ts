import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/report/", "/preview/", "/success"]
    },
    sitemap: "https://www.resunexx.com/sitemap.xml"
  };
}
