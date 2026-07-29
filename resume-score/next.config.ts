import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/download/[id]": [
      "./assets/fonts/*.ttf",
      "./node_modules/@sparticuz/chromium/bin/**"
    ]
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
