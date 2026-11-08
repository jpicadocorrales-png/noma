import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { useAssistant, useAssistantScreen } from '../components/assistant/AssistantProvider';
import { SavedCard } from '../components/saved/SavedCard';
import { Tabs, type TabItem } from '../components/ui/Tabs';
import { Toast } from '../components/ui/Toast';
import { useSaved } from '../state/SavedProvider';
import type { SavedKind } from '../data/saved';
import { cx } from '../lib/cx';
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

  // The magazine layout is composed for exactly seven cards; any other count uses the even grid.
  const editorial = activeFilter === 'all' && visible.length === 7;

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
          className={cx(styles.grid, editorial && styles.editorial)}
        >
          {visible.map(({ item, savedAt, daysAgo }, i) => (
            <li key={item.id}>
              <SavedCard
                item={item}
                daysAgo={daysAgo}
                lead={editorial && i === 0}
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
