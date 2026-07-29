import MockupV35Page from "./mockup-v3-5/page";
import type { Metadata } from "next";
import { AnalyticsPageView } from "@/components/analytics-page-view";

export const metadata: Metadata = {
  title: "AI Resume Analysis & Feedback",
  description: "Upload your existing resume for a free AI-estimated Resume Signal Check with ATS readiness and recruiter-style feedback.",
  alternates: { canonical: "/" }
};

export default function HomePage() {
  return (
    <>
      <AnalyticsPageView event="landing_page_visit" />
      <MockupV35Page />
    </>
  );
}
