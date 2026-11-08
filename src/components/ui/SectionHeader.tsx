import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  /** Editorial sections use the serif; functional ones stay in Manrope. */
  tone?: 'functional' | 'editorial';
  actions?: ReactNode;
}

export function SectionHeader({ id, title, eyebrow, description, tone = 'functional', actions }: SectionHeaderProps) {
  return (
    <header className={cx(styles.header, styles[tone])}>
      <div className={styles.text}>
        {eyebrow && <p className={cx('t-eyebrow', styles.eyebrow)}>{eyebrow}</p>}
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
