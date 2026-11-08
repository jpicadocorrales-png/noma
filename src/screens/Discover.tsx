import { useSearchParams } from 'react-router';
import { searchDestinations } from '../data/destinations';
import { interests } from '../data/explore';
import { useAssistant, useAssistantScreen } from '../components/assistant/AssistantProvider';
import { SearchBar } from '../components/ui/SearchBar';
import { ChoiceChips } from '../components/ui/ChoiceChips';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { DestinationCard } from '../components/explore/DestinationCard';
import styles from './Discover.module.css';

const INTEREST_OPTIONS = [{ id: 'all', label: 'All' }, ...interests.map((i) => ({ id: i.id, label: i.label }))];

export function Discover() {
  const [params, setParams] = useSearchParams();
  const assistant = useAssistant();
  const q = params.get('q') ?? '';
  const interestParam = params.get('interest') ?? 'all';
  const interest = INTEREST_OPTIONS.some((o) => o.id === interestParam) ? interestParam : 'all';
  const interestLabel = INTEREST_OPTIONS.find((o) => o.id === interest)?.label;

  useAssistantScreen('Discover', ['Somewhere warm in December', 'A quiet place for a long weekend', 'Where can I see the northern lights?']);

  const results = searchDestinations(q, interest === 'all' ? undefined : interest);

  const update = (next: { q?: string; interest?: string }) => {
    const p = new URLSearchParams(params);
    if (next.q !== undefined) {
      if (next.q.trim()) p.set('q', next.q);
      else p.delete('q');
    }
    if (next.interest !== undefined) {
      if (next.interest === 'all') p.delete('interest');
      else p.set('interest', next.interest);
    }
    setParams(p, { replace: true, preventScrollReset: true });
  };

  const summary = [
    `${results.length} ${results.length === 1 ? 'destination' : 'destinations'}`,
    interest !== 'all' ? `for ${interestLabel?.toLowerCase()}` : null,
    q.trim() ? `matching “${q.trim()}”` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`container ${styles.page}`}>
      <BackLink fallback="/" label="Explore" />

      <header className={styles.header}>
        <div>
          <p className={`t-eyebrow ${styles.eyebrow}`}>Discover</p>
          <h1 className={styles.title}>Find your next place</h1>
        </div>
        <div className={styles.search}>
          <SearchBar value={q} onChange={(v) => update({ q: v })} onSearch={(v) => update({ q: v })} />
        </div>
      </header>

      <div className={styles.filters}>
        <ChoiceChips
          mode="single"
          label="Filter by interest"
          options={INTEREST_OPTIONS}
          value={interest}
          onChange={(v) => update({ interest: v })}
        />
      </div>

      <p className={styles.summary} aria-live="polite">
        {summary}
      </p>

      {results.length > 0 ? (
        <ul className={styles.grid}>
          {results.map((d) => (
            <li key={d.id}>
              <DestinationCard destination={{ ...d, note: d.tagline }} fluid />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Nothing here yet</p>
          <p className={styles.emptyBody}>
            NOMA’s sample guide covers ten destinations. Ask NOMA and it will suggest places beyond them.
          </p>
          <div className={styles.emptyActions}>
            <Button onClick={() => assistant.open(q.trim() ? `Suggest places like “${q.trim()}”` : 'Suggest somewhere new')}>
              Ask NOMA
            </Button>
            <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
