import { Link } from 'react-router';
import { SAVED_KIND_LABELS, type SavedItem } from '../../data/saved';
import { hasDestinationPage } from '../../data/destinations';
import { Photo } from '../ui/Photo';
import { SaveButton } from '../ui/SaveButton';
import { Icon } from '../ui/Icon';
import { formatSavedAgo } from '../../state/SavedProvider';
import { cx } from '../../lib/cx';
import styles from './SavedCard.module.css';

interface SavedCardProps {
  item: SavedItem;
  daysAgo: number;
  /** Larger image budget for the lead card. */
  lead?: boolean;
  onRemove: () => void;
  onPlan: () => void;
}

export function SavedCard({ item, daysAgo, lead, onRemove, onPlan }: SavedCardProps) {
  return (
    <article className={cx(styles.card, lead && styles.lead)}>
      <div className={styles.media}>
        <Photo
          id={item.photo.id}
          alt={item.photo.alt}
          focus={item.photo.focus}
          sizes={lead ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 320px, 50vw'}
          maxWidth={lead ? 1800 : 960}
          className={styles.photo}
        />
        <span className={`t-meta ${styles.kind}`}>{SAVED_KIND_LABELS[item.kind]}</span>
        <SaveButton
          itemId={item.id}
          placeName={item.name}
          className={styles.save}
          onToggle={(saved) => !saved && onRemove()}
        />
      </div>

      <div className={styles.body}>
        <p className={`t-meta ${styles.location}`}>{item.location}</p>
        <h3 className={styles.name}>
          {hasDestinationPage(item.id) ? (
            <Link to={`/destinations/${item.id}`} className={styles.nameLink}>
              {item.name}
            </Link>
          ) : (
            item.name
          )}
        </h3>
        <p className={styles.note}>{item.note}</p>
        <div className={styles.foot}>
          <span className={styles.when}>{formatSavedAgo(daysAgo)}</span>
          <button type="button" className={styles.plan} onClick={onPlan}>
            Add to a trip <Icon name="arrow-right" size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
