import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { useAssistant, useAssistantScreen } from '../components/assistant/AssistantProvider';
import { SavedCard } from '../components/saved/SavedCard';
import { Tabs, type TabItem } from '../components/ui/Tabs';
import { Toast } from '../components/ui/Toast';
import { useSaved } from '../state/SavedProvider';
import type { SavedKind } from '../data/saved';
import { SectionHeader } from '../components/ui/SectionHeader';
import { PlaceCard } from '../components/places/PlaceCard';
import { useSuggestions } from '../components/places/useSuggestions';
import rail from '../components/ui/rail.module.css';
import styles from './Saved.module.css';

type Filter = 'all' | SavedKind;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'destination', label: 'Destinations' },
  { id: 'place', label: 'Places' },
  { id: 'food', label: 'Food & drink' },
  { id: 'stay', label: 'Stays' },
];

const SUGGESTIONS = ['Group my saved places into a route', 'Which of these suits a long weekend?', 'What’s in season next month?'];

export function Saved() {
  const { entries, restore } = useSaved();
  const assistant = useAssistant();
  const [filter, setFilter] = useState<Filter>('all');
  const [removed, setRemoved] = useState<{ id: string; name: string; savedAt: string } | null>(null);
  const suggestions = useSuggestions({ limit: 10 });
  useAssistantScreen('Saved', SUGGESTIONS);

  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.item.kind] = (acc[e.item.kind] ?? 0) + 1;
    return acc;
  }, {});
  const tabs: TabItem<Filter>[] = FILTERS.filter((f) => f.id === 'all' || counts[f.id]).map((f) => ({
    ...f,
    badge: String(f.id === 'all' ? entries.length : counts[f.id]),
  }));
  const activeFilter = tabs.some((t) => t.id === filter) ? filter : 'all';
  const visible = activeFilter === 'all' ? entries : entries.filter((e) => e.item.kind === activeFilter);

  const dismissToast = useCallback(() => setRemoved(null), []);

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <p className={`t-eyebrow ${styles.eyebrow}`}>Saved</p>
        <h1 className={styles.title}>Places you’ll come back to</h1>
        <p className={styles.lede}>
          {entries.length === 1 ? 'One place' : `${entries.length} places`} saved while exploring. Group them into a route, or
          add one to a trip.
        </p>
      </header>

      {entries.length > 0 && (
        <div className={styles.filters}>
          <Tabs items={tabs} value={activeFilter} onChange={setFilter} label="Filter saved places" idPrefix="saved" />
        </div>
      )}

      {visible.length > 0 ? (
        <ul
          id="saved-panel"
          role="tabpanel"
          aria-labelledby={`saved-tab-${activeFilter}`}
          className={styles.grid}
        >
          {visible.map(({ item, savedAt, daysAgo }) => (
            <li key={item.id}>
              <SavedCard
                item={item}
                daysAgo={daysAgo}
                onRemove={() => setRemoved({ id: item.id, name: item.name, savedAt })}
                onPlan={() => assistant.open(`Add ${item.name} to one of my trips`)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Nothing saved yet</p>
          <p className={styles.emptyBody}>Tap the bookmark on any place while exploring and it will wait for you here.</p>
          <Link to="/" className={styles.emptyLink}>
            Go to Explore
          </Link>
        </div>
      )}

      {suggestions.length > 0 && (
        <section aria-labelledby="suggested-title" className={styles.suggested}>
          <SectionHeader
            id="suggested-title"
            title="Based on what you saved"
            description="Places to eat, see and do near your saves and trips."
          />
          <ul className={rail.rail}>
            {suggestions.map((s) => (
              <li key={s.place.id}>
                <PlaceCard place={s.place} reason={s.reason} inRail compact />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Toast
        message={removed ? `Removed ${removed.name}` : null}
        actionLabel="Undo"
        onAction={() => {
          if (removed) restore(removed.id, removed.savedAt);
          setRemoved(null);
        }}
        onDismiss={dismissToast}
      />
    </div>
  );
}
