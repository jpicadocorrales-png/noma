import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SAMPLE_SAVES, SAVABLE, type SavedItem } from '../data/saved';
import { addDays, daysBetween, parseISODate, startOfDay, toISODate } from '../lib/dates';
import { loadJSON, saveJSON } from '../lib/storage';

const KEY = 'noma.saved.v1';

/** id → ISO date it was saved. */
type SavedMap = Record<string, string>;

export interface SavedEntry {
  item: SavedItem;
  savedAt: string;
  daysAgo: number;
}

interface SavedContextValue {
  entries: SavedEntry[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
  /** Re-save with the original date (used by "Undo"). */
  restore: (id: string, savedAt: string) => void;
}

const SavedContext = createContext<SavedContextValue | null>(null);

function sampleSaves(today: Date): SavedMap {
  return Object.fromEntries(SAMPLE_SAVES.map(([id, ago]) => [id, toISODate(addDays(today, -ago))]));
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [saved, setSaved] = useState<SavedMap>(() => loadJSON(KEY, sampleSaves(today)));

  useEffect(() => saveJSON(KEY, saved), [saved]);

  const toggle = useCallback(
    (id: string) =>
      setSaved((prev) => {
        const next = { ...prev };
        if (next[id]) delete next[id];
        else next[id] = toISODate(today);
        return next;
      }),
    [today],
  );

  const restore = useCallback((id: string, savedAt: string) => setSaved((prev) => ({ ...prev, [id]: savedAt })), []);

  const entries = useMemo(
    () =>
      Object.entries(saved)
        .map(([id, savedAt]) => {
          const item = SAVABLE.get(id);
          return item ? { item, savedAt, daysAgo: daysBetween(parseISODate(savedAt), today) } : null;
        })
        .filter((e): e is SavedEntry => e !== null)
        .sort((a, b) => a.daysAgo - b.daysAgo),
    [saved, today],
  );

  const value = useMemo(
    () => ({ entries, isSaved: (id: string) => Boolean(saved[id]), toggle, restore }),
    [entries, saved, toggle, restore],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used inside <SavedProvider>');
  return ctx;
}

export function formatSavedAgo(days: number): string {
  if (days <= 0) return 'Saved today';
  if (days === 1) return 'Saved yesterday';
  if (days < 7) return `Saved ${days} days ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `Saved ${w} week${w > 1 ? 's' : ''} ago`;
  }
  const m = Math.floor(days / 30);
  return `Saved ${m} month${m > 1 ? 's' : ''} ago`;
}
