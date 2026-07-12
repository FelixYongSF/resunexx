import MockupV31Page from "../mockup-v3-1/page";
import styles from "./mockup-v3-3.module.css";

export default function MockupV33Page() {
  return (
    <div className={styles.page}>
      <MockupV31Page />
    </div>
  );
}
