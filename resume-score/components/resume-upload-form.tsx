"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trackClientEvent } from "@/lib/analytics";

type ResumeUploadFormProps = {
  compact?: boolean;
};

const maxFileSize = 4 * 1024 * 1024;
const allowedMimeTypesByExtension: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

export function ResumeUploadForm({ compact }: ResumeUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) setError(errorParam);
  }, []);

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

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 115_000);

      router.push("/analyzing");
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
      router.push(`/preview/${data.id}`);
    } catch (err) {
      setIsUploading(false);
      const message =
        err instanceof DOMException && err.name === "AbortError"
          ? "We couldn't analyze your resume right now. Please try again."
          : err instanceof Error
            ? err.message
            : "We couldn't analyze your resume right now. Please try again.";
      setError(message);
      router.push(`/upload?error=${encodeURIComponent(message)}`);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={[
        "nexx-card animate-editorial-reveal p-5",
        compact ? "sm:p-6" : "sm:p-7"
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#171714]">Start with your resume</p>
          <p className="mt-1 text-sm text-[#706b61]">Upload your resume as PDF or DOCX.</p>
        </div>
        <span className="rounded-full bg-[#eef8de] px-3 py-1 text-xs font-semibold text-[#36521f]">
          Free preview
        </span>
      </div>

      <label className="mt-5 block">
        <span className="sr-only">Resume file</span>
        <input
          className="focus-ring block w-full cursor-pointer rounded-[1.5rem] border border-dashed border-[#cfc7b9] bg-[#faf8f3] px-4 py-7 text-sm text-[#625c52] transition hover:border-[#a89f8f] file:mr-4 file:rounded-full file:border-0 file:bg-[#171714] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </label>
      <p className="mt-3 text-xs leading-5 text-[#817a6e]">
        Text-based PDF or DOCX, up to 4MB.
      </p>

      {file ? <p className="mt-3 text-sm text-[#706b61]">Selected: {file.name}</p> : null}
      {error ? <p className="nexx-error mt-4">{error}</p> : null}

      <button
        disabled={isUploading}
        className="nexx-button-primary mt-5 w-full py-3.5 shadow-[0_16px_36px_rgba(20,20,18,0.18)]"
      >
        {isUploading ? "Reading your resume..." : "Analyze My Resume - Free"}
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
