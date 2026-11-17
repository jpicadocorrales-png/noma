import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { INTEREST_META, PLACES, cityName, formatCount, getPlace, ratingBreakdown } from '../data/places';
import { useAssistantScreen } from '../components/assistant/AssistantProvider';
import { PlaceHero } from '../components/ui/PlaceHero';
import { BackLink } from '../components/ui/BackLink';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { PlaceCard } from '../components/places/PlaceCard';
import { AddToTrip } from '../components/places/AddToTrip';
import { Stars } from '../components/places/Rating';
import { useSuggestions } from '../components/places/useSuggestions';
import { useSaved } from '../state/SavedProvider';
import { PlaceholderScreen } from './PlaceholderScreen';
import rail from '../components/ui/rail.module.css';
import detail from './DetailPage.module.css';
import styles from './PlaceDetail.module.css';

export function PlaceDetail() {
  const { placeId } = useParams();
  const place = getPlace(placeId);
  const { isSaved, toggle } = useSaved();
  const suggestions = useSuggestions({ interest: place?.interest, exclude: place?.id, limit: 6 });
  const { hash } = useLocation();

  // "Add to a trip" links land on the planning card.
  useEffect(() => {
    if (hash === '#plan') document.getElementById('plan')?.scrollIntoView({ block: 'start' });
  }, [hash, placeId]);

  useAssistantScreen(
    place ? place.name : 'Explore',
    place
      ? [`Is ${place.name} worth it?`, `What else is near ${place.name}?`, `When should I go to ${place.name}?`]
      : [],
  );

  if (!place) return <PlaceholderScreen screen="notFound" />;

  const meta = INTEREST_META[place.interest];
  const city = cityName(place);
  const saved = isSaved(place.id);
  const breakdown = ratingBreakdown(place);
  const nearby = PLACES.filter((p) => p.destinationId === place.destinationId && p.id !== place.id).sort(
    (a, b) => Number(b.interest === place.interest) - Number(a.interest === place.interest) || b.rating - a.rating,
  );
  const nearbyIds = new Set(nearby.map((p) => p.id));
  const picked = suggestions.filter((s) => !nearbyIds.has(s.place.id));

  return (
    <div className={`container ${detail.page}`}>
      <BackLink fallback={`/interests/${place.interest}`} label="Back" />

      <PlaceHero photo={place.photo} badge={place.type} kicker={`${place.area} · ${place.city}`} title={place.name} lede={place.blurb} />

      <div className={detail.layout}>
        <section aria-label="Overview" className={detail.intro}>
          <div className={styles.summary}>
            <span className={styles.score}>
              <Stars value={Math.round(place.rating)} />
              <strong>{place.rating.toFixed(1)}</strong>
              <a href="#reviews" className={styles.scoreLink}>
                {formatCount(place.reviewCount)} reviews
              </a>
            </span>
            <span className={styles.dot} aria-hidden="true" />
            <span>{place.price}</span>
            <span className={styles.dot} aria-hidden="true" />
            <Link to={`/interests/${place.interest}`} className={styles.interest}>
              {meta.title}
            </Link>
          </div>

          <p className={detail.lead}>{place.description}</p>

          <p className={`t-meta ${styles.mentionsLabel}`}>What travelers mention</p>
          <ul className={styles.mentions}>
            {place.mentions.map((m) => (
              <li key={m} className={styles.mention}>
                {m}
              </li>
            ))}
          </ul>
        </section>

        <section id="reviews" aria-labelledby="reviews-title" className={detail.body}>
          <h2 id="reviews-title" className={detail.blockTitle}>
            What travelers say
          </h2>

          <div className={styles.overview}>
            <div className={styles.big}>
              <span className={styles.bigNumber}>{place.rating.toFixed(1)}</span>
              <Stars value={Math.round(place.rating)} />
              <span className={styles.bigCount}>{formatCount(place.reviewCount)} reviews</span>
            </div>
            <dl className={styles.bars}>
              {breakdown.map((pct, i) => (
                <div key={i} className={styles.bar}>
                  <dt>{5 - i} ★</dt>
                  <dd>
                    <span className={styles.track}>
                      <span className={styles.fill} style={{ width: `${pct}%` }} />
                    </span>
                    <span className={styles.pct}>{pct}%</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className={styles.reviews}>
            {place.reviews.map((r) => (
              <li key={r.author + r.date} className={styles.review}>
                <div className={styles.reviewHead}>
                  <span className={styles.avatar} aria-hidden="true">
                    {r.author[0]}
                  </span>
                  <div>
                    <p className={styles.author}>{r.author}</p>
                    <p className={styles.from}>
                      {r.from} · {r.date}
                    </p>
                  </div>
                  <Stars value={r.rating} />
                </div>
                <p className={styles.reviewText}>{r.text}</p>
              </li>
            ))}
          </ul>
          <p className={styles.sample}>Ratings and reviews are sample content for this demo.</p>
        </section>

        <aside id="plan" className={detail.aside} aria-label={`Plan a visit to ${place.name}`}>
          <div className={detail.plan}>
            <h2 className={detail.planTitle}>Plan your visit</h2>
            <dl className={detail.facts}>
              <div className={detail.fact}>
                <dt>Price</dt>
                <dd>{place.price}</dd>
              </div>
              <div className={detail.fact}>
                <dt>Open</dt>
                <dd>{place.hours}</dd>
              </div>
              <div className={detail.fact}>
                <dt>Time needed</dt>
                <dd>{place.duration}</dd>
              </div>
            </dl>
            <p className={styles.tip}>
              <strong>Tip</strong> {place.tip}
            </p>
            <AddToTrip place={place} />
            <Button variant="secondary" iconLeft="bookmark" aria-pressed={saved} onClick={() => toggle(place.id)}>
              {saved ? 'Saved' : 'Save place'}
            </Button>
          </div>
        </aside>
      </div>

      {nearby.length > 0 && (
        <section className={detail.related} aria-labelledby="nearby-title">
          <SectionHeader id="nearby-title" title={`More in ${city}`} />
          <ul className={rail.rail}>
            {nearby.map((p) => (
              <li key={p.id}>
                <PlaceCard place={p} inRail compact />
              </li>
            ))}
          </ul>
        </section>
      )}

      {picked.length > 0 && (
        <section className={detail.related} aria-labelledby="picked-title">
          <SectionHeader id="picked-title" title="Picked from your trips and saves" />
          <ul className={rail.rail}>
            {picked.map((s) => (
              <li key={s.place.id}>
                <PlaceCard place={s.place} reason={s.reason} inRail compact />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
