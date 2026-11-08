import styles from './BrandNote.module.css';

/** Closing editorial statement for the Explore page. */
export function BrandNote() {
  return (
    <aside className={styles.note} aria-label="About NOMA">
      <p className={`t-meta ${styles.meta}`}>NOMA · Your AI-powered travel companion</p>
      <p className={styles.statement}>
        From the first idea <br className={styles.break} />
        to the final destination.
      </p>
    </aside>
  );
}
