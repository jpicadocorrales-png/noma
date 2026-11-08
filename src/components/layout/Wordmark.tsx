import styles from './Wordmark.module.css';

export function Wordmark() {
  return (
    <a href="#" className={styles.wordmark} aria-label="NOMA home">
      NOMA
      <span className={styles.dot} aria-hidden="true" />
    </a>
  );
}
