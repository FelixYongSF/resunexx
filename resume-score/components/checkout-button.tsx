"use client";

import { useCallback, useState } from "react";
import { trackClientEvent } from "@/lib/analytics";
import { reportPlanConfig } from "@/lib/report-plan";

type CheckoutResponse = { provider?: "polar"; checkoutUrl?: string; checkoutId?: string; error?: string };

export function CheckoutButton({
  reportId,
  plan,
  eliteContextReady = false,
  initialTargetRole = "",
  initialJobDescription = "",
  variant = "primary"
}: {
  reportId: string;
  plan: "standard" | "full";
  eliteContextReady?: boolean;
  initialTargetRole?: string;
  initialJobDescription?: string;
  variant?: "primary" | "link";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCollectingEliteContext, setIsCollectingEliteContext] = useState(false);
  const [isPreparingElite, setIsPreparingElite] = useState(false);
  const [isEliteReady, setIsEliteReady] = useState(eliteContextReady);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [error, setError] = useState("");
  const planDetails = reportPlanConfig[plan];

  async function prepareEliteContext(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!targetRole.trim()) {
      setError("Target Role / Job Title is required for ELITE.");
      return;
    }

    setIsPreparingElite(true);
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 115_000);
      const res = await fetch(`/api/reports/${reportId}/elite-context`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targetRole, jobDescription }),
        signal: controller.signal
      });
      window.clearTimeout(timeout);
      const data = (await readApiResponse(res)) as { ready?: boolean; error?: string };
      if (!res.ok || !data.ready) throw new Error(data.error || "We couldn't prepare the ELITE report.");
      setIsEliteReady(true);
      setIsCollectingEliteContext(false);
      setIsConfirming(true);
    } catch (err) {
      setError(err instanceof DOMException && err.name === "AbortError"
        ? "ELITE preparation took too long. Please try again."
        : err instanceof Error ? err.message : "We couldn't prepare the ELITE report.");
    } finally {
      setIsPreparingElite(false);
    }
  }

  function beginCheckout() {
    setError("");
    if (plan === "full" && !isEliteReady) {
      setIsCollectingEliteContext(true);
      return;
    }
    setIsConfirming(true);
  }

  const startCheckout = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      trackClientEvent({ event: "checkout_clicked", reportId, source: `preview_${plan}_checkout` });
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 25_000);
      const res = await fetch(`/api/checkout?plan=${encodeURIComponent(plan)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reportId, plan }),
        signal: controller.signal
      });
      window.clearTimeout(timeout);
      const data = (await readApiResponse(res)) as CheckoutResponse;
      if (!res.ok) throw new Error(data.error || "Could not start checkout.");
      if (data.provider === "polar" && data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }
      throw new Error("Checkout is temporarily unavailable. Please try again later.");
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "AbortError"
          ? "Payment checkout took too long to open. Please try again."
          : err instanceof Error
            ? err.message
            : "Could not start checkout.";
      setError(message);
      setIsLoading(false);
    }
  }, [plan, reportId]);

  return (
    <div className={variant === "link" ? "inline-block" : "mt-7"}>
      {isCollectingEliteContext ? (
        <form onSubmit={prepareEliteContext} className="rounded-xl border border-[#d8d1c5] bg-[#f6f4ef] p-4 text-left text-sm leading-5 text-slate-700">
          <p className="font-semibold text-slate-950">Tailor ELITE to your next role.</p>
          <label className="mt-3 grid gap-1.5 text-xs font-semibold text-slate-700">
            Target Role / Job Title
            <input
              required
              maxLength={160}
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="e.g. Junior Product Manager"
              className="rounded-lg border border-[#d8d1c5] bg-white px-3 py-2.5 text-sm font-normal text-slate-950 outline-none focus:border-slate-950"
            />
          </label>
          <label className="mt-3 grid gap-1.5 text-xs font-semibold text-slate-700">
            Job Description <span className="font-normal text-slate-500">(optional)</span>
            <textarea
              maxLength={8000}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the role requirements for more specific job-match insights."
              className="min-h-24 resize-y rounded-lg border border-[#d8d1c5] bg-white px-3 py-2.5 text-sm font-normal text-slate-950 outline-none focus:border-slate-950"
            />
          </label>
          <div className="mt-3 flex gap-2">
            <button type="submit" disabled={isPreparingElite} className="nexx-button-primary flex-1 px-3 py-2 text-xs">
              {isPreparingElite ? "Preparing ELITE..." : "Continue"}
            </button>
            <button type="button" onClick={() => setIsCollectingEliteContext(false)} disabled={isPreparingElite} className="nexx-button-secondary px-3 py-2 text-xs">Cancel</button>
          </div>
        </form>
      ) : isConfirming ? (
        <div className="rounded-xl border border-[#d8d1c5] bg-[#f6f4ef] p-4 text-left text-sm leading-5 text-slate-700">
          <p className="font-semibold text-slate-950">Continue to secure checkout for {planDetails.displayName} — {planDetails.productName} ({planDetails.priceLabel}).</p>
          <p className="mt-1">Your completed analysis will be reused and unlock after payment.</p>
          {plan === "full" ? <p className="mt-1 text-xs text-slate-500">ELITE is a separate premium report.</p> : null}
          <div className="mt-3 flex gap-2">
            <button onClick={startCheckout} disabled={isLoading} className="nexx-button-primary flex-1 px-3 py-2 text-xs">
              {isLoading ? "Opening checkout..." : "Continue to checkout"}
            </button>
            <button onClick={() => setIsConfirming(false)} disabled={isLoading} className="nexx-button-secondary px-3 py-2 text-xs">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={beginCheckout}
          className={variant === "link" ? "text-sm font-semibold text-slate-700 underline decoration-slate-400 underline-offset-4 transition hover:text-slate-950" : "nexx-button-primary w-full"}
        >
          {variant === "link" ? "Explore ELITE." : planDetails.ctaLabel}
        </button>
      )}
      {error ? <p className="nexx-error mt-3">{error}</p> : null}
    </div>
  );
}

async function readApiResponse(res: Response) {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { error: "Checkout returned an unexpected response. Please try again." };
  }
}
