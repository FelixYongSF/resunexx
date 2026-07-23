"use client";

import { useState } from "react";

export function CopyDraftButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyDraft}
      className="rounded-md border border-current px-2.5 py-1 text-xs font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7ff4f] focus-visible:ring-offset-2"
      aria-live="polite"
    >
      {copied ? "Copied." : "COPY DRAFT"}
    </button>
  );
}
