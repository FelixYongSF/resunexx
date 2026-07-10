import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import "./globals.css";

const productionUrl = "https://www.resunexx.com";

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: {
    default: "ResuNexx | AI Resume Improvement Plan",
    template: "%s | ResuNexx"
  },
  description:
    "Upload your resume, get an AI-estimated recruiter-style preview, and unlock a focused resume improvement plan with rewrite examples and a PDF report.",
  alternates: {
    canonical: productionUrl
  },
  openGraph: {
    title: "ResuNexx | See what recruiters see",
    description:
      "AI-estimated resume feedback for early-career job seekers. Free preview, $4.99 improvement plan, no signup required.",
    url: productionUrl,
    siteName: "ResuNexx",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "ResuNexx | AI Resume Improvement Plan",
    description: "See your resume through a recruiter-style AI coach before you apply."
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
