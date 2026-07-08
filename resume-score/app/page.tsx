import Link from "next/link";
import { Header } from "@/components/header";
import { Disclaimer } from "@/components/disclaimer";
import { ResumeUploadForm } from "@/components/resume-upload-form";
import { contactEmail, paymentProvider, productName } from "@/lib/site";

const journey = ["Upload", "Analyze", "Preview", "Unlock", "Download"];

const pillars = [
  ["ATS", "Can systems read the essentials?"],
  ["Impact", "Are outcomes visible fast?"],
  ["Keywords", "Do role signals match the market?"],
  ["Structure", "Is the story easy to scan?"],
  ["Presentation", "Does it feel clear and credible?"]
];

const topIssues = [
  "Your target role is not obvious in the first few seconds.",
  "Strong work is described as tasks, not outcomes.",
  "Important keywords are present, but not placed where recruiters scan first."
];

const actionPlan = [
  "Rewrite the opening summary around one target role.",
  "Turn three responsibility bullets into evidence of contribution.",
  "Move your strongest project closer to the top of the page."
];

const faqs = [
  ["Is my resume private?", "Your resume is processed to generate your AI-estimated analysis. Avoid uploading sensitive information you would not want processed by an AI service."],
  ["Is this AI-generated?", "Yes. The feedback is AI-estimated and written in a recruiter-style coaching format."],
  ["Is there human review?", "No. The flow is automated: upload, analyze, preview, checkout, report, download."],
  ["Do you store my resume?", "ScoreLab does not store your original resume file. We keep the generated report record so you can unlock and download it after payment."],
  ["Will this guarantee interviews?", "No. ScoreLab can help you understand and improve your resume, but it cannot guarantee interviews or job offers."]
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#151512]">
      <Header />

      <section className="bg-white">
        <div className="nexx-shell grid min-h-[calc(100vh-76px)] items-center gap-12 pb-16 pt-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="animate-editorial-reveal">
            <p className="nexx-eyebrow">{productName} Resume Lens</p>
            <h1 className="mt-5 max-w-4xl text-[clamp(3rem,7.5vw,7.8rem)] font-semibold leading-[0.92] tracking-normal text-[#151512]">
              See what recruiters see.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-[#5f5a50]">
              {productName} helps early-career job seekers upload a resume, receive an AI-estimated recruiter-style preview, and unlock a full improvement plan before applying again.
            </p>
            <div className="mt-6 max-w-2xl space-y-2 text-sm leading-6 text-[#625c52]">
              <p>
                Built for university students, recent graduates, first job seekers, and professionals with 0-5 years of experience.
              </p>
              <p>
                Paid reports cost $4.99 and include detailed scoring, top improvement priorities, rewrite examples, and a downloadable PDF report. Payments are processed by {paymentProvider}.
              </p>
              <p>
                Questions? Contact <a className="font-semibold text-[#171714]" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>
            </div>

            <div className="mt-9 grid max-w-2xl grid-cols-5 overflow-hidden rounded-full border border-[#ded8cc] bg-[#f7f4ee] p-1 text-center text-[11px] font-semibold text-[#625c52] sm:text-xs">
              {journey.map((step, index) => (
                <div
                  key={step}
                  className={index === 0 ? "rounded-full bg-[#151512] px-2 py-2 text-white" : "px-2 py-2"}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-6">
            <ResumeUploadForm compact />
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs font-medium text-[#6f6a5f]">
              <p className="rounded-full bg-[#f7f4ee] px-3 py-2">No signup</p>
              <p className="rounded-full bg-[#f7f4ee] px-3 py-2">Free preview</p>
              <p className="rounded-full bg-[#f7f4ee] px-3 py-2">PDF report</p>
            </div>
          </div>
        </div>
      </section>

      <section id="evaluation" className="bg-[#f5f5f2]">
        <div className="nexx-shell nexx-section">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="nexx-eyebrow">How we evaluate</p>
              <h2 className="mt-4 text-[clamp(2.5rem,5vw,5.5rem)] font-semibold leading-[0.96] tracking-normal">
                Five signals. One clear read.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#625c52]">
              The preview is intentionally simple. ScoreLab looks for the signals that determine whether your resume is easy to understand, easy to scan, and worth reading further.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-5">
            {pillars.map(([title, text], index) => (
              <div
                key={title}
                className="nexx-card group p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_86px_rgba(20,20,18,0.10)]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#151512] text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#625c52]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sample-report" className="bg-white">
        <div className="nexx-shell nexx-section">
          <div className="mx-auto max-w-3xl text-center">
            <p className="nexx-eyebrow">Example report</p>
            <h2 className="mt-4 text-[clamp(2.5rem,5vw,5.3rem)] font-semibold leading-[0.96] tracking-normal">
              Know what to fix first.
            </h2>
          </div>

          <div className="mx-auto mt-14 max-w-5xl rounded-[2.4rem] border border-black/10 bg-[#fbfaf7] p-4 shadow-[0_30px_100px_rgba(20,20,18,0.12)] sm:p-6">
            <div className="rounded-[1.8rem] bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-6 border-b border-[#e3ddd2] pb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#777064]">Recruiter first impression</p>
                  <h3 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight">
                    Strong potential. The proof needs to appear sooner.
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    ["Resume", "68"],
                    ["ATS", "74"],
                    ["Interview", "Medium"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-[#f5f5f2] px-4 py-4">
                      <p className="text-xs font-semibold text-[#777064]">{label}</p>
                      <p className="mt-2 text-2xl font-semibold text-[#151512]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
                <div>
                  <p className="text-sm font-semibold text-[#151512]">Top 3 issues</p>
                  <div className="mt-4 space-y-3">
                    {topIssues.map((issue) => (
                      <p key={issue} className="rounded-2xl border border-[#ece7dc] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#554f46]">
                        {issue}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-[#151512] p-6 text-white">
                  <p className="text-sm font-semibold text-white/60">Action plan</p>
                  <div className="mt-5 space-y-4">
                    {actionPlan.map((item, index) => (
                      <div key={item} className="flex gap-3">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs">
                          {index + 1}
                        </span>
                        <p className="text-sm leading-6 text-white/78">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#151512] text-white">
        <div className="nexx-shell nexx-section">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-white/50">Pricing</p>
              <h2 className="mt-4 text-[clamp(2.7rem,5vw,5.8rem)] font-semibold leading-[0.95] tracking-normal">
                Preview free. Improve for $4.99.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                <p className="text-sm font-semibold text-white/55">Free Preview</p>
                <p className="mt-4 text-4xl font-semibold">$0</p>
                <ul className="mt-6 space-y-3 text-sm leading-6 text-white/70">
                  <li>Overall resume score</li>
                  <li>ATS score</li>
                  <li>Interview readiness</li>
                  <li>Top 3 issues</li>
                </ul>
              </div>
              <div className="rounded-[2rem] bg-white p-6 text-[#151512] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
                <p className="text-sm font-semibold text-[#706b61]">Improvement Plan</p>
                <p className="mt-4 text-4xl font-semibold">$4.99</p>
                <ul className="mt-6 space-y-3 text-sm leading-6 text-[#514c43]">
                  <li>What recruiters may notice first</li>
                  <li>The 5 most important fixes</li>
                  <li>Rewrite examples</li>
                  <li>Downloadable PDF report</li>
                </ul>
                <p className="mt-5 text-xs leading-5 text-[#706b61]">
                  One-time payment processed by {paymentProvider}. Contact {contactEmail} for billing help.
                </p>
                <Link
                  href="/upload"
                  className="nexx-button-primary mt-7 w-full"
                >
                  Analyze My Resume - Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f5f5f2]">
        <div className="nexx-shell nexx-section grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="nexx-eyebrow">Trust questions</p>
            <h2 className="mt-4 text-[clamp(2.4rem,4.5vw,4.8rem)] font-semibold leading-[0.98] tracking-normal">
              Clear before you upload.
            </h2>
          </div>
          <div className="divide-y divide-[#ded8cc] rounded-[2rem] bg-white px-6 shadow-[0_18px_60px_rgba(20,20,18,0.06)]">
            {faqs.map(([question, answer]) => (
              <div key={question} className="py-6">
                <h3 className="text-lg font-semibold text-[#151512]">{question}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#625c52]">{answer}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-start-2">
            <Disclaimer />
          </div>
        </div>
      </section>
    </main>
  );
}
