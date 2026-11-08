import { Link, useParams } from 'react-router';
import { getDestination, relatedDestinations } from '../data/destinations';
import { useAssistant, useAssistantScreen } from '../components/assistant/AssistantProvider';
import { PlaceHero } from '../components/ui/PlaceHero';
import { BackLink } from '../components/ui/BackLink';
import { Button, ButtonLink } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DestinationCard } from '../components/explore/DestinationCard';
import { useSaved } from '../state/SavedProvider';
import { useTrips } from '../state/TripsProvider';
import { PlaceholderScreen } from './PlaceholderScreen';
import rail from '../components/ui/rail.module.css';
import styles from './DetailPage.module.css';

const INTEREST_LABELS: Record<string, string> = {
  nature: 'Nature',
  culture: 'Culture',
  food: 'Food',
  adventure: 'Adventure',
  relaxation: 'Relaxation',
};

export function DestinationDetail() {
  const { destinationId } = useParams();
  const d = getDestination(destinationId);
  const { trips } = useTrips();
  const { isSaved, toggle } = useSaved();
  const assistant = useAssistant();

  useAssistantScreen(
    d ? d.name : 'Explore',
    d ? [`Plan ${d.idealStay} in ${d.name}`, `When is the best time for ${d.name}?`, `What’s ${d.name} like for a first visit?`] : [],
  );

  if (!d) return <PlaceholderScreen screen="notFound" />;

  const trip = trips.find((t) => t.id === d.id);
  const saved = isSaved(d.id);
  const related = relatedDestinations(d.id);

  return (
    <div className={`container ${styles.page}`}>
      <BackLink fallback="/discover" label="Back" />

      <PlaceHero
        photo={d.photo}
        badge="Destination"
        kicker={`${d.location} · ${d.region}`}
        title={d.name}
        lede={d.tagline}
        coordinates={d.coordinates}
      />

      <div className={styles.layout}>
        <section aria-label="Overview" className={styles.intro}>
          <p className={styles.lead}>{d.description}</p>
          <div className={styles.tags}>
            {d.interests.map((i) => (
              <Link key={i} to={`/discover?interest=${i}`} className={styles.tag}>
                {INTEREST_LABELS[i]}
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="highlights-title" className={styles.body}>
          <h2 id="highlights-title" className={styles.blockTitle}>
            Highlights
          </h2>
          <ol className={styles.numbered}>
            {d.highlights.map((h, i) => (
              <li key={h.name} className={styles.numberedItem}>
                <span className={styles.number} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className={`t-meta ${styles.itemMeta}`}>{h.kind}</p>
                  <h3 className={styles.itemName}>{h.name}</h3>
                  <p className={styles.itemNote}>{h.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className={styles.aside} aria-label={`Plan ${d.name}`}>
          <div className={styles.plan}>
            <h2 className={styles.planTitle}>Planning {d.name}</h2>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Best season</dt>
                <dd>{d.bestSeason}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Ideal stay</dt>
                <dd>{d.idealStay}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Getting around</dt>
                <dd>{d.gettingAround}</dd>
              </div>
            </dl>
            <div className={styles.actions}>
              {trip ? (
                <ButtonLink to={`/trips/${trip.id}`} iconRight="arrow-right">
                  Open your {d.name} trip
                </ButtonLink>
              ) : (
                <Button onClick={() => assistant.open(`Plan ${d.idealStay} in ${d.name}`)}>Plan a trip with NOMA</Button>
              )}
              <Button variant="secondary" iconLeft="bookmark" aria-pressed={saved} onClick={() => toggle(d.id)}>
                {saved ? 'Saved' : 'Save destination'}
              </Button>
            </div>
            {trip && <p className={styles.planNote}>You already have a trip planned here.</p>}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <SectionHeader id="related-title" title="You might also like" />
          <ul className={rail.rail}>
            {related.map((r) => (
              <li key={r.id}>
                <DestinationCard destination={{ ...r, note: r.tagline }} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
