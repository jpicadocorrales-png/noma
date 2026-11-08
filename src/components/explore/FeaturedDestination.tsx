import { useNavigate } from 'react-router';
import type { FeaturedDestination as Featured } from '../../data/explore';
import { Photo } from '../ui/Photo';
import { Button } from '../ui/Button';
import { SaveButton } from '../ui/SaveButton';
import styles from './FeaturedDestination.module.css';

interface FeaturedDestinationProps {
  destination: Featured;
}

export function FeaturedDestination({ destination: d }: FeaturedDestinationProps) {
  const navigate = useNavigate();
  return (
    <section aria-labelledby="featured-title">
      <article className={styles.feature}>
        <div className={styles.media}>
          <Photo
            id={d.photo.id}
            alt={d.photo.alt}
            focus={d.photo.focus}
            sizes="(min-width: 1320px) 1224px, (min-width: 1024px) calc(100vw - 96px), calc(100vw - 40px)"
            priority
            className={styles.photo}
          />
        </div>
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.topline}>
          <span className={styles.badge}>Featured destination</span>
          <span className={`t-meta ${styles.coords}`}>{d.coordinates}</span>
        </div>

        <div className={styles.content}>
          <p className={`t-meta ${styles.location}`}>
            {d.location}
            <span className={styles.sep} aria-hidden="true" />
            {d.region}
          </p>
          <h2 id="featured-title" className={styles.name}>
            {d.name}
          </h2>
          <p className={styles.description}>{d.description}</p>

          <dl className={styles.facts}>
            {d.facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt className="t-meta">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.actions}>
            <Button variant="light" iconRight="arrow-right" onClick={() => navigate(`/destinations/${d.id}`)}>
              Explore {d.name}
            </Button>
            <SaveButton itemId={d.id} placeName={d.name} variant="glass" />
          </div>
        </div>
      </article>
    </section>
  );
}
