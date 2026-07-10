import Link from "next/link";
import { Header } from "@/components/header";
import { Disclaimer } from "@/components/disclaimer";
import { ScoreRing } from "@/components/score-ring";
import { getReport } from "@/lib/report-store";
import { engineName } from "@/lib/resumeEngine";

export const runtime = "nodejs";

export default async function FullReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  if (!stored.paid) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Header />
        <section className="mx-auto max-w-2xl px-5 py-24">
          <h1 className="text-3xl font-semibold text-slate-950">Full report is locked.</h1>
          <p className="mt-3 text-slate-600">Unlock the full report from your free preview page.</p>
          <Link href={`/preview/${id}`} className="nexx-button-primary mt-6">
            Back to preview
          </Link>
        </section>
      </main>
    );
  }

  const report = stored.report;
  const premiumReport = report.paidReport.premiumReport;

  return (
    <main className="min-h-screen bg-[#f6f4ef]">
      <Header />
      <section className="nexx-shell py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-blue-600">Full AI-generated report</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Recruiter Mind Report
            </h1>
            <p className="mt-3 text-slate-600">File: {stored.fileName}</p>
          </div>
          <a
            href={`/api/download/${id}`}
            className="nexx-button-primary"
          >
            Download PDF Report
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreRing label="Overall Resume Score" score={report.overallScore} />
          <ScoreRing label="ATS Compatibility" score={report.atsCompatibilityScore} muted />
          <ScoreRing label="Interview Readiness" score={report.interviewReadinessScore} muted />
          <ScoreRing label="Recruiter Attention" score={report.recruiterAttentionScore} muted />
        </div>

        <section className="nexx-card mt-8 p-7">
          <p className="text-sm font-semibold text-blue-600">Executive Summary</p>
          <p className="mt-3 text-base leading-7 text-slate-700">{premiumReport.executiveSummary}</p>
        </section>

        <section className="nexx-card mt-8 p-7">
          <p className="text-sm font-semibold text-blue-600">Biggest Opportunity</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">{premiumReport.biggestOpportunity.whatToImprove}</h2>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-slate-700 md:grid-cols-3">
            <p><span className="font-semibold text-slate-950">Why it matters:</span> {premiumReport.biggestOpportunity.whyItMatters}</p>
            <p><span className="font-semibold text-slate-950">Example:</span> {premiumReport.biggestOpportunity.example}</p>
            <p><span className="font-semibold text-slate-950">Expected impact:</span> {premiumReport.biggestOpportunity.expectedImpact}</p>
          </div>
        </section>

        <section className="nexx-card mt-8 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">High Impact Improvements</h2>
          <div className="mt-6 grid gap-4">
            {premiumReport.highImpactImprovements.map((item) => (
              <article key={item.whatWasDetected} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-blue-600">{item.priorityLevel} priority</p>
                <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
                  <p><span className="font-semibold text-slate-950">What was detected:</span> {item.whatWasDetected}</p>
                  <p><span className="font-semibold text-slate-950">Why it matters:</span> {item.whyItMatters}</p>
                  <p><span className="font-semibold text-slate-950">Recruiter impact:</span> {item.recruiterImpact}</p>
                  <p><span className="font-semibold text-slate-950">ATS impact:</span> {item.atsImpact}</p>
                  <p><span className="font-semibold text-slate-950">Recommended action:</span> {item.recommendedAction}</p>
                  <p><span className="font-semibold text-slate-950">Expected benefit:</span> {item.expectedBenefit}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="nexx-card mt-8 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">Suggested Rewrite</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Before</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{premiumReport.suggestedRewrite.before}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-700">After</p>
              <p className="mt-3 text-sm leading-6 text-blue-950">{premiumReport.suggestedRewrite.after}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            <span className="font-semibold text-slate-950">Why this works better:</span> {premiumReport.suggestedRewrite.whyThisWorksBetter}
          </p>
        </section>

        <section className="nexx-card mt-8 p-7">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-blue-600">Recruiter First Impression</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{premiumReport.recruiterFirstImpression}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-600">ATS Perspective</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{premiumReport.atsPerspective}</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <ReportCard title="What stands out positively?" items={report.positiveStandouts} />
          <ReportCard title="What may cause hesitation?" items={report.hesitationSignals} />
          <ReportCard title="Strengths" items={report.strengths} />
          <ReportCard title="Missing Keywords" items={report.missingKeywords} />
        </section>

        <section className="nexx-card mt-8 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">The 5 most important changes before applying again</h2>
          <div className="mt-6 grid gap-4">
            {report.fiveMostImportantChanges.map((item, index) => (
              <article key={item.whatWeNoticed} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-blue-600">Change {index + 1}</p>
                <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
                  <p><span className="font-semibold text-slate-950">What we noticed:</span> {item.whatWeNoticed}</p>
                  <p><span className="font-semibold text-slate-950">Why this matters to recruiters:</span> {item.whyItMattersToRecruiters}</p>
                  <p><span className="font-semibold text-slate-950">What to change next:</span> {item.whatToChangeNext}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="nexx-card p-7">
            <h2 className="text-2xl font-semibold text-slate-950">What to fix first</h2>
            <p className="mt-4 text-sm leading-6 text-slate-700">{report.whatToFixFirst}</p>
          </article>
          <article className="nexx-card p-7">
            <h2 className="text-2xl font-semibold text-slate-950">Why this matters to recruiters</h2>
            <p className="mt-4 text-sm leading-6 text-slate-700">{report.whyThisMattersToRecruiters}</p>
          </article>
        </section>

        <section className="nexx-card mt-8 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">Section-by-section feedback</h2>
          <div className="mt-6 grid gap-4">
            {Object.entries(report.sectionFeedback).map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold capitalize text-slate-950">{key.replace(/([A-Z])/g, " $1")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="nexx-card mt-8 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">Suggested rewrite examples</h2>
          <div className="mt-6 grid gap-4">
            {report.rewriteExamples.improvedBulletPoints.map((bullet) => (
              <p key={bullet} className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">{bullet}</p>
            ))}
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-sm font-semibold text-white/70">Improved professional summary</p>
              <p className="mt-2 leading-7">{report.rewriteExamples.improvedProfessionalSummary}</p>
            </div>
          </div>
        </section>

        <section className="nexx-card mt-8 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">30-Minute Improvement Plan</h2>
          <ol className="mt-6 grid gap-3">
            {[
              premiumReport.thirtyMinuteImprovementPlan.tenMinutes,
              premiumReport.thirtyMinuteImprovementPlan.nextTenMinutes,
              premiumReport.thirtyMinuteImprovementPlan.finalTenMinutes
            ].map((item, index) => (
              <li key={item} className="flex gap-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <span className="font-semibold text-blue-600">{index === 0 ? "10" : index === 1 ? "20" : "30"}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="nexx-card mt-8 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">Long-Term Career Signal</h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">{premiumReport.longTermCareerSignal}</p>
        </section>

        <div className="mt-8">
          <Disclaimer />
        </div>
        <section className="mt-8 rounded-[2rem] border border-blue-100 bg-blue-50 p-7 text-blue-950">
          <h2 className="text-xl font-semibold">Encouraging closing note</h2>
          <p className="mt-3 text-sm leading-6">{report.encouragingClosingNote}</p>
        </section>
        <footer className="mt-6 pb-6 text-center text-sm text-slate-500">
          Generated by {engineName} v{report.engineVersion}
        </footer>
      </section>
    </main>
  );
}

function ReportCard({ title, items, numbered }: { title: string; items: string[]; numbered?: boolean }) {
  return (
    <article className="nexx-card p-7">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <span className="font-semibold text-blue-600">{numbered ? index + 1 : "•"}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
