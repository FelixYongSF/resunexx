import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isPaidReportPlan } from "@/lib/report-plan";
import { trackServerEvent } from "@/lib/analytics";

export const runtime = "nodejs";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PaymentCancelPage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string; report_id?: string }>;
}) {
  const { plan, report_id: reportId } = await searchParams;
  const selectedPlan = isPaidReportPlan(plan) ? plan : "standard";
  const reportQuery = reportId && /^[0-9a-f-]{36}$/i.test(reportId)
    ? `&report_id=${encodeURIComponent(reportId)}`
    : "";

  await trackServerEvent({ event: "checkout_cancelled", source: "payment_cancel", metadata: { plan: selectedPlan } });

  redirect(`/upload?plan=${selectedPlan}${reportQuery}`);
}
