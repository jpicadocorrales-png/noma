import { Link, useParams, useSearchParams } from 'react-router';
import { INTEREST_META, cityName, placesFor } from '../data/places';
import type { InterestId } from '../data/destinations';
import { useAssistantScreen } from '../components/assistant/AssistantProvider';
import { BackLink } from '../components/ui/BackLink';
import { ChoiceChips } from '../components/ui/ChoiceChips';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Icon } from '../components/ui/Icon';
import { PlaceCard } from '../components/places/PlaceCard';
import { useSuggestions } from '../components/places/useSuggestions';
import { PlaceholderScreen } from './PlaceholderScreen';
import { cx } from '../lib/cx';
import rail from '../components/ui/rail.module.css';
import styles from './InterestDetail.module.css';

const ORDER: InterestId[] = ['food', 'culture', 'adventure', 'nature', 'relaxation'];

const ASK: Record<InterestId, string[]> = {
  food: ['Where should we eat near Gion?', 'Find a dinner that needs booking ahead', 'Cheap eats for our Kyoto trip'],
  culture: ['Which temples are worth it in Kyoto?', 'Best museums for a rainy day', 'How early should I get to Fushimi Inari?'],
  adventure: ['Something adventurous for a beginner', 'Fun things to do at night in Tokyo', 'Is the manta dive good for snorkelers?'],
  nature: ['Best sunrise spot near Ubud', 'When do cherry blossoms peak in Tokyo?'],
  relaxation: ['A slow day in Bali', 'Where can I watch the sunset in Santorini without crowds?'],
};

export function InterestDetail() {
  const { interestId } = useParams();
  const [params, setParams] = useSearchParams();
  const meta = interestId && interestId in INTEREST_META ? INTEREST_META[interestId as InterestId] : undefined;
  const suggestions = useSuggestions({ interest: meta?.id, limit: 8 });

  useAssistantScreen(meta ? meta.title : 'Explore', meta ? ASK[meta.id] : []);

  if (!meta) return <PlaceholderScreen screen="notFound" />;

  const all = placesFor(meta.id).sort((a, b) => b.rating - a.rating);
  const cities = [...new Map(all.map((p) => [p.destinationId, cityName(p)])).entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const cityParam = params.get('city') ?? 'all';
  const city = cities.some((c) => c.id === cityParam) ? cityParam : 'all';
  const visible = city === 'all' ? all : all.filter((p) => p.destinationId === city);

  const setCity = (id: string) => {
    const p = new URLSearchParams(params);
    if (id === 'all') p.delete('city');
    else p.set('city', id);
    setParams(p, { replace: true, preventScrollReset: true });
  };

  return (
    <div className={`container ${styles.page}`}>
      <BackLink fallback="/" label="Explore" />

      <header className={styles.header}>
        <div>
          <p className={`t-eyebrow ${styles.eyebrow}`}>Explore by interest</p>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.lede}>{meta.lede}</p>
        </div>
        <nav aria-label="Interests" className={styles.switcher}>
          {ORDER.map((id) => (
            <Link
              key={id}
              to={`/interests/${id}`}
              className={cx(styles.switch, id === meta.id && styles.switchActive)}
              aria-current={id === meta.id ? 'page' : undefined}
            >
              {INTEREST_META[id].label}
            </Link>
          ))}
        </nav>
      </header>

      {suggestions.length > 0 && (
        <section aria-labelledby="picked-title">
          <SectionHeader
            id="picked-title"
            title="Picked for you"
            description="Based on your trips and the places you’ve saved."
          />
          <ul className={rail.rail}>
            {suggestions.map((s) => (
              <li key={s.place.id}>
                <PlaceCard place={s.place} reason={s.reason} inRail />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="all-title" className={styles.all}>
        <SectionHeader id="all-title" title={`All ${meta.noun}`} />
        <div className={styles.filters}>
          <ChoiceChips
            mode="single"
            label="Filter by city"
            options={[{ id: 'all', label: 'Everywhere' }, ...cities]}
            value={city}
            onChange={setCity}
          />
        </div>
        <p className={styles.summary} aria-live="polite">
          {visible.length} {visible.length === 1 ? 'place' : 'places'}
          {city !== 'all' && ` in ${cities.find((c) => c.id === city)?.label}`}, sorted by rating
        </p>
        <ul className={styles.grid}>
          {visible.map((p) => (
            <li key={p.id}>
              <PlaceCard place={p} />
            </li>
          ))}
        </ul>
      </section>

      <Link to={`/discover?interest=${meta.id}`} className={styles.more}>
        See destinations known for {meta.label.toLowerCase()}
        <Icon name="arrow-right" size={16} />
      </Link>
    </div>
  );
}
