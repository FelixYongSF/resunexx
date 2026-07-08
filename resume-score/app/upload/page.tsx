import { Header } from "@/components/header";
import { Disclaimer } from "@/components/disclaimer";
import { ResumeUploadForm } from "@/components/resume-upload-form";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[#f6f4ef]">
      <Header />
      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
        <p className="nexx-eyebrow">Resume Score by ScoreLab</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-[#171714] sm:text-5xl">
          Great — let&apos;s see how recruiters may read your resume.
        </h1>
        <p className="mt-4 text-lg leading-8 text-[#625c52]">
          Upload a PDF, DOCX, or readable image and we&apos;ll look for the signals recruiters and ATS systems may notice first. You&apos;ll get a free preview before deciding whether to unlock the full plan.
        </p>

        <div className="mt-10">
          <ResumeUploadForm />
        </div>

        <div className="mt-6">
          <Disclaimer />
        </div>
      </section>
    </main>
  );
}
