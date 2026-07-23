"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function PaymentSuccessStatus({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("Your payment is being confirmed. This normally takes a few seconds.");

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setMessage("Payment is still being confirmed. Your report will unlock as soon as verification arrives.");
    }, 45_000);

    const poll = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}`, { cache: "no-store" });
        const data = await response.json() as { paid?: boolean; paymentStatus?: string; analysisStatus?: string; error?: string };
        if ((data.paid || data.paymentStatus === "paid") && data.analysisStatus === "completed") {
          router.replace(`/report/${reportId}`);
        }
        if (data.analysisStatus === "failed") {
          setMessage(data.error || "Your payment was verified, but we couldn't generate the report yet. Please contact support with your payment confirmation.");
        }
      } catch {
        // Keep polling; a transient network failure should not discard the completed report.
      }
    };

    void poll();
    const interval = window.setInterval(() => void poll(), 2_000);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [reportId, router]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <section className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Payment received.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <Link href={`/preview/${reportId}`} className="nexx-button-primary mt-6">Back to preview</Link>
      </section>
    </main>
  );
}
