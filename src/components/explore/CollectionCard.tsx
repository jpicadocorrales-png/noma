import type { Collection } from '../../data/explore';
import { Photo } from '../ui/Photo';
import { RouteLine } from '../ui/RouteLine';
import { Icon } from '../ui/Icon';
import { cx } from '../../lib/cx';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  collection: Collection;
  index: number;
  /** "lead" is the large story; "side" stacks beside it on wide screens. */
  layout: 'lead' | 'side';
}

export function CollectionCard({ collection: c, index, layout }: CollectionCardProps) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className={cx(styles.card, styles[layout])}>
      <div className={styles.media}>
        <Photo
          id={c.photo.id}
          alt={c.photo.alt}
          focus={c.photo.focus}
          sizes={layout === 'lead' ? '(min-width: 1024px) 720px, 100vw' : '(min-width: 1024px) 320px, 100vw'}
          maxWidth={1800}
          className={styles.photo}
        />
        <span className={`t-meta ${styles.number}`}>Collection {number}</span>
      </div>

      <div className={styles.body}>
        <p className={`t-meta ${styles.kicker}`}>
          {c.kicker}
          <span aria-hidden="true"> · </span>
          {c.places} places
        </p>
        <h3 className={styles.title}>
          <a href={`#collection-${c.id}`} className={styles.link}>
            {c.title}
          </a>
        </h3>
        <p className={styles.excerpt}>{c.excerpt}</p>
        <RouteLine stops={c.route} className={styles.route} />
        <span className={styles.cta} aria-hidden="true">
          Read the story <Icon name="arrow-right" size={16} />
        </span>
      </div>
    </article>
  );
}
