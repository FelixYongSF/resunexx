"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const messages = [
  "Reading your experience...",
  "Checking whether your strengths are easy to spot...",
  "Looking for ATS and recruiter attention signals...",
  "Finding the few changes that could make the biggest difference..."
];

export default function AnalyzingPage() {
  return (
    <Suspense fallback={<AnalyzingScreen message={messages[0]} />}>
      <AnalyzingPageContent />
    </Suspense>
  );
}

function AnalyzingPageContent() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("report_id");
  const selectedPlan = searchParams.get("plan") === "full" ? "full" : searchParams.get("plan") === "standard" ? "standard" : "free";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!reportId) {
      router.replace(`/upload?plan=${selectedPlan}`);
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();
    const timeoutMs = 130_000;

    const recover = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}`, { cache: "no-store" });
        const data = (await response.json()) as { analysisStatus?: "processing" | "completed" | "failed"; error?: string };
        if (cancelled) return;

        if (response.ok && data.analysisStatus === "completed") {
          router.replace(`/preview/${reportId}?plan=${selectedPlan}`);
          return;
        }

        if (response.status === 422 || data.analysisStatus === "failed") {
          const error = data.error || "We couldn't analyze your resume right now. Please try again.";
          router.replace(`/upload?plan=${selectedPlan}&error=${encodeURIComponent(error)}`);
          return;
        }

        if (Date.now() - startedAt >= timeoutMs) {
          router.replace(`/upload?plan=${selectedPlan}&error=${encodeURIComponent("We couldn't complete the analysis in time. Please try again.")}`);
        }
      } catch {
        if (!cancelled && Date.now() - startedAt >= timeoutMs) {
          router.replace(`/upload?plan=${selectedPlan}&error=${encodeURIComponent("We couldn't check your analysis status. Please try again.")}`);
        }
      }
    };

    void recover();
    const interval = window.setInterval(() => void recover(), 1_500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [reportId, router, selectedPlan]);

  return <AnalyzingScreen message={messages[index]} />;
}

function AnalyzingScreen({ message }: { message: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-white">
      <section className="max-w-md text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        <p className="mt-8 text-sm font-semibold text-blue-200">Recruiter-style review in progress</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Building your Resume Signal Check.</h1>
        <p className="mt-4 min-h-12 text-sm leading-6 text-white/70">{message}</p>
      </section>
    </main>
  );
}
