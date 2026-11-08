import type { Interest } from '../../data/explore';
import { Photo } from '../ui/Photo';
import styles from './InterestCard.module.css';

interface InterestCardProps {
  interest: Interest;
}

export function InterestCard({ interest }: InterestCardProps) {
  return (
    <a href={`#interest-${interest.id}`} className={styles.card}>
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
        <span className={`t-meta ${styles.count}`}>{interest.count} places</span>
      </div>
    </a>
  );
}
