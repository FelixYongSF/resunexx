import assert from "node:assert/strict";
import test from "node:test";

import {
  getConfiguredPaddlePriceId,
  getRequestedReportPlan,
  getPaddlePlanForPriceId,
  getPdfReportTitle,
  hasPlanAccess,
  reportPlanConfig,
  shouldApplyPurchasedPlan
} from "../lib/report-plan.ts";

test("maps explicit Paddle prices to the correct plan and rejects unknown prices", () => {
  const previousStandard = process.env.PADDLE_STANDARD_PRICE_ID;
  const previousFull = process.env.PADDLE_FULL_PRICE_ID;
  process.env.PADDLE_STANDARD_PRICE_ID = "pri_standard";
  process.env.PADDLE_FULL_PRICE_ID = "pri_full";

  assert.equal(getConfiguredPaddlePriceId("standard"), "pri_standard");
  assert.equal(getConfiguredPaddlePriceId("full"), "pri_full");
  assert.equal(getPaddlePlanForPriceId("pri_standard"), "standard");
  assert.equal(getPaddlePlanForPriceId("pri_full"), "full");
  assert.equal(getPaddlePlanForPriceId("pri_unknown"), null);

  process.env.PADDLE_STANDARD_PRICE_ID = previousStandard;
  process.env.PADDLE_FULL_PRICE_ID = previousFull;
});

test("plan access prevents an unpaid or Standard report from exposing Full content", () => {
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
  assert.equal(reportPlanConfig.standard.priceEnvironmentVariable, "PADDLE_STANDARD_PRICE_ID");
  assert.equal(reportPlanConfig.full.priceEnvironmentVariable, "PADDLE_FULL_PRICE_ID");
  assert.equal(reportPlanConfig.free.features.length, 5);
  assert.equal(reportPlanConfig.standard.features.length, 5);
  assert.equal(reportPlanConfig.full.features.length, 5);
});

test("PDF selection remains plan-specific", () => {
  assert.equal(getPdfReportTitle("standard"), "Standard Recruiter Mind Report");
  assert.equal(getPdfReportTitle("full"), "Full Recruiter Mind Report");
});
