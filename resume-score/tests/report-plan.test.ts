import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

import {
  getRequestedReportPlan,
  getPdfReportTitle,
  hasPlanAccess,
  preparePendingReportPlan,
  reportPlanConfig,
  shouldApplyPurchasedPlan
} from "../lib/report-plan.ts";
import { getPolarPlanForProductId, getPolarProductId, isPaidPolarOrder } from "../lib/polar.ts";
import { canResumePendingCheckout, canRunVerifiedPaidAnalysis, getUploadSubmissionMode } from "../lib/payment-flow.ts";

test("maps explicit Polar product IDs to the correct plan and rejects unknown products", () => {
  const previousStandard = process.env.POLAR_STANDARD_PRODUCT_ID;
  const previousFull = process.env.POLAR_FULL_PRODUCT_ID;
  process.env.POLAR_STANDARD_PRODUCT_ID = "product_standard";
  process.env.POLAR_FULL_PRODUCT_ID = "product_full";

  assert.equal(getPolarProductId("standard"), "product_standard");
  assert.equal(getPolarProductId("full"), "product_full");
  assert.equal(getPolarPlanForProductId("product_standard"), "standard");
  assert.equal(getPolarPlanForProductId("product_full"), "full");
  assert.equal(getPolarPlanForProductId("product_unknown"), null);

  restoreEnvironment("POLAR_STANDARD_PRODUCT_ID", previousStandard);
  restoreEnvironment("POLAR_FULL_PRODUCT_ID", previousFull);
});

test("Polar checkout never falls back to an unconfigured product ID", () => {
  const previousStandard = process.env.POLAR_STANDARD_PRODUCT_ID;
  delete process.env.POLAR_STANDARD_PRODUCT_ID;

  assert.equal(getPolarProductId("standard"), "");

  restoreEnvironment("POLAR_STANDARD_PRODUCT_ID", previousStandard);
});

test("only a paid Polar order with matching metadata and product can unlock a report", () => {
  const previousStandard = process.env.POLAR_STANDARD_PRODUCT_ID;
  process.env.POLAR_STANDARD_PRODUCT_ID = "product_standard";
  const validOrder = {
    id: "order_123",
    createdAt: new Date("2026-07-22T00:00:00.000Z"),
    status: "paid",
    paid: true,
    productId: "product_standard",
    metadata: { reportId: "report_123", selectedPlan: "standard" },
    totalAmount: 499,
    currency: "usd",
    customer: { email: "customer@example.com" }
  };

  assert.equal(isPaidPolarOrder(validOrder), true);
  assert.equal(isPaidPolarOrder({ ...validOrder, paid: false }), false);
  assert.equal(isPaidPolarOrder({ ...validOrder, metadata: { reportId: "report_123", selectedPlan: "full" } }), false);
  restoreEnvironment("POLAR_STANDARD_PRODUCT_ID", previousStandard);
});

test("plan access prevents an unpaid or PRO report from exposing ELITE content", () => {
  assert.equal(hasPlanAccess("free", "standard"), false);
  assert.equal(hasPlanAccess("standard", "full"), false);
  assert.equal(hasPlanAccess("full", "standard"), true);
  assert.equal(shouldApplyPurchasedPlan("standard", "full"), true);
  assert.equal(shouldApplyPurchasedPlan("full", "standard"), false);
  assert.equal(shouldApplyPurchasedPlan("full", "full"), false);
});

test("normalizes untrusted requested plan values and centralizes the plan configuration", () => {
  assert.equal(getRequestedReportPlan("free"), "free");
  assert.equal(getRequestedReportPlan("standard"), "standard");
  assert.equal(getRequestedReportPlan("full"), "full");
  assert.equal(getRequestedReportPlan("admin"), "free");
  assert.equal(getRequestedReportPlan(null), "free");
  assert.equal(reportPlanConfig.standard.productEnvironmentVariable, "POLAR_STANDARD_PRODUCT_ID");
  assert.equal(reportPlanConfig.full.productEnvironmentVariable, "POLAR_FULL_PRODUCT_ID");
  assert.equal(reportPlanConfig.free.displayName, "FREE");
  assert.equal(reportPlanConfig.standard.displayName, "PRO");
  assert.equal(reportPlanConfig.full.displayName, "ELITE");
  assert.equal(reportPlanConfig.standard.productName, "Resume Intelligence Report");
  assert.equal(reportPlanConfig.full.productName, "Resume Intelligence Engine");
  assert.equal(reportPlanConfig.free.ctaLabel, "START FREE");
  assert.equal(reportPlanConfig.standard.ctaLabel, "UNLOCK MY IMPROVEMENT PLAN — $4.99");
  assert.equal(reportPlanConfig.full.ctaLabel, "SEE MY STRONGER VERSION — $9.99");
  assert.equal(reportPlanConfig.standard.uploadCtaLabel, "CONTINUE TO SECURE CHECKOUT — $4.99");
  assert.equal(reportPlanConfig.full.uploadCtaLabel, "CONTINUE TO SECURE CHECKOUT — $9.99");
  assert.equal(reportPlanConfig.free.features.length, 5);
  assert.equal(reportPlanConfig.standard.features.length, 7);
  assert.equal(reportPlanConfig.full.features.length, 8);
});

test("PDF selection remains plan-specific", () => {
  assert.equal(getPdfReportTitle("standard"), "PRO Resume Intelligence Report");
  assert.equal(getPdfReportTitle("full"), "ELITE Resume Intelligence Engine");
});

test("an existing completed free report can be prepared for a paid upgrade without a new analysis", () => {
  const report: {
    id: string;
    createdAt: string;
    updatedAt: string;
    fileName: string;
    resumeTextHash: string;
    resumeTextPreview: string;
    paid: boolean;
    paymentStatus: "unpaid" | "not_required" | "pending" | "paid" | "refunded";
    requestedPlan: "free" | "standard" | "full";
    accessPlan: "free" | "standard" | "full";
    analysisStatus: "awaiting_payment" | "processing" | "completed" | "failed";
    report: object;
  } = {
    id: "report-123",
    createdAt: "2026-07-14T00:00:00.000Z",
    updatedAt: "2026-07-14T00:00:00.000Z",
    fileName: "resume.pdf",
    resumeTextHash: "hash",
    resumeTextPreview: "Resume text preview",
    paid: false,
    paymentStatus: "not_required",
    requestedPlan: "free",
    accessPlan: "free",
    analysisStatus: "completed",
    report: {}
  };

  const prepared = preparePendingReportPlan(report, "standard");

  assert.equal(prepared.id, report.id);
  assert.equal(prepared.report, report.report);
  assert.equal(prepared.requestedPlan, "standard");
  assert.equal(prepared.paymentStatus, "pending");
  assert.equal(prepared.paid, false);

  assert.throws(
    () => preparePendingReportPlan({ ...prepared, accessPlan: "standard", paid: true, paymentStatus: "paid" }, "full"),
    /ELITE target-role details are required/
  );

  const eliteUpgrade = preparePendingReportPlan({
    ...prepared,
    accessPlan: "standard",
    paid: true,
    paymentStatus: "paid",
    targetRole: "Junior Product Manager",
    eliteEnhancementStatus: "completed"
  }, "full");
  assert.equal(eliteUpgrade.id, report.id);
  assert.equal(eliteUpgrade.report, report.report);
  assert.equal(eliteUpgrade.requestedPlan, "full");
  assert.equal(eliteUpgrade.paymentStatus, "pending");
});

test("FREE report gives PRO the dominant purchase action and keeps ELITE secondary", () => {
  const source = readProjectFile("app/preview/[id]/page.tsx");
  assert.match(source, /Unlock your complete improvement plan/);
  assert.match(source, /primaryPlan = requestedPlan === \"full\" \? \"full\" : \"standard\"/);
  assert.match(source, /variant=\"link\"/);
  assert.match(source, /Looking for a more complete optimization/);
});

test("ELITE collects required target role and optional job description without another upload", () => {
  const checkoutSource = readProjectFile("components/checkout-button.tsx");
  const enhancementSource = readProjectFile("app/api/reports/[id]/elite-context/route.ts");
  const paidAnalysisSource = readProjectFile("lib/paid-report-analysis.ts");
  assert.match(checkoutSource, /Target Role \/ Job Title/);
  assert.match(checkoutSource, /Job Description.*optional/);
  assert.match(enhancementSource, /saveEliteTargetContext/);
  assert.doesNotMatch(enhancementSource, /enhanceEliteReport/);
  assert.match(paidAnalysisSource, /enhanceEliteReport/);
});

test("FREE analyzes immediately while paid upload plans only prepare secure checkout", () => {
  assert.equal(getUploadSubmissionMode("free"), "analyze");
  assert.equal(getUploadSubmissionMode("standard"), "prepare_checkout");
  assert.equal(getUploadSubmissionMode("full"), "prepare_checkout");

  const uploadSource = readProjectFile("components/resume-upload-form.tsx");
  assert.match(uploadSource, /fetch\("\/api\/pending-report"/);
  assert.match(uploadSource, /fetch\(`\/api\/checkout/);
  assert.match(uploadSource, /submissionMode === "prepare_checkout"/);
  assert.match(uploadSource, /You&apos;ll be redirected to Polar&apos;s secure checkout/);
});

test("paid source can only be analyzed after a matching verified payment", () => {
  const pending = {
    paid: false,
    paymentStatus: "pending" as const,
    requestedPlan: "standard" as const,
    accessPlan: "free" as const,
    analysisStatus: "awaiting_payment" as const,
    analysisInputText: "resume text"
  };
  assert.equal(canResumePendingCheckout(pending, "standard"), true);
  assert.equal(canRunVerifiedPaidAnalysis(pending, "standard"), false);
  assert.equal(canResumePendingCheckout({ ...pending, requestedPlan: "full" }, "standard"), false);
  assert.equal(canRunVerifiedPaidAnalysis({ ...pending, paid: true, paymentStatus: "paid", accessPlan: "standard" }, "standard"), true);
  assert.equal(canRunVerifiedPaidAnalysis({ ...pending, paid: true, paymentStatus: "paid", accessPlan: "full" }, "standard"), false);
});

test("paid analysis route refuses client-submitted paid plans and the webhook owns the paid analysis path", () => {
  const analyzeSource = readProjectFile("app/api/analyze/route.ts");
  const webhookSource = readProjectFile("app/api/polar/webhook/route.ts");
  const paymentSource = readProjectFile("lib/payment/index.ts");
  assert.match(analyzeSource, /request:paid-plan-blocked/);
  assert.match(analyzeSource, /Paid reports are generated only after secure payment verification/);
  assert.match(webhookSource, /onOrderPaid/);
  assert.match(paymentSource, /runVerifiedPaidReportAnalysis/);
});

test("paid checkout cancellation returns to the matching pending upload and unpaid reports stay gated", () => {
  const polarSource = readProjectFile("lib/polar.ts");
  const downloadSource = readProjectFile("app/api/download/[id]/route.ts");
  const reportApiSource = readProjectFile("app/api/reports/[id]/route.ts");
  assert.match(polarSource, /\/upload\?plan=\$\{encodeURIComponent\(plan\)\}&report_id=/);
  assert.match(downloadSource, /Payment is required before downloading the PDF report/);
  assert.match(reportApiSource, /Payment is required to view the paid report/);
});

test("duplicate webhook delivery cannot claim paid analysis twice", () => {
  const storeSource = readProjectFile("lib/report-store.ts");
  const paymentSource = readProjectFile("lib/payment/index.ts");
  assert.match(storeSource, /report-analysis-lock:/);
  assert.match(storeSource, /"NX"/);
  assert.match(paymentSource, /alreadyUnlocked/);
});

test("refund creation does not revoke access until Polar confirms the refund", () => {
  const webhookSource = readProjectFile("app/api/polar/webhook/route.ts");
  assert.match(webhookSource, /onRefundCreated/);
  assert.match(webhookSource, /payload\.data\.status === "succeeded"/);
  assert.match(webhookSource, /onRefundUpdated/);
  assert.match(webhookSource, /onOrderRefunded/);
  assert.match(webhookSource, /revokeRefundedReport/);
});

test("ELITE drafts include anti-fabrication safeguards", () => {
  const source = readProjectFile("lib/engines/resume/resumeEliteEnhancement.ts");
  assert.match(source, /Never invent metrics, revenue, team size, employers/);
  assert.match(source, /Add a verified result here/);
  assert.match(source, /guardEliteDraftMetrics/);
});

test("PDF generation remains text-based, selectable, and plan-specific", () => {
  const source = readProjectFile("lib/report-pdf.ts");
  assert.match(source, /BT \/F1/);
  assert.doesNotMatch(source, /\/Subtype \/Image/);
  assert.match(source, /ELITE Structured Improvement Drafts/);
});

test("ELITE web drafts expose keyboard-accessible copy controls", () => {
  const source = readProjectFile("components/copy-draft-button.tsx");
  assert.match(source, /navigator\.clipboard\.writeText\(text\)/);
  assert.match(source, /type=\"button\"/);
  assert.match(source, /Copied\./);
});

test("legacy mockup routes redirect and the V3.5 content does not render a duplicate footer", () => {
  const config = readProjectFile("next.config.ts");
  const homepageContent = readProjectFile("app/mockup-v3-1/page.tsx");
  assert.match(config, /source: \"\/mockup-v3-1\", destination: \"\/\"/);
  assert.match(config, /source: \"\/mockup-v3-3\", destination: \"\/\"/);
  assert.doesNotMatch(homepageContent, /<footer/);
});

function readProjectFile(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function restoreEnvironment(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}
