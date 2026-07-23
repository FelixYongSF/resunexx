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

  if (report.analysisStatus === "awaiting_payment") {
    return NextResponse.json({
      id: report.id,
      analysisStatus: "awaiting_payment",
      paymentStatus: report.paymentStatus,
      requestedPlan: report.requestedPlan
    }, { status: 202 });
  }

  if (report.analysisStatus === "processing") {
    return NextResponse.json({ id: report.id, analysisStatus: "processing" }, { status: 202 });
  }

  if (report.analysisStatus === "failed") {
    return NextResponse.json(
      { id: report.id, analysisStatus: "failed", error: report.analysisError || "We couldn't analyze your resume right now. Please try again." },
      { status: 422 }
    );
  }

  if (!report.report) {
    return NextResponse.json({ error: "Report analysis is unavailable. Please upload your resume again." }, { status: 500 });
  }

  const accessPlan = report.accessPlan || (report.paid ? "standard" : "free");
  if (full && !hasPlanAccess(accessPlan, "standard")) {
    return NextResponse.json({ error: "Payment is required to view the paid report." }, { status: 402 });
  }

  return NextResponse.json({
    id: report.id,
    analysisStatus: "completed",
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
