import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./mockup-v3.module.css";

const fallingLetters = [
  { letter: "G", "--letter-left": "0%", "--letter-bottom": "18%", "--letter-delay": "0.08s", "--letter-drift": "-8vw", "--letter-start-rotate": "-32deg", "--letter-land-rotate": "-12deg", "--letter-roll": "-16px" },
  { letter: "E", "--letter-left": "13%", "--letter-bottom": "4%", "--letter-delay": "0.34s", "--letter-drift": "7vw", "--letter-start-rotate": "25deg", "--letter-land-rotate": "18deg", "--letter-roll": "12px" },
  { letter: "T", "--letter-left": "26%", "--letter-bottom": "13%", "--letter-delay": "0.62s", "--letter-drift": "-5vw", "--letter-start-rotate": "-14deg", "--letter-land-rotate": "-24deg", "--letter-roll": "-10px" },
  { letter: "J", "--letter-left": "39%", "--letter-bottom": "2%", "--letter-delay": "0.92s", "--letter-drift": "11vw", "--letter-start-rotate": "38deg", "--letter-land-rotate": "14deg", "--letter-roll": "18px" },
  { letter: "O", "--letter-left": "51%", "--letter-bottom": "17%", "--letter-delay": "0.48s", "--letter-drift": "-9vw", "--letter-start-rotate": "-24deg", "--letter-land-rotate": "22deg", "--letter-roll": "-13px" },
  { letter: "B", "--letter-left": "64%", "--letter-bottom": "7%", "--letter-delay": "1.14s", "--letter-drift": "6vw", "--letter-start-rotate": "18deg", "--letter-land-rotate": "-18deg", "--letter-roll": "14px" },
  { letter: "S", "--letter-left": "77%", "--letter-bottom": "12%", "--letter-delay": "0.78s", "--letter-drift": "-7vw", "--letter-start-rotate": "-38deg", "--letter-land-rotate": "11deg", "--letter-roll": "-15px" },
];

const signals = [
  ["01", "ATS READABILITY", "Can systems read the essentials?"],
  ["02", "CAREER IMPACT", "Are your results visible and specific?"],
  ["03", "ROLE MATCH", "Does your experience match the role?"],
  ["04", "STRUCTURE & CLARITY", "Can recruiters understand your story quickly?"],
  ["05", "PROFESSIONAL PRESENTATION", "Does your resume feel polished, focused, and credible?"],
];

const reportBlocks = [
  ["WHAT RECRUITERS NOTICE", "The strengths that make you stand out.", "acid"],
  ["WHAT THEY MISS", "The signals that may be holding you back.", "orange"],
  ["WHAT YOU SHOULD FIX", "The changes that improve your next application.", "paper"],
];

export default function MockupV3Page() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="ResuNexx prototype navigation">
        <Link href="/" className={styles.logo}><span className={styles.logoMark}>R</span>ResuNexx</Link>
        <div className={styles.navLinks}>
          <a href="#signals">Signals</a>
          <a href="#report">The report</a>
          <a href="#pricing">Pricing</a>
        </div>
        <Link href="/upload" className={styles.navCta}>Start free <span>↗</span></Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroLines} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>RESUNEXX / RECRUITER LENS</p>
          <h1>See what<br />recruiters<br /><em>see.</em></h1>
          <p className={styles.heroText}>Know what gets noticed.<br />Fix what gets ignored.</p>
          <Link href="/upload" className={styles.heroCta}>Analyze my resume <span>↗</span></Link>
          <p className={styles.meta}>Free preview <i /> PDF / DOCX</p>
        </div>

        <aside className={styles.uploadCard} aria-label="Resume upload prototype">
          <p className={styles.cardEyebrow}>START WITH YOUR RESUME</p>
          <h2>Upload PDF<br />or DOCX.</h2>
          <label className={styles.fileControl}>
            <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
            <span>Choose File</span><span>+</span>
          </label>
          <Link href="/upload" className={styles.uploadAction}>Analyze My Resume — Free <span>↗</span></Link>
          <p className={styles.cardMeta}>No signup <i /> Free preview <i /> PDF report</p>
        </aside>

        <div className={styles.heroLetters} aria-hidden="true">
          {fallingLetters.map(({ letter, ...motion }) => (
            <span key={letter} className={styles.fallingLetter} style={motion as CSSProperties}>{letter}</span>
          ))}
        </div>
        <p className={styles.heroIndex}>[ 01 — 03 ]</p>
      </section>

      <section id="signals" className={styles.signalsSection}>
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.sectionLabel}>[ HOW WE EVALUATE ]</p>
            <h2>Five signals.<br /><span>One clear read.</span></h2>
          </div>
          <p>Together, these signals show whether your resume is easy to find, easy to understand, and strong enough to move forward.</p>
        </div>
        <div className={styles.signalGrid}>
          {signals.map(([number, title, copy]) => (
            <article className={styles.signalCard} key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="report" className={styles.reportSection}>
        <div className={styles.storyHeader}>
          <div>
            <p className={styles.sectionLabel}>[ THE STORY ]</p>
            <h2>Your resume<br /><span>has a story.</span></h2>
          </div>
          <h3>Do you have<br /><em>what it takes?</em></h3>
        </div>

        <div className={styles.reportAndPricing}>
          <article className={styles.reportPreview}>
            <div className={styles.reportTopline}><span>RECRUITER FIRST IMPRESSION</span><span>RESUNEXX / 01</span></div>
            <div className={styles.reportSummary}>
              <p>Strong potential.</p>
              <h4>The proof needs to<br /><span>appear sooner.</span></h4>
            </div>
            <div className={styles.scoreGrid}>
              <div><span>RESUME SCORE</span><strong>68 <i>/ 100</i></strong></div>
              <div><span>ATS READINESS</span><strong>74</strong></div>
              <div><span>READINESS</span><strong>MEDIUM</strong></div>
            </div>
            <div className={styles.reportBlocks}>
              {reportBlocks.map(([label, copy, accent]) => (
                <div key={label}>
                  <i className={styles[accent]} />
                  <span>{label}</span>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </article>

          <aside id="pricing" className={styles.pricingPanel}>
            <div className={styles.priceCard}>
              <span>FREE PREVIEW</span>
              <strong>$0</strong>
              <ul><li>Resume score</li><li>ATS score</li><li>Top 3 issues</li></ul>
            </div>
            <div className={styles.priceCardPaid}>
              <span>FULL REPORT</span>
              <strong>$4.99</strong>
              <ul><li>Recruiter-style read</li><li>Five priority fixes</li><li>Suggested rewrite examples</li><li>Downloadable PDF report</li></ul>
            </div>
            <Link href="/upload" className={styles.pricingCta}>Analyze my resume <span>↗</span></Link>
          </aside>
        </div>
      </section>

      <footer className={styles.footer}>
        <div><p className={styles.footerBrand}>ResuNexx</p><p>AI-powered resume feedback for early-career job seekers.</p><a href="mailto:support@resunexx.com">support@resunexx.com</a></div>
        <nav><Link href="/pricing">Pricing</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund">Refund</Link><Link href="/contact">Contact</Link></nav>
      </footer>
    </main>
  );
}
