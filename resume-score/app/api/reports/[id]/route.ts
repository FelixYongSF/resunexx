import { NextResponse } from "next/server";
import { getReport } from "@/lib/report-store";
import { toPreview } from "@/lib/report-schema";
import { hasPlanAccess } from "@/lib/report-plan";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const full = url.searchParams.get("full") === "1";
  const report = await getReport(id);

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const accessPlan = report.accessPlan || (report.paid ? "standard" : "free");
  if (full && !hasPlanAccess(accessPlan, "standard")) {
    return NextResponse.json({ error: "Payment is required to view the full report." }, { status: 402 });
  }

  return NextResponse.json({
    id: report.id,
    fileName: report.fileName,
    createdAt: report.createdAt,
    paid: report.paid,
    paymentStatus: report.paymentStatus,
    requestedPlan: report.requestedPlan,
    accessPlan,
    analysisMode: report.analysisMode,
    preview: toPreview(report.report),
    report: full ? report.report : undefined
  });
}
