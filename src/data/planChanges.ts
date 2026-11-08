import type { Activity, Expense, Trip } from './trips';

/**
 * A change NOMA can propose and the traveler can approve or undo.
 * Changes are applied on top of the sample trips, so undoing one is lossless.
 */
export interface PlanChange {
  id: string;
  tripId: string;
  dayIndex: number;
  /** Short label for the proposal card. */
  title: string;
  removeActivities: string[];
  removeBookings: string[];
  addActivities: Activity[];
  addExpenses: Expense[];
  /** New "how to get to the next stop" text for stops that now lead somewhere else. */
  transitOverrides?: Record<string, string>;
  /** Shown on the day after the change is applied. */
  note: string;
  /** Replacement day summary, when the original no longer describes the day. */
  summary?: string;
}

export const PLAN_CHANGES: PlanChange[] = [
  {
    id: 'kyoto-d3-rain',
    tripId: 'kyoto',
    dayIndex: 2,
    title: 'An indoor afternoon in Arashiyama',
    removeActivities: ['d3-5'],
    removeBookings: ['b-boat'],
    addActivities: [
      {
        id: 'd3-n1',
        time: '14:00',
        title: 'Fukuda Art Museum',
        place: 'By the Togetsukyō Bridge',
        category: 'sight',
        duration: '1 h 15',
        note: 'Japanese painting in a quiet riverside building. The café looks out over the water.',
        transit: '10 min walk',
        addedBy: 'noma',
      },
      {
        id: 'd3-n2',
        time: '15:30',
        title: 'Matcha at a riverside tea house',
        place: 'Arashiyama',
        category: 'food',
        duration: '45 min',
        transit: '15 min walk',
        addedBy: 'noma',
      },
      {
        id: 'd3-n3',
        time: '16:45',
        title: 'Hot spring soak',
        place: 'Arashiyama Onsen',
        category: 'experience',
        duration: '1 h 30',
        note: 'Day-use baths. Bring a small towel, or rent one at the door.',
        addedBy: 'noma',
      },
    ],
    addExpenses: [
      { id: 'e-fukuda', categoryId: 'experiences', label: 'Fukuda Art Museum', amount: 18, dayIndex: 2, source: 'noma' },
      { id: 'e-onsen', categoryId: 'experiences', label: 'Arashiyama Onsen', amount: 36, dayIndex: 2, source: 'noma' },
    ],
    transitOverrides: { 'd3-4': '5 min walk' },
    note: 'Afternoon moved indoors for the rain. The river boat was cancelled with a full refund.',
    summary: 'Bamboo at dawn, a quiet villa garden, then a warm, dry afternoon of art, tea and a hot spring.',
  },
];

export const getPlanChange = (id: string) => PLAN_CHANGES.find((c) => c.id === id);

/** Apply approved changes to the sample trips (pure). */
export function applyPlanChanges(trips: Trip[], applied: string[]): Trip[] {
  const changes = PLAN_CHANGES.filter((c) => applied.includes(c.id));
  if (changes.length === 0) return trips;

  return trips.map((trip) => {
    const mine = changes.filter((c) => c.tripId === trip.id);
    if (mine.length === 0) return trip;

    let next: Trip = trip;
    for (const c of mine) {
      next = {
        ...next,
        days: next.days.map((day, i) => {
          if (i !== c.dayIndex) return day;
          const items = day.items
            .filter((a) => !c.removeActivities.includes(a.id))
            .map((a) => (c.transitOverrides?.[a.id] ? { ...a, transit: c.transitOverrides[a.id] } : a))
            .concat(c.addActivities)
            .sort((a, b) => a.time.localeCompare(b.time));
          return {
            ...day,
            summary: c.summary ?? day.summary,
            items,
            weather: { ...day.weather, alert: undefined },
            change: { id: c.id, note: c.note },
          };
        }),
        bookings: next.bookings.filter((b) => !c.removeBookings.includes(b.id)),
        budget: next.budget ? { ...next.budget, expenses: [...next.budget.expenses, ...c.addExpenses] } : null,
      };
    }
    return next;
  });
}

/** Net budget effect of a change: new spending minus refunded bookings. */
export function changeBudgetDelta(change: PlanChange, trip: Trip): { added: number; refunded: number; net: number } {
  const added = change.addExpenses.reduce((s, e) => s + e.amount, 0);
  const refunded = trip.bookings.filter((b) => change.removeBookings.includes(b.id)).reduce((s, b) => s + b.amount, 0);
  return { added, refunded, net: added - refunded };
}
