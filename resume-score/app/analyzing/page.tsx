"use client";

import { useEffect, useState } from "react";

const messages = [
  "Reading your experience...",
  "Checking whether your strengths are easy to spot...",
  "Looking for ATS and recruiter attention signals...",
  "Finding the few changes that could make the biggest difference..."
];

export default function AnalyzingPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-white">
      <section className="max-w-md text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        <p className="mt-8 text-sm font-semibold text-blue-200">Recruiter-style review in progress</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Building your free preview.</h1>
        <p className="mt-4 min-h-12 text-sm leading-6 text-white/70">{messages[index]}</p>
      </section>
    </main>
  );
}
