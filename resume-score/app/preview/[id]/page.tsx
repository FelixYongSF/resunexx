import Link from "next/link";
import { redirect } from "next/navigation";
import { AnalyticsPageView } from "@/components/analytics-page-view";
import { Header } from "@/components/header";
import { ScoreRing } from "@/components/score-ring";
import { Disclaimer } from "@/components/disclaimer";
import { CheckoutButton } from "@/components/checkout-button";
import { getReport } from "@/lib/report-store";
import { reportPlanConfig } from "@/lib/report-plan";
import { toPreview } from "@/lib/report-schema";

export const runtime = "nodejs";

export default async function PreviewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stored = await getReport(id);

  if (!stored || stored.analysisStatus !== "completed" || !stored.report) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Header />
        <section className="mx-auto max-w-2xl px-5 py-24">
          <h1 className="text-3xl font-semibold text-slate-950">Report not found.</h1>
          <Link href="/upload" className="nexx-button-primary mt-6">
            Upload again
          </Link>
        </section>
      </main>
    );
  }

  const report = stored.report;
  const preview = toPreview(report);
  const requestedPlan = stored.requestedPlan || "free";
  const primaryPlan = requestedPlan === "full" ? "full" : "standard";
  const primaryPlanDetails = reportPlanConfig[primaryPlan];
  const eliteContextReady = Boolean(stored.targetRole);

  if ((stored.accessPlan || (stored.paid ? "standard" : "free")) !== "free") {
    redirect(`/report/${id}`);
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef]">
      <AnalyticsPageView event="preview_viewed" reportId={id} />
      <Header />
      <section className="nexx-shell py-12 sm:py-14">
        <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold text-blue-600">FREE — Resume Signal Check</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Your Resume Signal Check is ready.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Your resume has potential. Here are the top things that may be holding it back today.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ScoreRing label="Overall Resume Score" score={preview.overallScore} />
              <ScoreRing label="ATS Readiness Score" score={preview.atsCompatibilityScore} muted />
              <div className="nexx-card p-5">
                <p className="text-sm text-slate-500">Interview Readiness</p>
                <p className="mt-5 text-3xl font-semibold text-slate-950">{preview.interviewReadinessLevel}</p>
                <p className="mt-2 text-sm text-slate-500">AI-estimated level</p>
              </div>
            </div>

            <div className="nexx-card mt-8 p-7">
              <h2 className="text-xl font-semibold text-slate-950">Top 3 issues</h2>
              <ol className="mt-5 grid gap-4">
                {preview.topIssues.map((issue, index) => (
                  <li key={issue} className="flex gap-4 rounded-2xl bg-[#f6f4ef] p-4 text-sm leading-6 text-[#625c52]">
                    <span className="font-semibold text-blue-600">{index + 1}</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ol>
            </div>

            <section className="nexx-card mt-8 p-7">
              <p className="text-sm font-semibold text-blue-600">Recruiter First Impression</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{report.paidReport.premiumReport.recruiterFirstImpression}</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">What Recruiters Notice</h2>
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                    {report.positiveStandouts.slice(0, 2).map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-950">What They Miss</h2>
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                    {report.hesitationSignals.slice(0, 2).map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="nexx-card mt-8 p-7">
              <p className="text-sm font-semibold text-blue-600">You&apos;re closer than you think.</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Your resume already has potential.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                You now know what needs attention. Unlock your complete improvement plan to see exactly what to change, why it matters, and where the biggest gains can come from.
              </p>
              <div className="mt-6 max-w-xl rounded-2xl border border-[#d8d1c5] bg-[#f6f4ef] p-5">
                <p className="text-sm font-semibold text-blue-600">{primaryPlanDetails.displayName} — {primaryPlanDetails.priceLabel}</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{primaryPlanDetails.productName}</p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-600">
                  {(primaryPlan === "standard" ? [
                    "Detailed analysis of your weakest sections",
                    "Priority fixes ranked by impact",
                    "Section-by-section guidance",
                    "Professional improvement examples",
                    "Downloadable PDF report"
                  ] : primaryPlanDetails.features.slice(1)).map((feature) => <li key={feature}>• {feature}</li>)}
                </ul>
                <CheckoutButton reportId={id} plan={primaryPlan} eliteContextReady={eliteContextReady} initialTargetRole={stored.targetRole} initialJobDescription={stored.jobDescription} />
              </div>
              {primaryPlan === "standard" ? (
                <div className="mt-5 text-sm text-slate-600">
                  <span>Looking for a more complete optimization? </span>
                  <CheckoutButton reportId={id} plan="full" eliteContextReady={eliteContextReady} initialTargetRole={stored.targetRole} initialJobDescription={stored.jobDescription} variant="link" />
                </div>
              ) : null}
            </section>
            <div className="mt-6 px-1"><Disclaimer /></div>
        </div>
      </section>
    </main>
  );
}
