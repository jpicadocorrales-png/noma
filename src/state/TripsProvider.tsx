import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createSampleTrips, type Trip } from '../data/trips';
import { addDays, daysBetween, parseISODate, startOfDay } from '../lib/dates';
import { loadJSON, saveJSON } from '../lib/storage';

const DONE_KEY = 'noma.trips.done.v1';

export type TripStatus = 'idea' | 'upcoming' | 'ongoing' | 'past';

interface TripsContextValue {
  today: Date;
  trips: Trip[];
  isDone: (activityId: string) => boolean;
  toggleDone: (activityId: string) => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

/**
 * Trips are sample data for now. Only what the traveler changes (checked-off
 * activities) is persisted, in this browser.
 */
export function TripsProvider({ children }: { children: ReactNode }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const trips = useMemo(() => createSampleTrips(today), [today]);
  const [done, setDone] = useState<Record<string, true>>(() => loadJSON(DONE_KEY, {}));

  useEffect(() => saveJSON(DONE_KEY, done), [done]);

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }, []);

  const value = useMemo<TripsContextValue>(
    () => ({ today, trips, isDone: (id) => Boolean(done[id]), toggleDone }),
    [today, trips, done, toggleDone],
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
