import { CATEGORY_LABELS, type Activity, type Booking } from '../../data/trips';
import { Icon } from '../ui/Icon';
import { StatusPill } from '../ui/StatusPill';
import { cx } from '../../lib/cx';
import styles from './ActivityRow.module.css';

interface ActivityRowProps {
  activity: Activity;
  booking?: Booking;
  done: boolean;
  isLast: boolean;
  onToggle: () => void;
}

export function ActivityRow({ activity: a, booking, done, isLast, onToggle }: ActivityRowProps) {
  return (
    <li className={cx(styles.row, done && styles.done, isLast && styles.last)}>
      <time className={styles.time}>{a.time}</time>

      <div className={styles.rail}>
        <button
          type="button"
          className={styles.check}
          aria-pressed={done}
          aria-label={done ? `Mark “${a.title}” as not done` : `Mark “${a.title}” as done`}
          onClick={onToggle}
        >
          <Icon name="check" size={14} strokeWidth={2.2} />
        </button>
      </div>

      <div className={styles.content}>
        <p className={`t-meta ${styles.category}`}>
          {CATEGORY_LABELS[a.category]}
          {a.duration && <span className={styles.duration}> · {a.duration}</span>}
        </p>
        <h3 className={styles.title}>{a.title}</h3>
        <p className={styles.place}>{a.place}</p>

        {a.note && <p className={styles.note}>{a.note}</p>}

        {booking && (
          <StatusPill tone={booking.status === 'confirmed' ? 'confirmed' : 'pending'} className={styles.booking}>
            {booking.status === 'confirmed' ? `Booked · ${booking.reference}` : 'Booking pending'}
          </StatusPill>
        )}

        {a.transit && !isLast && <p className={`t-meta ${styles.transit}`}>{a.transit}</p>}
      </div>
    </li>
  );
}
