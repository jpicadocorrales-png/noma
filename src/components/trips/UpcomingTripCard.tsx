import { Link } from 'react-router';
import type { Trip } from '../../data/trips';
import { Photo } from '../ui/Photo';
import { Icon } from '../ui/Icon';
import { StatusPill } from '../ui/StatusPill';
import { ProgressBar } from '../ui/ProgressBar';
import { bookingTotals, tripDates } from '../../state/TripsProvider';
import { daysBetween, formatCountdown, formatFullDay, formatRange } from '../../lib/dates';
import { dayDate } from '../../state/TripsProvider';
import styles from './UpcomingTripCard.module.css';

interface UpcomingTripCardProps {
  trip: Trip;
  today: Date;
}

export function UpcomingTripCard({ trip, today }: UpcomingTripCardProps) {
  const dates = tripDates(trip)!;
  const countdown = daysBetween(today, dates.start);
  const totals = bookingTotals(trip);
  const next = trip.bookings[0];
  const nextDate = next ? dayDate(trip, next.dayIndex) : null;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Photo
          id={trip.photo.id}
          alt={trip.photo.alt}
          focus={trip.photo.focus}
          sizes="(min-width: 1024px) 680px, 100vw"
          maxWidth={1800}
          className={styles.photo}
        />
        <StatusPill tone="accent" className={styles.countdown}>
          {formatCountdown(countdown)}
        </StatusPill>
      </div>

      <div className={styles.body}>
        <p className={`t-meta ${styles.location}`}>
          {trip.location} · {trip.region}
        </p>
        <h3 className={styles.name}>
          <Link to={`/trips/${trip.id}`} className={styles.link}>
            {trip.name}
          </Link>
        </h3>
        <p className={styles.dates}>
          {formatRange(dates.start, dates.end)} · {dates.length} days · {trip.travelers} travelers
        </p>

        <div className={styles.readiness}>
          <div className={styles.readinessHead}>
            <span>Bookings confirmed</span>
            <span className={styles.figure}>
              {totals.confirmed} / {totals.total}
            </span>
          </div>
          <ProgressBar value={totals.confirmed} max={totals.total} label="Bookings confirmed" />
        </div>

        {next && nextDate && (
          <div className={styles.next}>
            <p className={`t-meta ${styles.nextLabel}`}>Next up</p>
            <p className={styles.nextTitle}>{next.title}</p>
            <p className={styles.nextMeta}>
              {formatFullDay(nextDate)} · {next.time}
            </p>
          </div>
        )}

        <span className={styles.cta} aria-hidden="true">
          Open itinerary <Icon name="arrow-right" size={16} />
        </span>
      </div>
    </article>
  );
}
