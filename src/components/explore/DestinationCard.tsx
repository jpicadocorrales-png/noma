import type { Destination } from '../../data/explore';
import { Photo } from '../ui/Photo';
import { SaveButton } from '../ui/SaveButton';
import styles from './DestinationCard.module.css';

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export function DestinationCard({ destination: d, index }: DestinationCardProps) {
  const rank = String(index + 1).padStart(2, '0');

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Photo
          id={d.photo.id}
          alt={d.photo.alt}
          focus={d.photo.focus}
          sizes="(min-width: 1024px) 300px, 260px"
          maxWidth={1280}
          className={styles.photo}
        />
        <span className={`t-meta ${styles.rank}`} aria-hidden="true">
          {rank}
        </span>
        <SaveButton placeName={d.name} className={styles.save} />
      </div>

      <div className={styles.body}>
        <p className={`t-meta ${styles.location}`}>{d.location}</p>
        <h3 className={styles.name}>
          {/* Stretched link: the whole card is clickable, the save button stays separate */}
          <a href={`#destination-${d.id}`} className={styles.link}>
            {d.name}
          </a>
        </h3>
        <p className={styles.note}>{d.note}</p>
      </div>
    </article>
  );
}
