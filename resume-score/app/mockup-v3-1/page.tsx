"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./mockup-v3-1.module.css";

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

const insights = [
  ["WHAT RECRUITERS NOTICE", "The strengths that make you stand out.", "acid"],
  ["WHAT THEY MISS", "The signals that may be holding you back.", "orange"],
  ["WHAT YOU SHOULD FIX", "The changes that improve your next application.", "ink"],
];

function MockupV31Content({ enableMotion = false }: { enableMotion?: boolean }) {
  const pageRef = useRef<HTMLElement>(null);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    if (!enableMotion) return;

    const root = pageRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const counterTargets = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    const revealAll = () => revealTargets.forEach((target) => target.classList.add(styles.inView));

    if (reducedMotion) {
      setMotionReady(true);
      revealAll();
      return;
    }

    setMotionReady(true);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.classList.add(styles.inView);
          observer.unobserve(target);
        });
      },
      { threshold: 0.16 }
    );
    revealTargets.forEach((target) => observer.observe(target));

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const value = Number(target.dataset.count || "0");
          const start = performance.now();
          const duration = 620;
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            target.textContent = String(Math.round(value * eased));
            if (progress < 1) window.requestAnimationFrame(tick);
          };
          target.textContent = "0";
          window.requestAnimationFrame(tick);
          counterObserver.unobserve(target);
        });
      },
      { threshold: 0.55 }
    );
    counterTargets.forEach((target) => counterObserver.observe(target));

    return () => {
      observer.disconnect();
      counterObserver.disconnect();
    };
  }, [enableMotion]);

  return (
    <main ref={pageRef} className={[styles.page, "resunexx-dark-page", motionReady ? styles.motion : ""].filter(Boolean).join(" ")}>
      <nav className={styles.nav} data-reveal aria-label="ResuNexx prototype navigation">
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
          <p className={styles.kicker} data-reveal>RESUNEXX / RECRUITER LENS</p>
          <h1 data-reveal>See what<br />recruiters<br /><em>see.</em></h1>
          <p className={styles.heroText} data-reveal>Know what gets noticed.<br />Fix what gets ignored.</p>
          <Link href="/upload" className={styles.heroCta} data-reveal>Analyze my resume <span>↗</span></Link>
          <p className={styles.meta} data-reveal>Free preview <i /> PDF / DOCX</p>
        </div>
        <div className={styles.heroLetters} aria-hidden="true">
          {fallingLetters.map(({ letter, ...motion }) => (
            <span key={letter} className={styles.fallingLetter} style={motion as CSSProperties}>{letter}</span>
          ))}
        </div>
        <p className={styles.heroIndex}>[ 01 — 03 ]</p>
      </section>

      <section id="signals" className={styles.signalsSection}>
        <div className={styles.signalHeading}>
          <p className={styles.sectionLabel} data-reveal>[ HOW WE EVALUATE ]</p>
          <h2 data-reveal>Five signals.<br />One clear<br /><span>read.</span></h2>
          <p data-reveal>Together, these signals show whether your resume is easy to find, easy to understand, and strong enough to move forward.</p>
        </div>
        <div className={styles.signalGrid}>
          {signals.map(([number, title, copy], index) => (
            <article key={number} className={styles.signalCard} data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="report" className={styles.reportSection}>
        <div className={styles.storyHeader}>
          <p className={styles.sectionLabel} data-reveal>[ THE STORY ]</p>
          <h2 data-reveal>Your resume<br /><span>has a story.</span></h2>
          <p data-reveal>Does your resume show it?</p>
        </div>

        <div className={styles.reportAndPricing}>
          <article className={styles.reportDocument} data-reveal>
            <header className={styles.reportTopline}>
              <div><span>RECRUITER FIRST IMPRESSION</span><small>AI-ESTIMATED REPORT</small></div>
              <span>RESUNEXX / 01</span>
            </header>
            <div className={styles.reportSummary}>
              <p>Strong potential.</p>
              <h3>The proof needs to<br /><span>appear sooner.</span></h3>
            </div>
            <div className={styles.scoreRow}>
              <div><span>RESUME SCORE</span><strong><b data-count="68">68</b> <i>/ 100</i></strong></div>
              <div><span>ATS READINESS</span><strong><b data-count="74">74</b></strong></div>
              <div><span>READINESS</span><strong data-reveal>MEDIUM</strong></div>
            </div>
            <div className={styles.insightList}>
              {insights.map(([label, copy, color]) => (
                <section key={label}>
                  <i className={styles[color]} />
                  <div><span>{label}</span><p>{copy}</p></div>
                </section>
              ))}
            </div>
          </article>

          <aside id="pricing" className={styles.pricingPanel}>
            <div className={styles.priceCard} data-reveal style={{ "--reveal-delay": "0ms" } as CSSProperties}>
              <span>FREE PREVIEW</span><strong>$0</strong>
              <ul><li>Resume score</li><li>ATS score</li><li>Top 3 issues</li></ul>
              <Link href="/upload" className={styles.planCta}>Start free <span>↗</span></Link>
            </div>
            <div className={styles.priceCardPaid} data-reveal style={{ "--reveal-delay": "100ms" } as CSSProperties}>
              <span>STANDARD REPORT</span><strong>$4.99</strong>
              <ul><li>Everything in Free Preview</li><li>Recruiter-style read</li><li>Five priority fixes</li><li>Suggested rewrite examples</li><li>Downloadable Standard PDF report</li></ul>
              <Link href="/upload?plan=standard" className={styles.planCta}>Get Standard Report <span>↗</span></Link>
            </div>
            <div className={styles.priceCardFull} data-reveal style={{ "--reveal-delay": "200ms" } as CSSProperties}>
              <span>FULL REPORT</span><strong>$9.99</strong>
              <ul><li>Everything in Standard Report</li><li>Target-role match analysis</li><li>Missing keyword analysis</li><li>Rewritten professional summary</li><li>Five rewritten achievement bullets</li><li>30-minute action plan</li><li>Downloadable Full PDF report</li></ul>
              <Link href="/upload?plan=full" className={styles.planCta}>Get Full Report <span>↗</span></Link>
            </div>
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

export default function MockupV31Page() {
  return <MockupV31Content />;
}
