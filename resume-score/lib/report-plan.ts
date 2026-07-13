export const reportPlans = ["free", "standard", "full"] as const;

export type ReportPlan = (typeof reportPlans)[number];
export type PaidReportPlan = Exclude<ReportPlan, "free">;

export type ReportPlanConfig = {
  key: ReportPlan;
  displayName: string;
  priceLabel: string;
  entitlement: ReportPlan;
  ctaLabel: string;
  uploadHeading: string;
  uploadCtaLabel: string;
  uploadSupport: string;
  priceEnvironmentVariable?: "PADDLE_STANDARD_PRICE_ID" | "PADDLE_FULL_PRICE_ID";
  features: readonly string[];
};

export const reportPlanConfig: Record<ReportPlan, ReportPlanConfig> = {
  free: {
    key: "free",
    displayName: "Free Preview",
    priceLabel: "FREE",
    entitlement: "free",
    ctaLabel: "Start Free",
    uploadHeading: "Start your free resume analysis",
    uploadCtaLabel: "Analyze My Resume — Free",
    uploadSupport: "Upload your existing resume as PDF or DOCX for an AI-powered recruiter-style analysis. No payment is required for your free preview.",
    features: ["AI-estimated preview", "Resume score", "ATS score", "Interview readiness", "Top 3 issues"]
  },
  standard: {
    key: "standard",
    displayName: "Standard Report",
    priceLabel: "$4.99",
    entitlement: "standard",
    ctaLabel: "Get Standard Report",
    uploadHeading: "Upload your resume to unlock your Standard Report",
    uploadCtaLabel: "Unlock Standard Report — $4.99",
    uploadSupport: "Upload your existing resume for an AI-powered recruiter-style analysis, then securely unlock your Standard Report.",
    priceEnvironmentVariable: "PADDLE_STANDARD_PRICE_ID",
    features: ["Everything in Free Preview", "Recruiter-style analysis", "Five priority improvements", "Improvement examples", "Downloadable Standard PDF report"]
  },
  full: {
    key: "full",
    displayName: "Full Report",
    priceLabel: "$9.99",
    entitlement: "full",
    ctaLabel: "Get Full Report",
    uploadHeading: "Upload your resume to unlock your Full Report",
    uploadCtaLabel: "Unlock Full Report — $9.99",
    uploadSupport: "Upload your existing resume for an AI-powered recruiter-style analysis, then securely unlock your Full Report.",
    priceEnvironmentVariable: "PADDLE_FULL_PRICE_ID",
    features: ["Everything in Standard Report", "Target-role match analysis", "Missing keyword analysis", "Professional summary improvement suggestions", "Action plan and Full PDF report"]
  }
} as const;

// Kept for existing components while all plan data is now sourced from reportPlanConfig.
export const reportPlanDetails = {
  free: { label: reportPlanConfig.free.displayName, priceLabel: "$0", ctaLabel: "Analyze My Resume - Free" },
  standard: { label: reportPlanConfig.standard.displayName, priceLabel: reportPlanConfig.standard.priceLabel, ctaLabel: "Unlock Standard Report - $4.99" },
  full: { label: reportPlanConfig.full.displayName, priceLabel: reportPlanConfig.full.priceLabel, ctaLabel: "Unlock Full Report - $9.99" }
} as const;

export function isReportPlan(value: unknown): value is ReportPlan {
  return typeof value === "string" && reportPlans.includes(value as ReportPlan);
}

export function getRequestedReportPlan(value: unknown): ReportPlan {
  return isReportPlan(value) ? value : "free";
}

export function isPaidReportPlan(value: unknown): value is PaidReportPlan {
  return value === "standard" || value === "full";
}

export function hasPlanAccess(accessPlan: ReportPlan | undefined, requiredPlan: ReportPlan) {
  const level: Record<ReportPlan, number> = { free: 0, standard: 1, full: 2 };
  return level[accessPlan || "free"] >= level[requiredPlan];
}

export function shouldApplyPurchasedPlan(currentPlan: ReportPlan | undefined, purchasedPlan: PaidReportPlan) {
  return !hasPlanAccess(currentPlan, purchasedPlan);
}

export function getPdfReportTitle(accessPlan: ReportPlan) {
  return accessPlan === "full" ? "Full Recruiter Mind Report" : "Standard Recruiter Mind Report";
}

export function getConfiguredPaddlePriceId(plan: PaidReportPlan) {
  if (plan === "full") return process.env.PADDLE_FULL_PRICE_ID || "";
  return process.env.PADDLE_STANDARD_PRICE_ID || "";
}

export function getPaddlePlanForPriceId(priceId: string | undefined): PaidReportPlan | null {
  if (!priceId) return null;
  if (priceId === getConfiguredPaddlePriceId("full")) return "full";
  if (priceId === getConfiguredPaddlePriceId("standard")) return "standard";
  return null;
}

export function getMissingPaddlePriceConfig() {
  const missing: string[] = [];
  if (!getConfiguredPaddlePriceId("standard")) missing.push("PADDLE_STANDARD_PRICE_ID");
  if (!getConfiguredPaddlePriceId("full")) missing.push("PADDLE_FULL_PRICE_ID");
  return missing;
}
