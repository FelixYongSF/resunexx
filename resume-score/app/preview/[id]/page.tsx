import Link from "next/link";
import { redirect } from "next/navigation";
import { AnalyticsPageView } from "@/components/analytics-page-view";
import { Header } from "@/components/header";
import { ScoreRing } from "@/components/score-ring";
import { Disclaimer } from "@/components/disclaimer";
import { CheckoutButton } from "@/components/checkout-button";
import { getReport } from "@/lib/report-store";
import { toPreview } from "@/lib/report-schema";

export const runtime = "nodejs";

export default async function PreviewPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ plan?: string }>;
}) {
  const { id } = await params;
  const { plan } = await searchParams;
  const stored = await getReport(id);

  if (!stored) {
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

  const preview = toPreview(stored.report);

  if ((stored.accessPlan || (stored.paid ? "standard" : "free")) !== "free") {
    redirect(`/report/${id}`);
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef]">
      <AnalyticsPageView event="preview_viewed" reportId={id} />
      <Header />
      <section className="nexx-shell py-12 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold text-blue-600">Free preview</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Your recruiter-style preview is ready.
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
          </div>

          <aside className="grid h-fit gap-4">
            <section className="nexx-card p-7">
              <p className="text-sm font-semibold text-blue-600">Standard Report</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">$4.99</p>
              <ul className="mt-6 grid gap-3 text-sm text-slate-600">
                <li>Recruiter-style read</li>
                <li>Five priority fixes</li>
                <li>Suggested rewrite examples</li>
                <li>Standard PDF report</li>
              </ul>
              <CheckoutButton reportId={id} plan="standard" autoStart={plan === "standard"} />
            </section>
            <section className="nexx-card border-slate-900 bg-slate-950 p-7 text-white">
              <p className="text-sm font-semibold text-[#d7ff4f]">Full Report</p>
              <p className="mt-3 text-4xl font-semibold">$9.99</p>
              <ul className="mt-6 grid gap-3 text-sm text-white/75">
                <li>Everything in Standard</li>
                <li>Target-role match and keyword gaps</li>
                <li>Rewritten summary and five bullets</li>
                <li>30-minute action plan and full PDF</li>
              </ul>
              <CheckoutButton reportId={id} plan="full" autoStart={plan === "full"} />
            </section>
            {plan === "full" ? <p className="text-sm text-slate-600">Your Full Report is selected. Complete checkout to unlock it.</p> : null}
            <div className="px-1"><Disclaimer /></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
