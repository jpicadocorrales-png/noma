import { Link } from 'react-router';
import { SAVED_KIND_LABELS, type SavedItem } from '../../data/saved';
import { hasDestinationPage } from '../../data/destinations';
import { getPlace } from '../../data/places';
import { Photo } from '../ui/Photo';
import { SaveButton } from '../ui/SaveButton';
import { Icon } from '../ui/Icon';
import { Rating } from '../places/Rating';
import { formatSavedAgo } from '../../state/SavedProvider';
import { useTrips } from '../../state/TripsProvider';
import styles from './SavedCard.module.css';

interface SavedCardProps {
  item: SavedItem;
  daysAgo: number;
  onRemove: () => void;
  onPlan: () => void;
}

/** A compact saved row: thumbnail, what it is, and the next step. */
export function SavedCard({ item, daysAgo, onRemove, onPlan }: SavedCardProps) {
  const { trips, placement } = useTrips();
  const place = getPlace(item.id);
  const href = place ? `/places/${item.id}` : hasDestinationPage(item.id) ? `/destinations/${item.id}` : null;
  const added = place && placement(place.id);
  const addedTrip = added && trips.find((t) => t.id === added.tripId);

  return (
    <article className={styles.card}>
      <div className={styles.thumb}>
        <Photo
          id={item.photo.id}
          alt={item.photo.alt}
          focus={item.photo.focus}
          sizes="(min-width: 768px) 120px, 96px"
          maxWidth={640}
          className={styles.photo}
        />
      </div>

      <div className={styles.body}>
        <p className={`t-meta ${styles.meta}`}>
          {place ? place.type : SAVED_KIND_LABELS[item.kind]}
        </p>
        <h3 className={styles.name}>
          {href ? (
            <Link to={href} className={styles.link}>
              {item.name}
            </Link>
          ) : (
            item.name
          )}
        </h3>
        <p className={styles.location}>{item.location}</p>
        {place ? (
          <Rating rating={place.rating} count={place.reviewCount} className={styles.rating} />
        ) : (
          <p className={styles.note}>{item.note}</p>
        )}

        <div className={styles.foot}>
          <span className={styles.when}>{formatSavedAgo(daysAgo)}</span>
          {addedTrip ? (
            <span className={styles.onTrip}>
              <Icon name="check" size={13} strokeWidth={2.4} />
              On your {addedTrip.name} {addedTrip.days.length ? 'trip' : 'idea'}
            </span>
          ) : place ? (
            <Link to={`/places/${item.id}#plan`} className={styles.plan}>
              Add to a trip <Icon name="arrow-right" size={14} />
            </Link>
          ) : (
            <button type="button" className={styles.plan} onClick={onPlan}>
              Add to a trip <Icon name="arrow-right" size={14} />
            </button>
          )}
        </div>
      </div>

      <SaveButton
        itemId={item.id}
        placeName={item.name}
        variant="outline"
        className={styles.save}
        onToggle={(saved) => !saved && onRemove()}
      />
    </article>
  );
}
