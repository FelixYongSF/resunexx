export const reportPlans = ["free", "standard", "full"] as const;

export type ReportPlan = (typeof reportPlans)[number];
export type PaidReportPlan = Exclude<ReportPlan, "free">;

export type ReportPlanConfig = {
  key: ReportPlan;
  displayName: string;
  productName: string;
  positioning: string;
  priceLabel: string;
  entitlement: ReportPlan;
  ctaLabel: string;
  uploadHeading: string;
  uploadCtaLabel: string;
  uploadSupport: string;
  productEnvironmentVariable?: "POLAR_STANDARD_PRODUCT_ID" | "POLAR_FULL_PRODUCT_ID";
  features: readonly string[];
};

export const reportPlanConfig: Record<ReportPlan, ReportPlanConfig> = {
  free: {
    key: "free",
    displayName: "FREE",
    productName: "Resume Signal Check",
    positioning: "Discover what’s holding your resume back.",
    priceLabel: "Free",
    entitlement: "free",
    ctaLabel: "START FREE",
    uploadHeading: "Start your FREE Resume Signal Check",
    uploadCtaLabel: "START FREE",
    uploadSupport: "Upload your existing resume as PDF or DOCX for a recruiter-style Resume Intelligence analysis. No payment is required.",
    features: ["Resume Score", "Recruiter First Impression", "What Recruiters Notice", "What They Miss", "Top 3 Priority Improvements"]
  },
  standard: {
    key: "standard",
    displayName: "PRO",
    productName: "Resume Intelligence Report",
    positioning: "Know exactly how to improve it.",
    priceLabel: "$4.99",
    entitlement: "standard",
    ctaLabel: "UNLOCK MY IMPROVEMENT PLAN — $4.99",
    uploadHeading: "Upload your resume to unlock your PRO Report",
    uploadCtaLabel: "CONTINUE TO SECURE CHECKOUT — $4.99",
    uploadSupport: "Upload your existing resume for Resume Intelligence analysis, then securely unlock your PRO Report.",
    productEnvironmentVariable: "POLAR_STANDARD_PRODUCT_ID",
    features: ["Everything in FREE", "Detailed Resume Intelligence Analysis", "Section-by-section Review", "Priority Improvement Roadmap", "Resume Keyword Insights", "Professional Improvement Examples", "Downloadable PDF Report"]
  },
  full: {
    key: "full",
    displayName: "ELITE",
    productName: "Resume Intelligence Engine",
    positioning: "See what your stronger resume could look like.",
    priceLabel: "$9.99",
    entitlement: "full",
    ctaLabel: "SEE MY STRONGER VERSION — $9.99",
    uploadHeading: "Upload your resume to unlock your ELITE Report",
    uploadCtaLabel: "CONTINUE TO SECURE CHECKOUT — $9.99",
    uploadSupport: "Upload your existing resume for Resume Intelligence analysis, then securely unlock your ELITE Report.",
    productEnvironmentVariable: "POLAR_FULL_PRODUCT_ID",
    features: ["Everything in PRO", "Target-role Optimization", "Professional Summary Draft", "Achievement Statement Drafts", "Recruiter-ready Content Suggestions", "Job-match Insights", "High-impact Resume Blueprint", "Premium PDF Report"]
  }
} as const;

// Kept for existing components while all plan data is now sourced from reportPlanConfig.
export const reportPlanDetails = {
  free: { label: reportPlanConfig.free.displayName, priceLabel: reportPlanConfig.free.priceLabel, ctaLabel: reportPlanConfig.free.ctaLabel },
  standard: { label: reportPlanConfig.standard.displayName, priceLabel: reportPlanConfig.standard.priceLabel, ctaLabel: reportPlanConfig.standard.ctaLabel },
  full: { label: reportPlanConfig.full.displayName, priceLabel: reportPlanConfig.full.priceLabel, ctaLabel: reportPlanConfig.full.ctaLabel }
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

export function preparePendingReportPlan<
  T extends {
    paid: boolean;
    paymentStatus: "unpaid" | "not_required" | "pending" | "paid" | "refunded";
    requestedPlan: ReportPlan;
    accessPlan: ReportPlan;
    analysisStatus: "awaiting_payment" | "processing" | "completed" | "failed";
    targetRole?: string;
    eliteEnhancementStatus?: "not_started" | "processing" | "completed" | "failed";
    report?: unknown;
    updatedAt: string;
  }
>(report: T, plan: PaidReportPlan): T {
  if (report.analysisStatus === "awaiting_payment") {
    if (report.requestedPlan === plan && report.paymentStatus === "pending") return report;
    throw new Error("This pending upload belongs to a different plan.");
  }

  if (report.analysisStatus !== "completed" || !report.report) {
    throw new Error("Resume analysis is still in progress.");
  }

  if (plan === "full" && !report.targetRole) {
    throw new Error("ELITE target-role details are required before checkout.");
  }

  if (hasPlanAccess(report.accessPlan || (report.paid ? "standard" : "free"), plan)) {
    throw new Error("This report plan is already unlocked.");
  }

  if (report.requestedPlan === plan && report.paymentStatus === "pending") return report;

  return {
    ...report,
    requestedPlan: plan,
    paymentStatus: "pending",
    updatedAt: new Date().toISOString()
  };
}

export function getPdfReportTitle(accessPlan: ReportPlan) {
  return accessPlan === "full" ? "ELITE Resume Intelligence Engine" : "PRO Resume Intelligence Report";
}
