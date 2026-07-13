"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackClientEvent } from "@/lib/analytics";
import { getRequestedReportPlan, reportPlanConfig, type ReportPlan } from "@/lib/report-plan";

type ResumeUploadFormProps = {
  compact?: boolean;
  theme?: "default" | "dark";
};

const maxFileSize = 4 * 1024 * 1024;
const allowedMimeTypesByExtension: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

export function ResumeUploadForm({ compact, theme = "default" }: ResumeUploadFormProps) {
  const router = useRouter();
  const isDark = theme === "dark";
  const [selectedPlan, setSelectedPlan] = useState<ReportPlan>("free");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) setError(errorParam);
    setSelectedPlan(getRequestedReportPlan(params.get("plan")));
  }, []);

  const selectedPlanDetails = reportPlanConfig[selectedPlan];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please choose a PDF or DOCX resume.");
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    trackClientEvent({
      event: "upload_started",
      source: compact ? "home_upload_form" : "upload_page",
      metadata: {
        fileType: file.type || "unknown",
        fileSize: file.size
      }
    });
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("selectedPlan", selectedPlan);

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 115_000);

      router.push(`/analyzing?plan=${selectedPlan}`);
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
      router.push(`/preview/${data.id}?plan=${selectedPlan}`);
    } catch (err) {
      setIsUploading(false);
      const message =
        err instanceof DOMException && err.name === "AbortError"
          ? "We couldn't analyze your resume right now. Please try again."
          : err instanceof Error
            ? err.message
            : "We couldn't analyze your resume right now. Please try again.";
      setError(message);
      router.push(`/upload?plan=${selectedPlan}&error=${encodeURIComponent(message)}`);
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
          <p className={isDark ? "text-sm font-semibold text-[#f3f0e9]" : "text-sm font-semibold text-[#171714]"}>Start with your resume</p>
          <p className={isDark ? "mt-1 text-sm text-white/60" : "mt-1 text-sm text-[#706b61]"}>Upload your resume as PDF or DOCX.</p>
        </div>
        <div className="text-right">
          <span className={isDark ? "rounded-full bg-[#d7ff4f] px-3 py-1 text-xs font-semibold text-[#151515]" : "rounded-full bg-[#eef8de] px-3 py-1 text-xs font-semibold text-[#36521f]"}>
            {selectedPlanDetails.displayName} — {selectedPlan === "free" ? "$0" : selectedPlanDetails.priceLabel}
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

      {file ? <p className={isDark ? "mt-3 text-sm text-white/70" : "mt-3 text-sm text-[#706b61]"}>Selected: {file.name}</p> : null}
      {error ? <p className="nexx-error mt-4">{error}</p> : null}

      <button
        disabled={isUploading}
        className={isDark
          ? "group mt-5 flex min-h-12 w-full items-center justify-center rounded-md bg-[#d7ff4f] py-3.5 text-sm font-semibold text-[#151515] transition hover:bg-[#f3f0e9] disabled:cursor-not-allowed disabled:opacity-60"
          : "nexx-button-primary mt-5 w-full py-3.5 shadow-[0_16px_36px_rgba(20,20,18,0.18)]"}
      >
        {isUploading ? "Reading your resume..." : <><span>Analyze My Resume - Free</span>{isDark ? <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span> : null}</>}
      </button>
    </form>
  );
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
