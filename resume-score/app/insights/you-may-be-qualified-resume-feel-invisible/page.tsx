import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { JsonLd } from "@/components/json-ld";
import { LegalPage } from "@/components/legal-page";
import { absoluteUrl, siteUrl } from "@/lib/seo";

const slug = "you-may-be-qualified-resume-feel-invisible";
const articleUrl = absoluteUrl(`/insights/${slug}`);
const ctaHref = "/upload?plan=free&utm_source=article&utm_medium=referral&utm_campaign=invisible_resume";

export const metadata: Metadata = {
  title: "You May Be Qualified. So Why Does Your Resume Feel Invisible?",
  description: "Your experience may be stronger than your resume makes clear. Use this practical pre-application check to make the most relevant evidence easier to find.",
  alternates: { canonical: `/insights/${slug}` },
  openGraph: {
    type: "article",
    url: articleUrl,
    title: "You May Be Qualified. So Why Does Your Resume Feel Invisible?",
    description: "A practical pre-application check for early-career job seekers.",
    images: ["/opengraph-image"]
  },
  twitter: {
    card: "summary_large_image",
    title: "You May Be Qualified. So Why Does Your Resume Feel Invisible?",
    description: "A practical pre-application check for early-career job seekers.",
    images: ["/opengraph-image"]
  }
};

export default function InvisibleResumeArticlePage() {
  return (
    <>
      <BreadcrumbJsonLd label="You May Be Qualified. So Why Does Your Resume Feel Invisible?" path={`/insights/${slug}`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "You May Be Qualified. So Why Does Your Resume Feel Invisible?",
          description: "A practical pre-application check for early-career job seekers.",
          mainEntityOfPage: articleUrl,
          url: articleUrl,
          datePublished: "2026-08-02",
          dateModified: "2026-08-02",
          author: { "@type": "Organization", name: "ResuNexx", url: siteUrl },
          publisher: { "@type": "Organization", name: "ResuNexx", url: siteUrl }
        }}
      />
      <LegalPage eyebrow="ResuNexx / Career Guide" title="You May Be Qualified. So Why Does Your Resume Feel Invisible?">
        <article className="max-w-3xl text-white/75">
          <p className="text-base leading-8 text-white/85">You can have real experience, useful skills, and a good reason for applying—and still open your resume and wonder why it does not seem to say any of that.</p>
          <p className="leading-7">That feeling is discouraging. It does not automatically mean your experience is weak. Sometimes the problem is simpler: the page makes a reader work too hard to see what you have done, what you can do next, and why it matters for this role.</p>
          <p className="leading-7">Before you apply again, take five minutes to check the signal your resume is sending. Not to make it perfect. Just to make the important evidence easier to find.</p>

          <div className="mt-12 space-y-10">
            <section aria-labelledby="why-this-happens">
              <h2 id="why-this-happens" className="text-2xl font-semibold text-[#f3f0e9]">Why this happens</h2>
              <div className="mt-4 space-y-4 leading-7">
                <p>Early-career resumes often become lists of duties. That makes sense. When you are still building confidence, it can feel safer to write down what you were assigned than to explain how you contributed.</p>
                <p>But a list of duties can leave the reader with the outline of your work and not much sense of the person doing it. They can see that you updated records or helped customers, but not necessarily the care, judgment, or follow-through involved.</p>
                <p>Formatting can make that gap wider. CareerOneStop recommends a clean, consistent layout with standard section headings and readable spacing. It also recommends a simple single-column layout and cautions that some applicant tracking systems may scramble content in tables, text boxes, logos, columns, images, and graphics. These choices do not measure your ability. They can, however, make your relevant evidence harder to locate. <a className="text-[#d7ff4f] underline decoration-[#d7ff4f]/40 underline-offset-4 hover:text-[#f3f0e9]" href="https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" rel="noreferrer">CareerOneStop’s formatting guide</a></p>
              </div>
            </section>

            <section aria-labelledby="what-to-check">
              <h2 id="what-to-check" className="text-2xl font-semibold text-[#f3f0e9]">What to check before you apply</h2>
              <div className="mt-4 space-y-4 leading-7">
                <p>Start at the top. Can a reader quickly tell the kind of work you are aiming for? A clear job title or short, job-relevant headline can give the rest of the resume a frame. CareerOneStop recommends using the top section to identify your focus and, where appropriate, a summary that highlights skills and accomplishments relevant to the job. <a className="text-[#d7ff4f] underline decoration-[#d7ff4f]/40 underline-offset-4 hover:text-[#f3f0e9]" href="https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/top-portion-of-resume.aspx" rel="noreferrer">CareerOneStop’s top-section guide</a></p>
                <p>Then read your first few bullets. Are they only broad labels—“helped with,” “worked on,” “responsible for”—or do they show an action in context? You do not need to manufacture numbers or turn every task into a dramatic result. A more useful question is: what did you actually do, for whom or in what setting, and what did that work help the team do?</p>
                <p>Now look at the page as a document. Are the section headings easy to spot? Is the spacing consistent? Is the most relevant information visible without asking a reader to navigate a busy design? Keep the layout simple, then open the version you plan to send and make sure it is readable in that format.</p>
                <p>Finally, read it like someone who has never met you. After a quick first pass, what would they say you are ready to do? If the answer is fuzzy, start there. CareerOneStop advises candidates with limited experience to emphasise skills, tasks, and outcomes that relate to the target job. <a className="text-[#d7ff4f] underline decoration-[#d7ff4f]/40 underline-offset-4 hover:text-[#f3f0e9]" href="https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" rel="noreferrer">CareerOneStop’s work-experience guide</a></p>
              </div>
            </section>

            <section aria-labelledby="concrete-example">
              <h2 id="concrete-example" className="text-2xl font-semibold text-[#f3f0e9]">A concrete example</h2>
              <div className="mt-4 rounded-2xl border border-[#d7ff4f]/30 bg-[#d7ff4f]/[0.08] p-6 text-[#f3f0e9]">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7ff4f]">Illustrative example</p>
                <blockquote className="mt-4 border-l-2 border-[#d7ff4f] pl-4 leading-7 text-white/80">Responsible for helping customers and updating records.</blockquote>
                <blockquote className="mt-4 border-l-2 border-white/40 pl-4 leading-7">Answered customer questions, updated account records, and flagged recurring issues for the team.</blockquote>
                <p className="mt-4 text-sm leading-6 text-white/70">This does not add a made-up metric or claim a promotion. It simply gives the work a clearer shape. The reader can see communication, record accuracy, and problem recognition without being asked to guess.</p>
              </div>
            </section>

            <section aria-labelledby="still-hear-nothing">
              <h2 id="still-hear-nothing" className="text-2xl font-semibold text-[#f3f0e9]">If you still hear nothing</h2>
              <div className="mt-4 space-y-4 leading-7">
                <p>Do not treat every quiet application as proof that your resume is the only problem. The role may not match your current experience. The application may ask for something specific. The examples on your resume may not be the ones most connected to the posting.</p>
                <p>Instead of rewriting everything after every quiet result, keep a short note: the role, the resume version you used, and the experience you wanted the employer to notice. Over time, that gives you something concrete to review. It is more useful than trying to remember what changed from one application to the next.</p>
              </div>
            </section>

            <section aria-labelledby="practical-takeaway">
              <h2 id="practical-takeaway" className="text-2xl font-semibold text-[#f3f0e9]">The practical takeaway</h2>
              <div className="mt-4 space-y-4 leading-7">
                <p>Your resume does not have to tell your whole story. It has to make the most relevant parts of your story understandable.</p>
                <p>Before you apply again, check whether your target is clear, replace vague duty statements with specific actions, simplify anything that hides the page’s structure, and read the document from a stranger’s point of view.</p>
              </div>
            </section>
          </div>

          <section className="mt-12 border-t border-white/15 pt-9" aria-labelledby="article-cta">
            <h2 id="article-cta" className="text-2xl font-semibold text-[#f3f0e9]">Don’t Apply Blind — Get Your Free ResuNexx Resume Preview</h2>
            <p className="mt-3 leading-7 text-white/70">See the evidence your resume may be burying before you send it.</p>
            <Link href={ctaHref} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-[#d7ff4f] px-5 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">Get Your Free ResuNexx Resume Preview <span className="ml-2">↗</span></Link>
          </section>

          <section className="mt-12 border-t border-white/15 pt-9" aria-labelledby="article-sources">
            <h2 id="article-sources" className="text-lg font-semibold text-[#f3f0e9]">Sources</h2>
            <ul className="mt-4 grid gap-2 text-sm leading-6">
              <li><a className="text-[#d7ff4f] underline decoration-[#d7ff4f]/40 underline-offset-4 hover:text-[#f3f0e9]" href="https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" rel="noreferrer">CareerOneStop: Formatting</a></li>
              <li><a className="text-[#d7ff4f] underline decoration-[#d7ff4f]/40 underline-offset-4 hover:text-[#f3f0e9]" href="https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/top-portion-of-resume.aspx" rel="noreferrer">CareerOneStop: Top section</a></li>
              <li><a className="text-[#d7ff4f] underline decoration-[#d7ff4f]/40 underline-offset-4 hover:text-[#f3f0e9]" href="https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" rel="noreferrer">CareerOneStop: Work experience</a></li>
            </ul>
          </section>
        </article>
      </LegalPage>
    </>
  );
}
