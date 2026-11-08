import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createSampleTrips, type Trip } from '../data/trips';
import { applyPlanChanges } from '../data/planChanges';
import { addDays, daysBetween, parseISODate, startOfDay } from '../lib/dates';
import { loadJSON, saveJSON } from '../lib/storage';

const DONE_KEY = 'noma.trips.done.v1';
const CHANGES_KEY = 'noma.trips.changes.v1';

export type TripStatus = 'idea' | 'upcoming' | 'ongoing' | 'past';

interface TripsContextValue {
  today: Date;
  trips: Trip[];
  isDone: (activityId: string) => boolean;
  toggleDone: (activityId: string) => void;
  /** Plan changes the traveler approved (e.g. from Ask NOMA). */
  isApplied: (changeId: string) => boolean;
  applyChange: (changeId: string) => void;
  revertChange: (changeId: string) => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

/**
 * Trips are sample data. Only what the traveler changes is persisted, in
 * this browser: checked-off activities and approved plan changes.
 */
export function TripsProvider({ children }: { children: ReactNode }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [done, setDone] = useState<Record<string, true>>(() => loadJSON(DONE_KEY, {}));
  const [applied, setApplied] = useState<string[]>(() => loadJSON(CHANGES_KEY, []));
  const trips = useMemo(() => applyPlanChanges(createSampleTrips(today), applied), [today, applied]);

  useEffect(() => saveJSON(DONE_KEY, done), [done]);
  useEffect(() => saveJSON(CHANGES_KEY, applied), [applied]);

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }, []);

  const applyChange = useCallback(
    (id: string) => setApplied((prev) => (prev.includes(id) ? prev : [...prev, id])),
    [],
  );
  const revertChange = useCallback((id: string) => setApplied((prev) => prev.filter((c) => c !== id)), []);

  const value = useMemo<TripsContextValue>(
    () => ({
      today,
      trips,
      isDone: (id) => Boolean(done[id]),
      toggleDone,
      isApplied: (id) => applied.includes(id),
      applyChange,
      revertChange,
    }),
    [today, trips, done, toggleDone, applied, applyChange, revertChange],
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips(): TripsContextValue {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be used inside <TripsProvider>');
  return ctx;
}

/* ---------- Derived trip helpers ---------- */

export function tripDates(trip: Trip) {
  if (!trip.startDate) return null;
  const start = parseISODate(trip.startDate);
  const length = trip.days.length || Number(trip.stats?.find((s) => s.label === 'Days')?.value ?? 1);
  const end = addDays(start, length - 1);
  return { start, end, length };
}

export function tripStatus(trip: Trip, today: Date): TripStatus {
  const dates = tripDates(trip);
  if (!dates) return 'idea';
  if (daysBetween(today, dates.start) > 0) return 'upcoming';
  if (daysBetween(today, dates.end) >= 0) return 'ongoing';
  return 'past';
}

export function dayDate(trip: Trip, dayIndex: number): Date | null {
  return trip.startDate ? addDays(parseISODate(trip.startDate), dayIndex) : null;
}

export function bookingTotals(trip: Trip) {
  const confirmed = trip.bookings.filter((b) => b.status === 'confirmed').length;
  return { confirmed, total: trip.bookings.length, pending: trip.bookings.length - confirmed };
}

export function budgetSummary(trip: Trip) {
  if (!trip.budget) return null;
  const byCategory = new Map<string, number>();
  for (const b of trip.bookings) byCategory.set(b.categoryId, (byCategory.get(b.categoryId) ?? 0) + b.amount);
  for (const e of trip.budget.expenses) byCategory.set(e.categoryId, (byCategory.get(e.categoryId) ?? 0) + e.amount);
  const committed = [...byCategory.values()].reduce((a, b) => a + b, 0);
  return {
    planned: trip.budget.planned,
    committed,
    remaining: trip.budget.planned - committed,
    categories: trip.budget.categories.map((c) => ({ ...c, committed: byCategory.get(c.id) ?? 0 })),
  };
}
