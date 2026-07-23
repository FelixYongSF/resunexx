import { redirect } from "next/navigation";
import { PaymentSuccessStatus } from "@/components/payment-success-status";
import { getReport } from "@/lib/report-store";

export const runtime = "nodejs";

export default async function PaymentSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ report_id?: string; checkout_id?: string }>;
}) {
  const { report_id: reportId } = await searchParams;
  if (!reportId) redirect("/pricing");

  const report = await getReport(reportId);
  if (!report) redirect("/pricing");
  if (report.paid && report.analysisStatus === "completed" && report.report) redirect(`/report/${reportId}`);

  return <PaymentSuccessStatus reportId={reportId} />;
}
