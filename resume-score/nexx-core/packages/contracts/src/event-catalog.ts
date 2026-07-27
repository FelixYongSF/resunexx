import type { EventSource, SafePropertyValue } from "./types.ts";

type PropertyRule = Readonly<{
  type: "string" | "number" | "boolean" | "nullable_string";
  allowedValues?: readonly string[];
}>;

export type EventDefinition = Readonly<{
  version: 1;
  purpose: string;
  allowedSources: readonly EventSource[];
  allowedProperties: Readonly<Record<string, PropertyRule>>;
}>;

const SIZE_BANDS = ["under_1mb", "1mb_to_4mb", "4mb_to_10mb"] as const;
const REPORT_TIERS = ["free", "standard", "full"] as const;
const SAFE_FAILURE_CATEGORIES = [
  "unsupported_file_type",
  "file_too_large",
  "text_extraction_failed",
  "analysis_unavailable",
  "payment_cancelled",
  "payment_failed"
] as const;

export const RESUNEXX_EVENT_CATALOG: Readonly<Record<string, EventDefinition>> = {
  "page.viewed": {
    version: 1,
    purpose: "Measure public product and content entry points.",
    allowedSources: ["client", "server"],
    allowedProperties: {
      page_key: { type: "string" },
      page_type: { type: "string", allowedValues: ["marketing", "pricing", "resource", "legal"] }
    }
  },
  "cta.clicked": {
    version: 1,
    purpose: "Measure declared product-entry intent.",
    allowedSources: ["client", "server"],
    allowedProperties: {
      cta_key: { type: "string" },
      placement: { type: "string" },
      destination_intent: { type: "string", allowedValues: ["free_upload", "standard_upload", "full_upload", "pricing"] }
    }
  },
  "plan.selected": {
    version: 1,
    purpose: "Measure an explicitly selected product tier.",
    allowedSources: ["client", "server"],
    allowedProperties: { plan: { type: "string", allowedValues: REPORT_TIERS } }
  },
  "artifact_upload.started": {
    version: 1,
    purpose: "Measure an upload attempt without collecting file content or names.",
    allowedSources: ["client", "server"],
    allowedProperties: { artifact_type: { type: "string", allowedValues: ["resume"] } }
  },
  "artifact_upload.completed": {
    version: 1,
    purpose: "Record authoritative upload validation metadata.",
    allowedSources: ["server"],
    allowedProperties: {
      artifact_type: { type: "string", allowedValues: ["resume"] },
      file_format: { type: "string", allowedValues: ["pdf", "docx", "doc", "image"] },
      size_band: { type: "string", allowedValues: SIZE_BANDS },
      extraction_method: { type: "string", allowedValues: ["pdf_parse", "docx_parser", "ocr"] }
    }
  },
  "artifact_upload.failed": {
    version: 1,
    purpose: "Record a privacy-safe upload failure category.",
    allowedSources: ["server"],
    allowedProperties: { failure_category: { type: "string", allowedValues: SAFE_FAILURE_CATEGORIES } }
  },
  "assessment.started": {
    version: 1,
    purpose: "Record the start of an authorized analysis.",
    allowedSources: ["server"],
    allowedProperties: {
      assessment_type: { type: "string", allowedValues: ["resume"] },
      report_tier: { type: "string", allowedValues: REPORT_TIERS },
      engine_version: { type: "string" }
    }
  },
  "assessment.completed": {
    version: 1,
    purpose: "Record analysis completion metadata without report content.",
    allowedSources: ["server"],
    allowedProperties: {
      assessment_type: { type: "string", allowedValues: ["resume"] },
      report_tier: { type: "string", allowedValues: REPORT_TIERS },
      engine_version: { type: "string" },
      duration_band: { type: "string", allowedValues: ["under_15s", "15s_to_60s", "over_60s"] }
    }
  },
  "assessment.failed": {
    version: 1,
    purpose: "Record a privacy-safe analysis failure category.",
    allowedSources: ["server"],
    allowedProperties: { failure_category: { type: "string", allowedValues: SAFE_FAILURE_CATEGORIES } }
  },
  "report.viewed": {
    version: 1,
    purpose: "Measure an authorized report view.",
    allowedSources: ["server"],
    allowedProperties: { report_tier: { type: "string", allowedValues: REPORT_TIERS } }
  },
  "report.downloaded": {
    version: 1,
    purpose: "Measure an authorized report download.",
    allowedSources: ["server"],
    allowedProperties: {
      report_tier: { type: "string", allowedValues: REPORT_TIERS },
      format: { type: "string", allowedValues: ["pdf"] }
    }
  },
  "checkout.requested": {
    version: 1,
    purpose: "Measure a server-validated paid checkout request.",
    allowedSources: ["server"],
    allowedProperties: { plan: { type: "string", allowedValues: ["standard", "full"] } }
  },
  "checkout.created": {
    version: 1,
    purpose: "Record a provider checkout creation without provider payloads.",
    allowedSources: ["server"],
    allowedProperties: {
      plan: { type: "string", allowedValues: ["standard", "full"] },
      provider: { type: "string", allowedValues: ["polar"] }
    }
  },
  "checkout.cancelled": {
    version: 1,
    purpose: "Measure a safe cancelled checkout return.",
    allowedSources: ["server"],
    allowedProperties: { plan: { type: "string", allowedValues: ["standard", "full"] } }
  },
  "payment.completed": {
    version: 1,
    purpose: "Record a verified provider payment fact.",
    allowedSources: ["webhook"],
    allowedProperties: {
      plan: { type: "string", allowedValues: ["standard", "full"] },
      currency: { type: "string", allowedValues: ["usd"] },
      amount_minor: { type: "number" }
    }
  },
  "payment.refunded": {
    version: 1,
    purpose: "Record a verified provider refund fact.",
    allowedSources: ["webhook"],
    allowedProperties: {
      currency: { type: "string", allowedValues: ["usd"] },
      amount_minor: { type: "number" }
    }
  }
};

export function propertyValueMatchesRule(value: SafePropertyValue, rule: PropertyRule): boolean {
  if (rule.type === "string" && typeof value !== "string") return false;
  if (rule.type === "number" && typeof value !== "number") return false;
  if (rule.type === "boolean" && typeof value !== "boolean") return false;
  if (rule.type === "nullable_string" && value !== null && typeof value !== "string") return false;
  return !rule.allowedValues || (typeof value === "string" && rule.allowedValues.includes(value));
}
