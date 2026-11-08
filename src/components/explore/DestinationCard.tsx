import { Link } from 'react-router';
import { Photo } from '../ui/Photo';
import { SaveButton } from '../ui/SaveButton';
import { cx } from '../../lib/cx';
import styles from './DestinationCard.module.css';

export interface DestinationCardData {
  id: string;
  name: string;
  location: string;
  note: string;
  photo: { id: string; alt: string; focus?: string };
}

interface DestinationCardProps {
  destination: DestinationCardData;
  /** Shows a rank badge (01, 02…) when provided. */
  index?: number;
  /** Fill the grid cell instead of the fixed rail width. */
  fluid?: boolean;
}

export function DestinationCard({ destination: d, index, fluid }: DestinationCardProps) {
  return (
    <article className={cx(styles.card, fluid && styles.fluid)}>
      <div className={styles.media}>
        <Photo
          id={d.photo.id}
          alt={d.photo.alt}
          focus={d.photo.focus}
          sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
          maxWidth={1280}
          className={styles.photo}
        />
        {index !== undefined && (
          <span className={`t-meta ${styles.rank}`} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <SaveButton itemId={d.id} placeName={d.name} className={styles.save} />
      </div>

      <div className={styles.body}>
        <p className={`t-meta ${styles.location}`}>{d.location}</p>
        <h3 className={styles.name}>
          {/* Stretched link: the whole card is clickable, the save button stays separate */}
          <Link to={`/destinations/${d.id}`} className={styles.link}>
            {d.name}
          </Link>
        </h3>
        <p className={styles.note}>{d.note}</p>
      </div>
    </article>
  );
}
