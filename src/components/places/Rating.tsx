import { Icon } from '../ui/Icon';
import { formatCount } from '../../data/places';
import { cx } from '../../lib/cx';
import styles from './Rating.module.css';

interface RatingProps {
  rating: number;
  count?: number;
  className?: string;
}

/** "★ 4.7 (1,284)" */
export function Rating({ rating, count, className }: RatingProps) {
  return (
    <span className={cx(styles.rating, className)}>
      <Icon name="star" size={14} filled className={styles.star} />
      <span className={styles.value}>{rating.toFixed(1)}</span>
      {count !== undefined && <span className={styles.count}>({formatCount(count)})</span>}
      <span className="visually-hidden">
        {` out of 5${count !== undefined ? `, from ${formatCount(count)} reviews` : ''}`}
      </span>
    </span>
  );
}

/** Five stars for a single review. */
export function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" size={13} filled={n <= value} className={n <= value ? styles.on : styles.off} />
      ))}
    </span>
  );
}
