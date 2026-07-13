import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import "./globals.css";

const productionUrl = "https://www.resunexx.com";

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: {
    default: "ResuNexx | AI Resume Analysis & Feedback",
    template: "%s | ResuNexx"
  },
  description:
    "Upload your existing resume for AI-powered recruiter-style analysis, ATS readiness insights, and practical improvement recommendations.",
  alternates: {
    canonical: productionUrl
  },
  openGraph: {
    title: "ResuNexx | See what recruiters see",
    description:
      "AI resume analysis and recruiter-style feedback for early-career job seekers. Free preview, clear recommendations, no signup required.",
    url: productionUrl,
    siteName: "ResuNexx",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "ResuNexx | AI Resume Analysis & Feedback",
    description: "Understand how recruiters and ATS systems may read your existing resume before you apply."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <Footer />
      </body>
    </html>
  );
}
