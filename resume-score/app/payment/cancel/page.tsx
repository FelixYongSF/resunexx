import { redirect } from "next/navigation";
import { isPaidReportPlan } from "@/lib/report-plan";

export const runtime = "nodejs";

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

  redirect(`/upload?plan=${selectedPlan}${reportQuery}`);
}
