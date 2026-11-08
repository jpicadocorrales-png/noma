import type { Trip } from '../../data/trips';
import { ProgressBar } from '../ui/ProgressBar';
import { bookingTotals, budgetSummary, dayDate } from '../../state/TripsProvider';
import { formatFullDay } from '../../lib/dates';
import { formatMoney } from '../../lib/money';
import styles from './TripGlance.module.css';

/** Desktop sidebar: the essentials, always in view. */
export function TripGlance({ trip }: { trip: Trip }) {
  const totals = bookingTotals(trip);
  const budget = budgetSummary(trip);
  const pending = trip.bookings.filter((b) => b.status === 'pending');
  const next = trip.bookings[0];
  const nextDate = next ? dayDate(trip, next.dayIndex) : null;

  return (
    <aside className={styles.glance} aria-label="Trip at a glance">
      <p className={`t-eyebrow ${styles.heading}`}>At a glance</p>

      {next && nextDate && (
        <div className={styles.block}>
          <p className={`t-meta ${styles.label}`}>Next up</p>
          <p className={styles.value}>{next.title}</p>
          <p className={styles.sub}>
            {formatFullDay(nextDate)} · {next.time} · Ref {next.reference}
          </p>
        </div>
      )}

      <div className={styles.block}>
        <div className={styles.row}>
          <p className={`t-meta ${styles.label}`}>Bookings</p>
          <p className={styles.figure}>
            {totals.confirmed} / {totals.total}
          </p>
        </div>
        <ProgressBar value={totals.confirmed} max={totals.total} label="Bookings confirmed" />
        {pending.length > 0 && <p className={styles.sub}>Waiting on: {pending.map((p) => p.title).join(', ')}</p>}
      </div>

      {budget && (
        <div className={styles.block}>
          <div className={styles.row}>
            <p className={`t-meta ${styles.label}`}>Budget</p>
            <p className={styles.figure}>
              {formatMoney(budget.committed)} <span>/ {formatMoney(budget.planned)}</span>
            </p>
          </div>
          <ProgressBar value={budget.committed} max={budget.planned} label="Budget committed" />
          <p className={styles.sub}>{formatMoney(budget.remaining)} left to spend</p>
        </div>
      )}
    </aside>
  );
}
