import { cx } from '../../lib/cx';
import styles from './RouteLine.module.css';

interface RouteLineProps {
  stops: string[];
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * A quiet itinerary line: origin → stops → destination.
 * The final stop carries the only accent dot.
 */
export function RouteLine({ stops, tone = 'dark', className }: RouteLineProps) {
  return (
    <ol className={cx(styles.route, styles[tone], className)} aria-label={`Route: ${stops.join(', ')}`}>
      {stops.map((stop, i) => (
        <li
          key={stop}
          className={cx(
            styles.stop,
            i === 0 && styles.first,
            i === stops.length - 1 && styles.last,
          )}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.label}>{stop}</span>
        </li>
      ))}
    </ol>
  );
}
