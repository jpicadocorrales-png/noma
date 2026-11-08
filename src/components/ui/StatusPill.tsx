import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import styles from './StatusPill.module.css';

interface StatusPillProps {
  tone: 'confirmed' | 'pending' | 'neutral' | 'accent';
  children: ReactNode;
  className?: string;
}

export function StatusPill({ tone, children, className }: StatusPillProps) {
  return (
    <span className={cx(styles.pill, styles[tone], className)}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}
