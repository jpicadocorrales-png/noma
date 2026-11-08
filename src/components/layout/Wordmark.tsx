import { Link } from 'react-router';
import styles from './Wordmark.module.css';

export function Wordmark() {
  return (
    <Link to="/" className={styles.wordmark} aria-label="NOMA home">
      NOMA
      <span className={styles.dot} aria-hidden="true" />
    </Link>
  );
}
