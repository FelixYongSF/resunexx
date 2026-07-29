import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/download/[id]": ["./assets/fonts/*.ttf", "./assets/chromium/**"]
  },
  async redirects() {
    return [
      { source: "/mockup-v3-1", destination: "/", permanent: false },
      { source: "/mockup-v3-3", destination: "/", permanent: false }
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb"
    }
  }
};

export default nextConfig;
