import { NextResponse } from "next/server";
import { reportToPdf } from "@/lib/report-pdf";
import { getReport } from "@/lib/report-store";
import { hasPlanAccess } from "@/lib/report-plan";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });
  if (report.analysisStatus !== "completed" || !report.report) {
    return NextResponse.json({ error: "Resume analysis is still in progress. Please wait a moment and try again." }, { status: 409 });
  }
  const accessPlan = report.accessPlan || (report.paid ? "standard" : "free");
  if (!hasPlanAccess(accessPlan, "standard")) {
    return NextResponse.json({ error: "Payment is required before downloading the PDF report." }, { status: 402 });
  }

  const customerPlan = accessPlan === "full" ? "elite" : "pro";

  return new Response(reportToPdf(report.report, accessPlan), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="resunexx-${customerPlan}-report-${id}.pdf"`
    }
  });
}
