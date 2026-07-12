import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { ResumeUploadForm } from "@/components/resume-upload-form";
import styles from "./upload.module.css";

export default function UploadPage() {
  return (
    <main className={`${styles.page} resunexx-dark-page`}>
      <nav className={styles.nav} aria-label="ResuNexx navigation">
        <Link href="/" className={styles.logo}><span className={styles.logoMark}>R</span>ResuNexx</Link>
        <div className={styles.navLinks}><Link href="/">Home</Link><Link href="/privacy">Privacy</Link></div>
        <Link href="/" className={styles.backLink}>Back <span>↗</span></Link>
      </nav>
      <div className={styles.grid} aria-hidden="true" />
      <section className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>RESUNEXX / RECRUITER LENS</p>
          <h1>Show recruiters<br />your <em>signal.</em></h1>
          <p className={styles.support}>Upload your resume and get a recruiter-style free preview before you decide what to improve.</p>
          <p className={styles.fileNote}>PDF / DOCX <i /> Up to 4MB <i /> No signup required</p>
        </div>
        <div className={styles.formArea}>
          <ResumeUploadForm theme="dark" />
          <div className={styles.disclaimer}><Disclaimer /></div>
        </div>
      </section>
    </main>
  );
}
