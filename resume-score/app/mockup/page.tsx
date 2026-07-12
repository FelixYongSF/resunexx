import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./ogaki-mockup.module.css";

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
  ["01", "RECRUITER", "The first glance", "Understand what gets noticed before the scroll."],
  ["02", "SIGNALS", "The useful read", "See whether your strongest evidence is easy to find."],
  ["03", "NEXT MOVE", "The clear plan", "Leave with five changes you can actually make."],
];

export default function OgakiStyleMockupPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Mockup navigation">
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
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>RESUNEXX / RECRUITER LENS</p>
          <h1>See what<br />recruiters<br /><em>see.</em></h1>
          <div className={styles.heroBottom}>
            <Link href="/upload" className={styles.primaryCta}>
              <span>Analyze my resume</span>
              <small>Free / PDF or DOCX</small>
              <span>↗</span>
            </Link>
            <p>Upload first. Then see what recruiters may notice before you send it into the world.</p>
          </div>
        </div>
        <div className={styles.fallingType} aria-hidden="true">
          {fallingLetters.map(({ letter, ...motion }) => (
            <span
              key={letter}
              className={styles.fallingLetter}
              style={motion as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className={styles.heroIndex}>[ 01 — 04 ]</p>
        <p className={styles.scrollHint}>SCROLL TO READ YOURSELF BETTER <span>↓</span></p>
      </section>

      <section id="lens" className={styles.lensSection}>
        <div className={styles.sectionLabel}>[ THE LENS ]</div>
        <div className={styles.lensStatement}>
          <p>Most resumes are not missing potential.</p>
          <h2>They are missing<br /><span>clarity.</span></h2>
          <p className={styles.lensNote}>ResuNexx helps early-career candidates understand the signals a recruiter can find quickly — and the ones still hiding in the page.</p>
        </div>
      </section>

      <section id="signals" className={styles.signalSection}>
        <div className={styles.sectionLabel}>[ THREE READS ]</div>
        <div className={styles.signalIntro}>
          <h2>Less advice.<br /><span>More direction.</span></h2>
          <p>Recruiter-style feedback for the moment before you click apply.</p>
        </div>
        <div className={styles.signalList}>
          {signals.map(([number, label, title, description]) => (
            <article key={number} className={styles.signalRow}>
              <span className={styles.signalNumber}>{number}</span>
              <span className={styles.signalLabel}>{label}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className={styles.rowArrow}>↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="report" className={styles.reportSection}>
        <div className={styles.reportHeader}>
          <p className={styles.sectionLabel}>[ THE REPORT ]</p>
          <p className={styles.reportAside}>AI-ESTIMATED / NO SIGNUP / $4.99</p>
        </div>
        <div className={styles.reportFrame}>
          <div className={styles.reportTopline}><span>RECRUITER FIRST IMPRESSION</span><span>RESUNEXX / 01</span></div>
          <div className={styles.reportContent}>
            <p className={styles.reportSmall}>Strong potential.</p>
            <h2>The proof needs<br /><span>to arrive sooner.</span></h2>
            <div className={styles.scoreBlock}>
              <div><strong>68</strong><span>RESUME SCORE</span></div>
              <div><strong>74</strong><span>ATS READINESS</span></div>
              <div><strong>MED</strong><span>READINESS</span></div>
            </div>
          </div>
          <div className={styles.reportFooter}>
            <span>TOP PRIORITY</span>
            <p>Make your target role obvious in the first few seconds.</p>
            <span>↗</span>
          </div>
        </div>
        <Link href="/upload" className={styles.reportCta}>Get your recruiter read <span>↗</span></Link>
      </section>

      <section className={styles.finalSection}>
        <p className={styles.kicker}>RESUNEXX / YOUR NEXT APPLICATION</p>
        <h2>Make the next<br /><em>read</em> count.</h2>
        <Link href="/upload" className={styles.finalCta}>Analyze my resume — free <span>↗</span></Link>
        <p className={styles.disclaimer}>AI-estimated feedback. No guarantee of interviews or employment outcomes.</p>
      </section>
    </main>
  );
}
