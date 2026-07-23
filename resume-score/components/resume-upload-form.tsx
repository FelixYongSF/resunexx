"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackClientEvent } from "@/lib/analytics";
import { getRequestedReportPlan, reportPlanConfig, type ReportPlan } from "@/lib/report-plan";
import { getUploadSubmissionMode } from "@/lib/payment-flow";

type ResumeUploadFormProps = {
  compact?: boolean;
  theme?: "default" | "dark";
  initialPlan?: ReportPlan;
};

const maxFileSize = 4 * 1024 * 1024;
const allowedMimeTypesByExtension: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

export function ResumeUploadForm({ compact, theme = "default", initialPlan = "free" }: ResumeUploadFormProps) {
  const router = useRouter();
  const isDark = theme === "dark";
  const [selectedPlan, setSelectedPlan] = useState<ReportPlan>(initialPlan);
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pendingReportId, setPendingReportId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) setError(errorParam);
    setSelectedPlan(getRequestedReportPlan(params.get("plan")));
    setPendingReportId(params.get("report_id") || "");
  }, []);

  const selectedPlanDetails = reportPlanConfig[selectedPlan];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const submissionMode = getUploadSubmissionMode(selectedPlan);

    if (!file && !(submissionMode === "prepare_checkout" && pendingReportId)) {
      setError("Please choose a PDF or DOCX resume.");
      return;
    }

    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (selectedPlan === "full" && !targetRole.trim()) {
      setError("Target Role / Job Title is required for ELITE.");
      return;
    }

    const selectedFile = file;

    setIsUploading(true);
    trackClientEvent({
      event: "upload_started",
      source: compact ? "home_upload_form" : "upload_page",
      metadata: {
        fileType: selectedFile?.type || "pending_upload",
        fileSize: selectedFile?.size || 0
      }
    });
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 115_000);

      if (submissionMode === "prepare_checkout") {
        let reportId = pendingReportId;
        if (!reportId || selectedFile) {
          const formData = buildUploadFormData(selectedFile!, selectedPlan, targetRole, jobDescription);
          const pendingResponse = await fetch("/api/pending-report", {
            method: "POST",
            body: formData,
            signal: controller.signal
          });
          const pendingData = await readApiResponse(pendingResponse);
          if (!pendingResponse.ok || !pendingData.id) {
            throw new Error(pendingData.error || "We couldn't prepare secure checkout right now. Please try again.");
          }
          reportId = pendingData.id;
          setPendingReportId(reportId);
          trackClientEvent({
            event: "upload_completed",
            reportId,
            source: compact ? "home_paid_upload" : "paid_upload_page"
          });
        }

        const checkoutResponse = await fetch(`/api/checkout?plan=${encodeURIComponent(selectedPlan)}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reportId, plan: selectedPlan }),
          signal: controller.signal
        });
        window.clearTimeout(timeout);
        const checkoutData = await readApiResponse(checkoutResponse);
        if (!checkoutResponse.ok || !checkoutData.checkoutUrl) {
          throw new Error(checkoutData.error || "We couldn't open secure checkout right now. Please try again.");
        }
        trackClientEvent({ event: "checkout_clicked", reportId, source: `paid_upload_${selectedPlan}_checkout` });
        window.location.assign(checkoutData.checkoutUrl);
        return;
      }

      const formData = buildUploadFormData(selectedFile!, selectedPlan, targetRole, jobDescription, crypto.randomUUID());
      const reportId = formData.get("reportId") as string;

      router.push(`/analyzing?plan=${selectedPlan}&report_id=${reportId}`);
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        signal: controller.signal
      });
      window.clearTimeout(timeout);

      const data = await readApiResponse(res);
      if (!res.ok) {
        const requestId = data.requestId ? ` Reference ID: ${data.requestId}.` : "";
        throw new Error(`${data.error || "We couldn't analyze your resume right now. Please try again."}${requestId}`);
      }

      trackClientEvent({
        event: "upload_completed",
        reportId: data.id,
        source: compact ? "home_upload_form" : "upload_page"
      });
      router.replace(`/preview/${data.id}?plan=${selectedPlan}`);
    } catch (err) {
      setIsUploading(false);
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      const message = err instanceof Error
        ? err.message
        : "We couldn't analyze your resume right now. Please try again.";
      setError(message);
      const pendingQuery = pendingReportId && selectedPlan !== "free" ? `&report_id=${encodeURIComponent(pendingReportId)}` : "";
      router.replace(`/upload?plan=${selectedPlan}${pendingQuery}&error=${encodeURIComponent(message)}`);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={[
        "animate-editorial-reveal p-5",
        isDark
          ? "rounded-[1.25rem] border border-white/15 bg-white/[0.06] text-[#f3f0e9] shadow-[0_22px_60px_rgba(0,0,0,0.22)]"
          : "nexx-card",
        compact ? "sm:p-6" : "sm:p-7"
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={isDark ? "text-sm font-semibold text-[#f3f0e9]" : "text-sm font-semibold text-[#171714]"}>{selectedPlanDetails.uploadHeading}</p>
          <p className={isDark ? "mt-1 text-sm text-white/60" : "mt-1 text-sm text-[#706b61]"}>{selectedPlanDetails.uploadSupport}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className={isDark ? "inline-flex whitespace-nowrap rounded-full bg-[#d7ff4f] px-3 py-1 text-xs font-semibold text-[#151515]" : "inline-flex whitespace-nowrap rounded-full bg-[#eef8de] px-3 py-1 text-xs font-semibold text-[#36521f]"}>
            {selectedPlanDetails.displayName} — {selectedPlan === "free" ? "$0.00" : selectedPlanDetails.priceLabel}
          </span>
          <Link
            href="/#pricing"
            className={isDark ? "mt-2 block text-[11px] text-white/55 underline-offset-4 hover:text-[#d7ff4f] hover:underline" : "mt-2 block text-[11px] text-[#706b61] underline-offset-4 hover:text-[#151515] hover:underline"}
          >
            Change plan
          </Link>
        </div>
      </div>

      <label className={isDark ? "mt-5 block rounded-xl transition focus-within:ring-2 focus-within:ring-[#d7ff4f]/70" : "mt-5 block"}>
        <span className="sr-only">Resume file</span>
        <input
          className={isDark
            ? "block w-full cursor-pointer rounded-xl border border-dashed border-white/30 bg-black/20 px-4 py-7 text-sm text-white/70 transition hover:border-[#d7ff4f] file:mr-4 file:rounded-md file:border-0 file:bg-[#f3f0e9] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#151515]"
            : "focus-ring block w-full cursor-pointer rounded-[1.5rem] border border-dashed border-[#cfc7b9] bg-[#faf8f3] px-4 py-7 text-sm text-[#625c52] transition hover:border-[#a89f8f] file:mr-4 file:rounded-full file:border-0 file:bg-[#171714] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </label>
      <p className={isDark ? "mt-3 text-xs leading-5 text-white/45" : "mt-3 text-xs leading-5 text-[#817a6e]"}>
        Text-based PDF or DOCX, up to 4MB.
      </p>

      {selectedPlan === "full" ? (
        <div className={isDark ? "mt-4 grid gap-3 border-t border-white/10 pt-4" : "mt-4 grid gap-3 border-t border-[#e4dfd5] pt-4"}>
          <label className={isDark ? "grid gap-1.5 text-xs font-semibold text-white/70" : "grid gap-1.5 text-xs font-semibold text-[#625c52]"}>
            Target Role / Job Title
            <input
              required
              value={targetRole}
              maxLength={160}
              onChange={(event) => setTargetRole(event.target.value)}
              className={isDark ? "rounded-lg border border-white/20 bg-black/20 px-3 py-2.5 text-sm font-normal text-white outline-none transition focus:border-[#d7ff4f]" : "rounded-lg border border-[#d8d1c5] bg-white px-3 py-2.5 text-sm font-normal text-[#151515] outline-none transition focus:border-[#8aa500]"}
              placeholder="e.g. Junior Product Manager"
            />
          </label>
          <label className={isDark ? "grid gap-1.5 text-xs font-semibold text-white/70" : "grid gap-1.5 text-xs font-semibold text-[#625c52]"}>
            Job Description <span className="font-normal opacity-70">(optional)</span>
            <textarea
              value={jobDescription}
              maxLength={8000}
              onChange={(event) => setJobDescription(event.target.value)}
              className={isDark ? "min-h-24 resize-y rounded-lg border border-white/20 bg-black/20 px-3 py-2.5 text-sm font-normal text-white outline-none transition focus:border-[#d7ff4f]" : "min-h-24 resize-y rounded-lg border border-[#d8d1c5] bg-white px-3 py-2.5 text-sm font-normal text-[#151515] outline-none transition focus:border-[#8aa500]"}
              placeholder="Paste the role requirements you want the ELITE Report to consider."
            />
          </label>
          <p className={isDark ? "text-xs leading-5 text-white/45" : "text-xs leading-5 text-[#817a6e]"}>Used only to tailor the ELITE Report&apos;s role-match and keyword feedback.</p>
        </div>
      ) : null}

      <div className={isDark ? "mt-4 border-t border-white/10 pt-4" : "mt-4 border-t border-[#e4dfd5] pt-4"}>
        <p className={isDark ? "text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45" : "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#817a6e]"}>
          {selectedPlan === "free" ? "Your FREE Signal Check includes" : `${selectedPlanDetails.displayName} includes`}
        </p>
        <ul className={isDark ? "mt-2 grid gap-1.5 text-xs leading-5 text-white/65 sm:grid-cols-2" : "mt-2 grid gap-1.5 text-xs leading-5 text-[#625c52] sm:grid-cols-2"}>
          {selectedPlanDetails.features.map((feature) => <li key={feature}>• {feature}</li>)}
        </ul>
      </div>

      {file ? <p className={isDark ? "mt-3 text-sm text-white/70" : "mt-3 text-sm text-[#706b61]"}>Selected: {file.name}</p> : null}
      {!file && pendingReportId && selectedPlan !== "free" ? <p className={isDark ? "mt-3 text-sm text-white/70" : "mt-3 text-sm text-[#706b61]"}>Your selected resume is saved for secure checkout.</p> : null}
      {error ? <p className="nexx-error mt-4">{error}</p> : null}

      <button
        disabled={isUploading}
        className={isDark
          ? "group mt-5 flex min-h-12 w-full items-center justify-center rounded-md bg-[#d7ff4f] py-3.5 text-sm font-semibold text-[#151515] transition hover:bg-[#f3f0e9] disabled:cursor-not-allowed disabled:opacity-60"
          : "nexx-button-primary mt-5 w-full py-3.5 shadow-[0_16px_36px_rgba(20,20,18,0.18)]"}
      >
        {isUploading ? (selectedPlan === "free" ? "Reading your resume..." : "Opening secure checkout...") : <><span>{selectedPlanDetails.uploadCtaLabel}</span>{isDark ? <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span> : null}</>}
      </button>
      {selectedPlan !== "free" ? (
        <p className={isDark ? "mt-3 text-center text-xs leading-5 text-white/45" : "mt-3 text-center text-xs leading-5 text-[#817a6e]"}>
          You&apos;ll be redirected to Polar&apos;s secure checkout. Your paid report will be generated only after payment is confirmed.
        </p>
      ) : null}
    </form>
  );
}

function buildUploadFormData(file: File, selectedPlan: ReportPlan, targetRole: string, jobDescription: string, reportId?: string) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("selectedPlan", selectedPlan);
  if (reportId) formData.append("reportId", reportId);
  if (selectedPlan === "full") {
    formData.append("targetRole", targetRole);
    formData.append("jobDescription", jobDescription);
  }
  return formData;
}

function validateFile(file: File) {
  if (file.size > maxFileSize) {
    return "Please upload a resume file smaller than 4MB.";
  }

  const lowerName = file.name.toLowerCase();
  const extension = Object.keys(allowedMimeTypesByExtension).find((candidate) => lowerName.endsWith(candidate));
  const hasMatchingMime = extension ? allowedMimeTypesByExtension[extension] === file.type : false;

  if (!hasMatchingMime) {
    return "Unsupported file type. Please upload a PDF or DOCX resume.";
  }

  return "";
}

async function readApiResponse(res: Response) {
  const text = await res.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: "We couldn't read the server response. Please try again."
    };
  }
}
