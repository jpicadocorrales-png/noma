import { BOOKING_LABELS, type Trip } from '../../data/trips';
import { StatusPill } from '../ui/StatusPill';
import { bookingTotals, dayDate } from '../../state/TripsProvider';
import { formatFullDay } from '../../lib/dates';
import { formatMoney } from '../../lib/money';
import styles from './BookingsView.module.css';

export function BookingsView({ trip }: { trip: Trip }) {
  const totals = bookingTotals(trip);
  const days = [...new Set(trip.bookings.map((b) => b.dayIndex))].sort((a, b) => a - b);

  return (
    <div className={styles.view}>
      <div className={styles.summary}>
        <p className={styles.summaryText}>
          <strong>{totals.confirmed}</strong> of {totals.total} bookings confirmed
        </p>
        {totals.pending > 0 && <StatusPill tone="pending">{totals.pending} pending</StatusPill>}
      </div>

      {days.map((dayIndex) => {
        const date = dayDate(trip, dayIndex);
        const bookings = trip.bookings.filter((b) => b.dayIndex === dayIndex);
        return (
          <section key={dayIndex} aria-labelledby={`bookings-day-${dayIndex}`} className={styles.group}>
            <h2 id={`bookings-day-${dayIndex}`} className={`t-meta ${styles.groupTitle}`}>
              Day {String(dayIndex + 1).padStart(2, '0')}
              {date && ` · ${formatFullDay(date)}`}
            </h2>
            <ul className={styles.list}>
              {bookings.map((b) => (
                <li key={b.id} className={styles.card}>
                  <div className={styles.when}>
                    <span className={styles.time}>{b.time}</span>
                    <span className={`t-meta ${styles.kind}`}>{BOOKING_LABELS[b.kind]}</span>
                  </div>
                  <div className={styles.main}>
                    <div className={styles.head}>
                      <h3 className={styles.title}>{b.title}</h3>
                      <StatusPill tone={b.status === 'confirmed' ? 'confirmed' : 'pending'}>
                        {b.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </StatusPill>
                    </div>
                    <p className={styles.provider}>{b.provider}</p>
                    <p className={styles.detail}>{b.detail}</p>
                    <div className={styles.foot}>
                      <span className={styles.ref}>
                        <span className="t-meta">Ref</span> {b.reference}
                      </span>
                      <span className={styles.amount}>{b.amount > 0 ? formatMoney(b.amount) : 'Included'}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
