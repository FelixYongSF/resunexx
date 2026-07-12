export const reportPlans = ["free", "standard", "full"] as const;

export type ReportPlan = (typeof reportPlans)[number];
export type PaidReportPlan = Exclude<ReportPlan, "free">;

export const reportPlanDetails = {
  free: {
    label: "Free Preview",
    priceLabel: "$0",
    ctaLabel: "Analyze My Resume - Free"
  },
  standard: {
    label: "Standard Report",
    priceLabel: "$4.99",
    ctaLabel: "Unlock Standard Report - $4.99"
  },
  full: {
    label: "Full Report",
    priceLabel: "$9.99",
    ctaLabel: "Unlock Full Report - $9.99"
  }
} as const;

export function isReportPlan(value: unknown): value is ReportPlan {
  return typeof value === "string" && reportPlans.includes(value as ReportPlan);
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

  // PADDLE_PRICE_ID is a temporary backwards-compatible alias for existing $4.99 deployments.
  return process.env.PADDLE_STANDARD_PRICE_ID || process.env.PADDLE_PRICE_ID || "";
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
