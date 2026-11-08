import type { ReactNode } from 'react';
import type { Trip } from '../../data/trips';
import { Photo } from '../ui/Photo';
import { Icon } from '../ui/Icon';
import { cx } from '../../lib/cx';
import styles from './TripRow.module.css';

interface TripRowProps {
  trip: Trip;
  meta: string;
  detail: ReactNode;
  /** When provided, the row is an action (e.g. continue planning with NOMA). */
  onSelect?: () => void;
  actionLabel?: string;
}

/** Compact trip summary for ideas and past trips. */
export function TripRow({ trip, meta, detail, onSelect, actionLabel }: TripRowProps) {
  const content = (
    <>
      <div className={styles.thumb}>
        <Photo id={trip.photo.id} alt="" focus={trip.photo.focus} sizes="96px" maxWidth={400} />
      </div>
      <div className={styles.text}>
        <p className={`t-meta ${styles.meta}`}>{meta}</p>
        <p className={styles.name}>{trip.name}</p>
        <p className={styles.detail}>{detail}</p>
        {actionLabel && <span className={styles.action}>{actionLabel}</span>}
      </div>
      {onSelect && <Icon name="chevron-right" size={20} className={styles.chevron} />}
    </>
  );

  return onSelect ? (
    <button type="button" className={cx(styles.row, styles.interactive)} onClick={onSelect}>
      {content}
    </button>
  ) : (
    <div className={styles.row}>{content}</div>
  );
}
