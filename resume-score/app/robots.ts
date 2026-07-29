import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/report/", "/preview/", "/payment/", "/success", "/analyzing", "/upload", "/mockup-"]
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/report/", "/preview/", "/payment/", "/success", "/analyzing", "/upload", "/mockup-"]
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/report/", "/preview/", "/payment/", "/success", "/analyzing", "/upload", "/mockup-"]
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/", "/report/", "/preview/", "/payment/", "/success", "/analyzing", "/upload", "/mockup-"]
      }
    ],
    sitemap: "https://www.resunexx.com/sitemap.xml"
  };
}
