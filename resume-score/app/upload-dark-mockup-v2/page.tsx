import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { ResumeUploadForm } from "@/components/resume-upload-form";
import styles from "./upload-dark-mockup-v2.module.css";

export default function UploadDarkMockupV2Page() {
  return <main className={`${styles.page} resunexx-dark-page`}><div className={styles.grid} aria-hidden="true" /><nav className={styles.nav}><Link href="/mockup-v3-4" className={styles.logo}><span>R</span>ResuNexx</Link><Link href="/mockup-v3-4" className={styles.back}>Back <b>↗</b></Link></nav><section className={styles.content}><div className={styles.copy}><p className={styles.eyebrow}>RESUNEXX / RECRUITER LENS</p><h1><span>Show recruiters your</span><em>signal.</em></h1><p>Upload your resume and get a recruiter-style free preview before you decide what to improve.</p><div className={styles.meta}>PDF / DOCX <i /> Up to 4MB <i /> No signup required</div></div><div className={styles.formArea}><ResumeUploadForm theme="dark" /><Disclaimer /></div></section></main>;
}
