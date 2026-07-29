import { Polar } from "@polar-sh/sdk";
import type { PaidReportPlan } from "./report-plan";

export type PolarOrderRecord = {
  id: string;
  createdAt: Date;
  status: string;
  paid: boolean;
  productId: string | null;
  metadata: Record<string, unknown>;
  totalAmount: number;
  currency: string;
  customer: { email?: string | null };
};

export function appUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export type PolarEnvironment = "production" | "sandbox";

export function getPolarEnvironment(): PolarEnvironment {
  const configuredEnvironment = process.env.POLAR_ENVIRONMENT;
  if (!configuredEnvironment || configuredEnvironment === "production") return "production";
  if (configuredEnvironment === "sandbox") {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error("Polar sandbox cannot run in a Vercel Production deployment.");
    }
    return "sandbox";
  }
  throw new Error("Polar is not configured. POLAR_ENVIRONMENT must be either production or sandbox.");
}

export function getPolarProductId(plan: PaidReportPlan) {
  return plan === "full" ? process.env.POLAR_FULL_PRODUCT_ID || "" : process.env.POLAR_STANDARD_PRODUCT_ID || "";
}

export function getPolarPlanForProductId(productId: string | null | undefined): PaidReportPlan | null {
  if (!productId) return null;
  if (productId === getPolarProductId("standard")) return "standard";
  if (productId === getPolarProductId("full")) return "full";
  return null;
}

export function assertPolarCheckoutConfig(plan: PaidReportPlan) {
  const missing = [
    !process.env.POLAR_ACCESS_TOKEN ? "POLAR_ACCESS_TOKEN" : "",
    !getPolarProductId(plan) ? plan === "full" ? "POLAR_FULL_PRODUCT_ID" : "POLAR_STANDARD_PRODUCT_ID" : "",
    !process.env.NEXT_PUBLIC_APP_URL && !process.env.VERCEL_URL ? "NEXT_PUBLIC_APP_URL or VERCEL_URL" : ""
  ].filter(Boolean);

  if (missing.length) throw new Error(`Polar is not configured. Missing: ${missing.join(", ")}.`);
}

export function createPolarClient() {
  if (!process.env.POLAR_ACCESS_TOKEN) throw new Error("Polar is not configured. Missing: POLAR_ACCESS_TOKEN.");
  return new Polar({ accessToken: process.env.POLAR_ACCESS_TOKEN, server: getPolarEnvironment() });
}

export async function createPolarCheckout({ reportId, plan }: { reportId: string; plan: PaidReportPlan }) {
  assertPolarCheckoutConfig(plan);
  const checkout = await createPolarClient().checkouts.create({
    products: [getPolarProductId(plan)],
    metadata: { reportId, selectedPlan: plan },
    successUrl: `${appUrl()}/payment/success?report_id=${encodeURIComponent(reportId)}`,
    returnUrl: `${appUrl()}/payment/cancel?plan=${encodeURIComponent(plan)}&report_id=${encodeURIComponent(reportId)}`
  });

  if (!checkout.url) throw new Error("Polar did not return a checkout URL.");
  return { checkoutId: checkout.id, checkoutUrl: checkout.url };
}

export function getPolarOrderReportId(order: PolarOrderRecord) {
  const reportId = order.metadata.reportId;
  return typeof reportId === "string" && reportId ? reportId : "";
}

export function isPaidPolarOrder(order: PolarOrderRecord) {
  const planFromMetadata = order.metadata.selectedPlan;
  const productPlan = getPolarPlanForProductId(order.productId);
  return (
    order.paid &&
    order.status === "paid" &&
    Boolean(getPolarOrderReportId(order)) &&
    (planFromMetadata === "standard" || planFromMetadata === "full") &&
    planFromMetadata === productPlan
  );
}
