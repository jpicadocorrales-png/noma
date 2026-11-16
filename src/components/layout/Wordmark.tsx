import { Link } from 'react-router';
import { cx } from '../../lib/cx';
import styles from './Wordmark.module.css';

interface WordmarkProps {
  /** Letter height in px. 24–28 reads well in the app header. */
  size?: number;
  /** Use on the dark forest background. */
  inverse?: boolean;
}

/** NOMA logotype: Bricolage Grotesque 800, lowercase, ending on the terracotta dot. */
export function Wordmark({ size = 26, inverse = false }: WordmarkProps) {
  return (
    <Link
      to="/"
      aria-label="NOMA home"
      className={cx(styles.wordmark, inverse && styles.inverse)}
      style={{ fontSize: `${size}px` }}
    >
      noma
      <span className={styles.dot} aria-hidden="true" />
    </Link>
  );
}
