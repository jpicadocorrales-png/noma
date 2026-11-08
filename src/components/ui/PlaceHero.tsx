import type { ReactNode } from 'react';
import { Photo } from './Photo';
import styles from './PlaceHero.module.css';

interface PlaceHeroProps {
  photo: { id: string; alt: string; focus?: string };
  badge: string;
  kicker: ReactNode;
  title: string;
  lede?: string;
  coordinates?: string;
}

/** Full-width photographic header for destination and collection pages. */
export function PlaceHero({ photo, badge, kicker, title, lede, coordinates }: PlaceHeroProps) {
  return (
    <header className={styles.hero}>
      <div className={styles.media}>
        <Photo
          id={photo.id}
          alt={photo.alt}
          focus={photo.focus}
          sizes="(min-width: 1320px) 1224px, 100vw"
          priority
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.topline}>
        <span className={styles.badge}>{badge}</span>
        {coordinates && <span className={`t-meta ${styles.coords}`}>{coordinates}</span>}
      </div>

      <div className={styles.content}>
        <p className={`t-meta ${styles.kicker}`}>{kicker}</p>
        <h1 className={styles.title}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
      </div>
    </header>
  );
}
