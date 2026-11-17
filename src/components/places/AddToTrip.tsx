import { useState } from 'react';
import { cityName, tripCovers, type Place } from '../../data/places';
import { dayDate, tripStatus, useTrips } from '../../state/TripsProvider';
import { useAssistant } from '../assistant/AssistantProvider';
import { Button, ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { formatFullDay, formatWeekday } from '../../lib/dates';
import { cx } from '../../lib/cx';
import styles from './AddToTrip.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/** Add a place to a matching trip: a specific day when the trip has a plan, or the trip idea otherwise. */
export function AddToTrip({ place }: { place: Place }) {
  const { trips, today, placement, addPlace, removePlace } = useTrips();
  const assistant = useAssistant();
  const city = cityName(place);

  const current = placement(place.id);
  const currentTrip = current && trips.find((t) => t.id === current.tripId);
  const trip = trips.find((t) => tripCovers(t.id, place.destinationId) && tripStatus(t, today) !== 'past');
  const [day, setDay] = useState(0);

  if (current && currentTrip) {
    const d = current.dayIndex;
    const date = d !== null ? dayDate(currentTrip, d) : null;
    return (
      <div className={cx(styles.box, styles.added)} aria-live="polite">
        <p className={styles.addedTitle}>
          <span className={styles.tick} aria-hidden="true">
            <Icon name="check" size={14} strokeWidth={2.4} />
          </span>
          {d !== null ? `On your ${currentTrip.name} trip` : `Added to your ${currentTrip.name} idea`}
        </p>
        {d !== null && (
          <p className={styles.addedBody}>
            Day {pad(d + 1)}
            {date && ` · ${formatFullDay(date)}`} at {place.time}
          </p>
        )}
        <div className={styles.row}>
          <ButtonLink
            to={d !== null ? `/trips/${currentTrip.id}?day=${d + 1}` : `/trips/${currentTrip.id}`}
            size="sm"
            iconRight="arrow-right"
          >
            {d !== null ? 'View in itinerary' : 'Open trip'}
          </ButtonLink>
          <Button size="sm" variant="secondary" onClick={() => removePlace(place.id)}>
            Remove
          </Button>
        </div>
      </div>
    );
  }

  if (trip && trip.days.length > 0) {
    return (
      <div className={styles.box}>
        <p className={styles.label}>Add to your {trip.name} trip</p>
        <div role="radiogroup" aria-label="Choose a day" className={styles.days}>
          {trip.days.map((tripDay, i) => {
            const date = dayDate(trip, i);
            return (
              <button
                key={tripDay.id}
                type="button"
                role="radio"
                aria-checked={day === i}
                className={cx(styles.day, day === i && styles.daySelected)}
                onClick={() => setDay(i)}
              >
                <span className={styles.dayNum}>Day {pad(i + 1)}</span>
                <span className={styles.dayDate}>{date ? `${formatWeekday(date)} ${date.getDate()}` : ''}</span>
              </button>
            );
          })}
        </div>
        <p className={styles.hint}>
          {trip.days[day].title}. NOMA will slot it in at {place.time}, for about {place.duration}.
        </p>
        <Button iconLeft="plus" onClick={() => addPlace({ placeId: place.id, tripId: trip.id, dayIndex: day })}>
          Add to Day {pad(day + 1)}
        </Button>
      </div>
    );
  }

  if (trip) {
    return (
      <div className={styles.box}>
        <p className={styles.label}>Your {trip.name} trip has no dates yet</p>
        <p className={styles.hint}>Keep it with the trip idea, and NOMA will place it when you plan the days.</p>
        <Button iconLeft="plus" onClick={() => addPlace({ placeId: place.id, tripId: trip.id, dayIndex: null })}>
          Add to {trip.name} idea
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.box}>
      <p className={styles.label}>No trip to {city} yet</p>
      <p className={styles.hint}>Start one with NOMA and this place will be part of the plan.</p>
      <Button onClick={() => assistant.open(`Plan a trip to ${city} that includes ${place.name}`)}>
        Plan a trip to {city}
      </Button>
    </div>
  );
}
