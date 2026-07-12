import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./mockup-v2.module.css";

const recruiterReads = [
  ["01", "THE FIRST 5 SECONDS", "What recruiters notice", "before they decide."],
  ["02", "WHY YOU GET IGNORED", "Find what's blocking", "your next interview."],
  ["03", "FIX BEFORE YOU APPLY", "Know exactly what", "to improve next."],
];

const reportSections = [
  ["WHAT RECRUITERS NOTICE", "The strengths that make", "you stand out.", "#d7ff4f"],
  ["WHAT THEY MISS", "The signals that may be", "holding you back.", "#ff5a36"],
  ["WHAT YOU SHOULD FIX", "The changes that improve", "your next application.", "#f3f0e9"],
];

const fallingLetters = [
  { letter: "G", "--letter-left": "0%", "--letter-bottom": "18%", "--letter-delay": "0.08s", "--letter-drift": "-8vw", "--letter-start-rotate": "-32deg", "--letter-land-rotate": "-12deg", "--letter-roll": "-16px" },
  { letter: "E", "--letter-left": "13%", "--letter-bottom": "4%", "--letter-delay": "0.34s", "--letter-drift": "7vw", "--letter-start-rotate": "25deg", "--letter-land-rotate": "18deg", "--letter-roll": "12px" },
  { letter: "T", "--letter-left": "26%", "--letter-bottom": "13%", "--letter-delay": "0.62s", "--letter-drift": "-5vw", "--letter-start-rotate": "-14deg", "--letter-land-rotate": "-24deg", "--letter-roll": "-10px" },
  { letter: "J", "--letter-left": "39%", "--letter-bottom": "2%", "--letter-delay": "0.92s", "--letter-drift": "11vw", "--letter-start-rotate": "38deg", "--letter-land-rotate": "14deg", "--letter-roll": "18px" },
  { letter: "O", "--letter-left": "51%", "--letter-bottom": "17%", "--letter-delay": "0.48s", "--letter-drift": "-9vw", "--letter-start-rotate": "-24deg", "--letter-land-rotate": "22deg", "--letter-roll": "-13px" },
  { letter: "B", "--letter-left": "64%", "--letter-bottom": "7%", "--letter-delay": "1.14s", "--letter-drift": "6vw", "--letter-start-rotate": "18deg", "--letter-land-rotate": "-18deg", "--letter-roll": "14px" },
  { letter: "S", "--letter-left": "77%", "--letter-bottom": "12%", "--letter-delay": "0.78s", "--letter-drift": "-7vw", "--letter-start-rotate": "-38deg", "--letter-land-rotate": "11deg", "--letter-roll": "-15px" },
];

export default function MockupV2Page() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="ResuNexx test landing page navigation">
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>R</span>
          <span>ResuNexx</span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#lens">The lens</a>
          <a href="#signals">Signals</a>
          <a href="#report">The report</a>
        </div>
        <Link href="/upload" className={styles.navCta}>Start free <span>↗</span></Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroLines} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>RESUNEXX / RECRUITER LENS</p>
          <h1>See what<br />recruiters<br /><em>see.</em></h1>
          <div className={styles.heroAction}>
            <p>Know what gets noticed.<br />Fix what gets ignored.</p>
            <Link href="/upload" className={styles.primaryCta}>
              <span>Analyze my resume</span>
              <span>↗</span>
            </Link>
            <small>Free preview <i /> PDF / DOCX</small>
          </div>
        </div>
        <div className={styles.heroLetters} aria-hidden="true">
          {fallingLetters.map(({ letter, ...motion }) => (
            <span key={letter} className={styles.fallingLetter} style={motion as CSSProperties}>{letter}</span>
          ))}
        </div>
        <p className={styles.heroIndex}>[ 01 — 03 ]</p>
      </section>

      <section id="lens" className={styles.recruiterSection}>
        <div className={styles.sectionLabel}>[ THE RECRUITER READ ]</div>
        <div className={styles.recruiterHeader}>
          <h2>What recruiters<br /><span>see first.</span></h2>
          <p>Three answers before you apply again.</p>
        </div>
        <div className={styles.recruiterList}>
          {recruiterReads.map(([number, label, lineOne, lineTwo]) => (
            <article key={number} className={styles.recruiterItem}>
              <span className={styles.itemNumber}>{number}</span>
              <div>
                <p className={styles.itemLabel}>{label}</p>
                <h3>{lineOne}<br /><span>{lineTwo}</span></h3>
              </div>
              <span className={styles.itemArrow}>↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="signals" className={styles.storySection}>
        <div className={styles.sectionLabel}>[ THE STORY ]</div>
        <div className={styles.storyHeader}>
          <h2>Your resume<br /><span>has a story.</span></h2>
          <h3>Do you have<br /><em>what it takes?</em></h3>
        </div>
        <div id="report" className={styles.reportPreview}>
          <div className={styles.reportTopline}>
            <span>YOUR RESUME SCORE</span>
            <span>RESUNEXX / 01</span>
          </div>
          <div className={styles.scoreLine}>
            <strong>68</strong><span>/ 100</span>
          </div>
          <div className={styles.reportReads}>
            {reportSections.map(([label, lineOne, lineTwo, color]) => (
              <div key={label} className={styles.reportRead}>
                <span className={styles.readDot} style={{ backgroundColor: color }} />
                <p>{label}</p>
                <h4>{lineOne}<br /><span>{lineTwo}</span></h4>
              </div>
            ))}
          </div>
        </div>
        <Link href="/upload" className={styles.finalCta}>Analyze my resume <span>↗</span></Link>
      </section>
    </main>
  );
}
