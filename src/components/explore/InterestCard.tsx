import { Link } from 'react-router';
import type { Interest } from '../../data/explore';
import { searchDestinations } from '../../data/destinations';
import { Photo } from '../ui/Photo';
import styles from './InterestCard.module.css';

interface InterestCardProps {
  interest: Interest;
}

export function InterestCard({ interest }: InterestCardProps) {
  // Real count from the destination guide, so it matches what Discover shows.
  const count = searchDestinations('', interest.id).length;
  return (
    <Link to={`/discover?interest=${interest.id}`} className={styles.card}>
      <div className={styles.media}>
        <Photo
          id={interest.photo.id}
          alt=""
          focus={interest.photo.focus}
          sizes="(min-width: 1024px) 240px, 160px"
          maxWidth={960}
          className={styles.photo}
        />
      </div>
      <div className={styles.overlay}>
        <span className={styles.label}>{interest.label}</span>
        <span className={`t-meta ${styles.count}`}>
          {count} {count === 1 ? 'destination' : 'destinations'}
        </span>
      </div>
    </Link>
  );
}
