import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createSampleTrips, type Booking, type Trip } from '../data/trips';
import { applyPlanChanges } from '../data/planChanges';
import { ACTIVITY_CATEGORY, getPlace } from '../data/places';
import { addDays, daysBetween, parseISODate, startOfDay } from '../lib/dates';
import { loadJSON, saveJSON } from '../lib/storage';

const DONE_KEY = 'noma.trips.done.v1';
const CHANGES_KEY = 'noma.trips.changes.v1';
const ADDED_KEY = 'noma.trips.added.v1';

export type TripStatus = 'idea' | 'upcoming' | 'ongoing' | 'past';

/** A place the traveler added from Explore. dayIndex is null for trips without a day plan. */
export interface AddedPlace {
  placeId: string;
  tripId: string;
  dayIndex: number | null;
}

interface TripsContextValue {
  today: Date;
  trips: Trip[];
  isDone: (activityId: string) => boolean;
  toggleDone: (activityId: string) => void;
  /** Plan changes the traveler approved (e.g. from Ask NOMA). */
  isApplied: (changeId: string) => boolean;
  applyChange: (changeId: string) => void;
  revertChange: (changeId: string) => void;
  /** Places added from Explore. */
  placement: (placeId: string) => AddedPlace | undefined;
  addPlace: (entry: AddedPlace) => void;
  removePlace: (placeId: string) => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

export const addedActivityId = (placeId: string) => `added-${placeId}`;

/** Folds places added from Explore into the trips: a stop on the chosen day, or a list on trips without days. */
function applyAddedPlaces(trips: Trip[], added: AddedPlace[]): Trip[] {
  if (added.length === 0) return trips;
  return trips.map((trip) => {
    const mine = added.filter((a) => a.tripId === trip.id);
    if (mine.length === 0) return trip;

    if (trip.days.length === 0) {
      const ids = mine.map((a) => a.placeId);
      return { ...trip, addedPlaceIds: ids, savedPlaces: (trip.savedPlaces ?? 0) + ids.length };
    }

    const days = trip.days.map((day, i) => {
      const extra = mine.flatMap((a) => {
        const place = a.dayIndex === i ? getPlace(a.placeId) : undefined;
        return place
          ? [
              {
                id: addedActivityId(place.id),
                time: place.time,
                title: place.name,
                place: `${place.type} · ${place.area}`,
                category: ACTIVITY_CATEGORY[place.interest],
                duration: place.duration,
                note: place.tip,
                addedBy: 'you' as const,
                placeId: place.id,
              },
            ]
          : [];
      });
      if (extra.length === 0) return day;
      const sorted = [...day.items, ...extra].sort((a, b) => a.time.localeCompare(b.time));
      // "How to get to the next stop" no longer applies when an added stop comes next.
      const items = sorted.map((item, j) => (sorted[j + 1]?.addedBy === 'you' ? { ...item, transit: undefined } : item));
      return { ...day, items };
    });
    return { ...trip, days };
  });
}

/**
 * Trips are sample data. Only what the traveler changes is persisted, in
 * this browser: checked-off activities, approved plan changes and places
 * added from Explore.
 */
export function TripsProvider({ children }: { children: ReactNode }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [done, setDone] = useState<Record<string, true>>(() => loadJSON(DONE_KEY, {}));
  const [applied, setApplied] = useState<string[]>(() => loadJSON(CHANGES_KEY, []));
  const [added, setAdded] = useState<AddedPlace[]>(() => loadJSON(ADDED_KEY, []));
  const trips = useMemo(
    () => applyAddedPlaces(applyPlanChanges(createSampleTrips(today), applied), added),
    [today, applied, added],
  );

  useEffect(() => saveJSON(DONE_KEY, done), [done]);
  useEffect(() => saveJSON(CHANGES_KEY, applied), [applied]);
  useEffect(() => saveJSON(ADDED_KEY, added), [added]);

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

  const addPlace = useCallback(
    (entry: AddedPlace) => setAdded((prev) => [...prev.filter((a) => a.placeId !== entry.placeId), entry]),
    [],
  );
  const removePlace = useCallback((placeId: string) => setAdded((prev) => prev.filter((a) => a.placeId !== placeId)), []);

  const value = useMemo<TripsContextValue>(
    () => ({
      today,
      trips,
      isDone: (id) => Boolean(done[id]),
      toggleDone,
      isApplied: (id) => applied.includes(id),
      applyChange,
      revertChange,
      placement: (placeId) => added.find((a) => a.placeId === placeId),
      addPlace,
      removePlace,
    }),
    [today, trips, done, toggleDone, applied, applyChange, revertChange, added, addPlace, removePlace],
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
  const count = (status: Booking['status']) => trip.bookings.filter((b) => b.status === status).length;
  const sum = (status: Booking['status']) =>
    trip.bookings.filter((b) => b.status === status).reduce((total, b) => total + b.amount, 0);
  const paid = count('paid');
  const reserved = count('reserved');
  return {
    paid,
    reserved,
    pending: count('pending'),
    /** Reserved or paid: a booking exists. */
    booked: paid + reserved,
    total: trip.bookings.length,
    amountPaid: sum('paid'),
    amountDue: sum('reserved'),
  };
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
