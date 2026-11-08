import { useState, type CSSProperties } from 'react';
import { photoSrcSet, photoUrl } from '../../lib/photo';
import { cx } from '../../lib/cx';
import styles from './Photo.module.css';

interface PhotoProps {
  id: string;
  alt: string;
  /** Responsive `sizes` hint for the browser. */
  sizes: string;
  /** CSS object-position, used for art-directed crops. */
  focus?: string;
  priority?: boolean;
  maxWidth?: number;
  className?: string;
}

/** A cover-cropped photograph that fades in over a warm sand placeholder. */
export function Photo({ id, alt, sizes, focus, priority, maxWidth, className }: PhotoProps) {
  const [loaded, setLoaded] = useState(false);
  const style: CSSProperties | undefined = focus ? { objectPosition: focus } : undefined;

  return (
    <img
      className={cx(styles.photo, loaded && styles.loaded, className)}
      src={photoUrl(id, 960)}
      srcSet={photoSrcSet(id, maxWidth)}
      sizes={sizes}
      alt={alt}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onLoad={() => setLoaded(true)}
    />
  );
}
