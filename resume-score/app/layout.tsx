import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, pricingOffers, siteDescription, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ResuNexx | AI Resume Analysis & Feedback",
    template: "%s | ResuNexx"
  },
  description: siteDescription,
  alternates: {
    canonical: "/"
  },
  verification: {
    google: "SrcMkcfSm-G-AusOn9SESEs-MKaZvvFLxV9CdSdQGCQ"
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/svg+xml" }],
    shortcut: ["/favicon.ico"]
  },
  openGraph: {
    title: "ResuNexx | See what recruiters see",
    description: siteDescription,
    url: siteUrl,
    siteName: "ResuNexx",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ResuNexx AI Resume Analysis & Feedback" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "ResuNexx | AI Resume Analysis & Feedback",
    description: siteDescription,
    images: ["/opengraph-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "ResuNexx",
                url: siteUrl,
                logo: absoluteUrl("/favicon.ico"),
                email: "support@resunexx.com"
              },
              {
                "@type": "WebSite",
                name: "ResuNexx",
                url: siteUrl,
                description: siteDescription
              },
              {
                "@type": "WebApplication",
                name: "ResuNexx",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url: siteUrl,
                description: siteDescription,
                offers: pricingOffers
              },
              {
                "@type": "Product",
                name: "ResuNexx PRO Resume Intelligence Report",
                description: "A one-time AI-generated recruiter-style resume analysis and improvement report.",
                offers: pricingOffers[1]
              },
              {
                "@type": "Product",
                name: "ResuNexx ELITE Resume Intelligence Report",
                description: "A one-time role-focused AI-generated resume analysis and improvement report.",
                offers: pricingOffers[2]
              }
            ]
          }}
        />
        {children}
        <Footer global />
      </body>
    </html>
  );
}
