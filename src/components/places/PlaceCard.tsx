import { Link } from 'react-router';
import { cityName, type Place } from '../../data/places';
import { Photo } from '../ui/Photo';
import { SaveButton } from '../ui/SaveButton';
import { Icon } from '../ui/Icon';
import { Rating } from './Rating';
import { useTrips } from '../../state/TripsProvider';
import { cx } from '../../lib/cx';
import styles from './PlaceCard.module.css';

interface PlaceCardProps {
  place: Place;
  /** Why this place is suggested, e.g. "For your Kyoto trip". */
  reason?: string;
  /** Fixed-width card for horizontal rails. */
  inRail?: boolean;
  /** Hide the review quote for denser lists. */
  compact?: boolean;
}

export function PlaceCard({ place, reason, inRail, compact }: PlaceCardProps) {
  const { trips, placement } = useTrips();
  const added = placement(place.id);
  const addedTrip = added && trips.find((t) => t.id === added.tripId);
  const quote = place.reviews[0];

  return (
    <article className={cx(styles.card, inRail && styles.rail)}>
      <div className={styles.media}>
        <Photo
          id={place.photo.id}
          alt={place.photo.alt}
          focus={place.photo.focus}
          sizes={inRail ? '280px' : '(min-width: 1320px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw'}
          maxWidth={1280}
          className={styles.photo}
        />
        {addedTrip ? (
          <span className={cx(styles.badge, styles.badgeAdded)}>
            <Icon name="check" size={12} strokeWidth={2.4} />
            On your {addedTrip.name} {addedTrip.days.length ? 'trip' : 'idea'}
          </span>
        ) : (
          reason && <span className={styles.badge}>{reason}</span>
        )}
        <SaveButton itemId={place.id} placeName={place.name} className={styles.save} />
      </div>

      <div className={styles.body}>
        <p className={`t-meta ${styles.meta}`}>
          {place.type} · {place.price}
        </p>
        <h3 className={styles.name}>
          <Link to={`/places/${place.id}`} className={styles.link}>
            {place.name}
          </Link>
        </h3>
        <p className={styles.location}>
          <Icon name="pin" size={14} />
          {place.area}, {cityName(place)}
        </p>
        <Rating rating={place.rating} count={place.reviewCount} className={styles.rating} />
        {!compact && quote && (
          <blockquote className={styles.quote}>
            <p>“{quote.text}”</p>
            <footer>{quote.author}</footer>
          </blockquote>
        )}
      </div>
    </article>
  );
}
