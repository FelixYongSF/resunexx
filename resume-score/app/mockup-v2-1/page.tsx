import Link from "next/link";
import styles from "./mockup-v2-1.module.css";

const outcomes = [
  ["01", "WHAT RECRUITERS NOTICE", "in the first few seconds."],
  ["02", "WHAT MAY BE HOLDING YOU BACK", "from the next interview."],
  ["03", "WHAT TO IMPROVE FIRST", "to make your resume more competitive."],
];

const signals = [
  ["01", "ATS READABILITY", "Can hiring systems read the essentials?"],
  ["02", "CAREER IMPACT", "Are your results visible, specific, and credible?"],
  ["03", "ROLE MATCH", "Does your experience match what the role is looking for?"],
  ["04", "STRUCTURE & CLARITY", "Can recruiters understand your story quickly?"],
  ["05", "PROFESSIONAL PRESENTATION", "Does your resume feel polished, focused, and credible?"],
];

const deliverables = [
  "Your strongest signal",
  "Your biggest opportunity",
  "Three high-impact improvements",
  "A suggested rewrite",
  "A 30-minute action plan",
];

export default function MockupV21Page() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="ResuNexx experimental navigation">
        <Link href="/" className={styles.logo}><span className={styles.logoMark}>R</span>ResuNexx</Link>
        <div className={styles.navLinks}>
          <a href="#read">The read</a>
          <a href="#signals">Signals</a>
          <a href="#next-steps">Next steps</a>
        </div>
        <Link href="/upload" className={styles.navCta}>Start free <span>↗</span></Link>
      </nav>

      <section id="read" className={styles.readSection}>
        <div className={styles.sectionLabel}>[ THE RECRUITER READ ]</div>
        <div className={styles.readHeader}>
          <div>
            <h1>What recruiters<br /><span>see first.</span></h1>
            <p>Three answers before you apply again.</p>
          </div>
          <Link href="/upload" className={styles.readCta}>Analyze my resume <span>↗</span></Link>
        </div>
        <div className={styles.outcomeList}>
          {outcomes.map(([number, title, copy]) => (
            <article className={styles.outcomeRow} key={number}>
              <span className={styles.number}>{number}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
              <span className={styles.arrow}>↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="signals" className={styles.signalSection}>
        <div className={styles.sectionLabel}>[ HOW WE EVALUATE ]</div>
        <div className={styles.signalHeader}>
          <h2>Five signals.<br /><span>One clear read.</span></h2>
          <p>Together, these signals show whether your resume is easy to find, easy to understand, and strong enough to move forward.</p>
        </div>
        <div className={styles.signalGrid}>
          {signals.map(([number, title, copy]) => (
            <article className={styles.signalCard} key={number}>
              <span className={styles.cardNumber}>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="next-steps" className={styles.nextSection}>
        <div className={styles.sectionLabel}>[ WHAT YOU GET ]</div>
        <div className={styles.nextHeader}>
          <h2>From signals<br /><span>to clear next steps.</span></h2>
          <p>The paid report turns a recruiter-style read into a focused plan you can use before your next application.</p>
        </div>
        <div className={styles.deliverableFrame}>
          <div className={styles.frameTop}><span>YOUR IMPROVEMENT PLAN</span><span>RESUNEXX / 01</span></div>
          <div className={styles.deliverableList}>
            {deliverables.map((item, index) => (
              <div className={styles.deliverable} key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
                <span>↗</span>
              </div>
            ))}
          </div>
        </div>
        <Link href="/upload" className={styles.finalCta}>Analyze my resume <span>↗</span></Link>
      </section>
    </main>
  );
}
