import { BOOKING_LABELS, BOOKING_STATUS, type Trip } from '../../data/trips';
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
        <div className={styles.summaryMain}>
          <p className={styles.summaryText}>
            <strong>{totals.booked}</strong> of {totals.total} booked
          </p>
          <p className={styles.summaryMoney}>
            {formatMoney(totals.amountPaid)} paid
            {totals.amountDue > 0 && ` · ${formatMoney(totals.amountDue)} to pay on the trip`}
          </p>
        </div>
        <div className={styles.summaryPills}>
          {totals.paid > 0 && <StatusPill tone="paid">{totals.paid} paid</StatusPill>}
          {totals.reserved > 0 && <StatusPill tone="reserved">{totals.reserved} reserved</StatusPill>}
          {totals.pending > 0 && <StatusPill tone="pending">{totals.pending} pending</StatusPill>}
        </div>
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
              {bookings.map((b) => {
                const status = BOOKING_STATUS[b.status];
                return (
                  <li key={b.id} className={styles.card}>
                    <div className={styles.when}>
                      <span className={styles.time}>{b.time}</span>
                      <span className={`t-meta ${styles.kind}`}>{BOOKING_LABELS[b.kind]}</span>
                    </div>
                    <div className={styles.main}>
                      <div className={styles.head}>
                        <h3 className={styles.title}>{b.title}</h3>
                        <StatusPill tone={status.tone}>{status.label}</StatusPill>
                      </div>
                      <p className={styles.provider}>{b.provider}</p>
                      <p className={styles.detail}>{b.detail}</p>
                      <div className={styles.foot}>
                        <span className={styles.ref}>
                          {b.reference ? (
                            <>
                              <span className="t-meta">Ref</span> {b.reference}
                            </>
                          ) : (
                            'Not booked yet'
                          )}
                        </span>
                        <span className={styles.amount}>
                          {b.amount > 0 ? formatMoney(b.amount) : 'Included'}
                          {b.status === 'reserved' && b.payment && <span className={styles.payment}>{b.payment}</span>}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
