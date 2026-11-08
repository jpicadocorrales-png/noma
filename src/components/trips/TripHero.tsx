import type { Trip } from '../../data/trips';
import { Photo } from '../ui/Photo';
import { StatusPill } from '../ui/StatusPill';
import { tripDates, tripStatus } from '../../state/TripsProvider';
import { daysBetween, formatCountdown, formatRange } from '../../lib/dates';
import styles from './TripHero.module.css';

interface TripHeroProps {
  trip: Trip;
  today: Date;
}

export function TripHero({ trip, today }: TripHeroProps) {
  const dates = tripDates(trip);
  const status = tripStatus(trip, today);
  const statusLabel =
    status === 'upcoming' && dates
      ? formatCountdown(daysBetween(today, dates.start))
      : status === 'ongoing'
        ? 'On the road'
        : status === 'past'
          ? 'Completed'
          : 'Idea';

  return (
    <header className={styles.hero}>
      <div className={styles.media}>
        <Photo
          id={trip.photo.id}
          alt={trip.photo.alt}
          focus={trip.photo.focus}
          sizes="(min-width: 1320px) 1224px, 100vw"
          priority
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <StatusPill tone="accent" className={styles.status}>
        {statusLabel}
      </StatusPill>

      <div className={styles.content}>
        <p className={`t-meta ${styles.location}`}>
          {trip.location}
          <span className={styles.sep} aria-hidden="true" />
          {trip.region}
        </p>
        <h1 className={styles.name}>{trip.name}</h1>
        <p className={styles.meta}>
          {dates ? `${formatRange(dates.start, dates.end)} · ${dates.length} days` : trip.tentative ?? 'Dates not set'}
          {` · ${trip.travelers} travelers`}
        </p>
      </div>
    </header>
  );
}
