import { cx } from '../../lib/cx';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  tone?: 'forest' | 'sage' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({ value, max, label, tone = 'forest', size = 'sm', className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cx(styles.track, styles[size], className)}
    >
      <span className={cx(styles.fill, styles[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}
