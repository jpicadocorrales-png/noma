import { useParams } from 'react-router';
import { collections } from '../data/explore';
import { useAssistant, useAssistantScreen } from '../components/assistant/AssistantProvider';
import { PlaceHero } from '../components/ui/PlaceHero';
import { BackLink } from '../components/ui/BackLink';
import { Button } from '../components/ui/Button';
import { RouteLine } from '../components/ui/RouteLine';
import { SectionHeader } from '../components/ui/SectionHeader';
import { CollectionCard } from '../components/explore/CollectionCard';
import { PlaceholderScreen } from './PlaceholderScreen';
import styles from './DetailPage.module.css';
import local from './CollectionDetail.module.css';

export function CollectionDetail() {
  const { collectionId } = useParams();
  const index = collections.findIndex((c) => c.id === collectionId);
  const c = collections[index];
  const assistant = useAssistant();

  useAssistantScreen(
    c ? `${c.title} · Collection` : 'Explore',
    c ? [`Plan the ${c.title} route`, 'Can this route work in fewer days?', 'Where should I stay at each stop?'] : [],
  );

  if (!c) return <PlaceholderScreen screen="notFound" />;

  const others = collections.map((o, i) => ({ o, i })).filter(({ o }) => o.id !== c.id);
  const planPrompt = `Plan the ${c.title} route: ${c.route.join(' → ')}`;

  return (
    <div className={`container ${styles.page}`}>
      <BackLink fallback="/" label="Back" />

      <PlaceHero
        photo={c.photo}
        badge={`Collection ${String(index + 1).padStart(2, '0')}`}
        kicker={`${c.kicker} · ${c.places} places`}
        title={c.title}
        lede={c.excerpt}
      />

      <div className={styles.layout}>
        <section aria-label="Introduction" className={styles.intro}>
          <p className={styles.lead}>{c.intro}</p>
          <RouteLine stops={c.route} className={local.route} />
        </section>

        <section aria-labelledby="stops-title" className={styles.body}>
          <h2 id="stops-title" className={styles.blockTitle}>
            The route, stop by stop
          </h2>
          <ol className={styles.numbered}>
            {c.stops.map((s, i) => (
              <li key={s.name} className={styles.numberedItem}>
                <span className={styles.number} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className={`t-meta ${styles.itemMeta}`}>{s.days}</p>
                  <h3 className={styles.itemNameSerif}>{s.name}</h3>
                  <p className={styles.itemNote}>{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className={styles.aside} aria-label="Plan this route">
          <div className={styles.plan}>
            <h2 className={styles.planTitle}>Make it your trip</h2>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Duration</dt>
                <dd>{c.duration}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Stops</dt>
                <dd>{c.stops.length}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Places to see</dt>
                <dd>{c.places}</dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <Button onClick={() => assistant.open(planPrompt)}>Plan this route with NOMA</Button>
            </div>
            <p className={styles.planNote}>NOMA drafts the days around your dates and travel style. You approve every change.</p>
          </div>
        </aside>
      </div>

      <section className={styles.related} aria-labelledby="more-title">
        <SectionHeader id="more-title" title="More collections" />
        <ul className={local.more}>
          {others.map(({ o, i }) => (
            <li key={o.id}>
              <CollectionCard collection={o} index={i} layout="side" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
