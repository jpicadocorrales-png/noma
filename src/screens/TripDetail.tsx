import { Link, useParams, useSearchParams } from 'react-router';
import { useAssistantScreen } from '../components/assistant/AssistantProvider';
import { TripHero } from '../components/trips/TripHero';
import { TripGlance } from '../components/trips/TripGlance';
import { ItineraryView } from '../components/trips/ItineraryView';
import { BookingsView } from '../components/trips/BookingsView';
import { BudgetView } from '../components/trips/BudgetView';
import { Tabs, type TabItem } from '../components/ui/Tabs';
import { Icon } from '../components/ui/Icon';
import { bookingTotals, useTrips } from '../state/TripsProvider';
import { PlaceholderScreen } from './PlaceholderScreen';
import styles from './TripDetail.module.css';

type View = 'itinerary' | 'bookings' | 'budget';
const VIEWS: View[] = ['itinerary', 'bookings', 'budget'];

const SUGGESTIONS: Record<View, (day: string) => string[]> = {
  itinerary: (day) => [`Make ${day} less rushed`, 'Find a good dinner near the last stop', 'What should I book in advance?'],
  bookings: () => ['What’s still unconfirmed?', 'Remind me what to bring for each booking'],
  budget: () => ['Where can I save on this trip?', 'Is my food budget realistic for Kyoto?'],
};

export function TripDetail() {
  const { tripId } = useParams();
  const { trips, today } = useTrips();
  const [params, setParams] = useSearchParams();
  const trip = trips.find((t) => t.id === tripId);

  const viewParam = params.get('view') as View | null;
  const view: View = viewParam && VIEWS.includes(viewParam) ? viewParam : 'itinerary';
  const dayCount = trip?.days.length ?? 0;
  const dayParam = Number(params.get('day'));
  const dayIndex = dayParam >= 1 && dayParam <= dayCount ? dayParam - 1 : 0;
  const dayLabel = `Day ${String(dayIndex + 1).padStart(2, '0')}`;

  const contextLabel = trip
    ? view === 'itinerary'
      ? `${trip.name} · ${dayLabel}`
      : `${trip.name} · ${view === 'bookings' ? 'Bookings' : 'Budget'}`
    : 'My Trips';
  useAssistantScreen(contextLabel, SUGGESTIONS[view](dayLabel));

  if (!trip) return <PlaceholderScreen screen="notFound" />;

  const update = (next: Partial<{ view: View; day: number }>) => {
    const p = new URLSearchParams(params);
    if (next.view) {
      if (next.view === 'itinerary') p.delete('view');
      else p.set('view', next.view);
    }
    if (next.day !== undefined) p.set('day', String(next.day + 1));
    setParams(p, { replace: true, preventScrollReset: true });
  };

  const totals = bookingTotals(trip);
  const hasPlan = trip.days.length > 0;
  const tabs: TabItem<View>[] = [
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'bookings', label: 'Bookings', badge: totals.pending ? String(totals.pending) : undefined },
    { id: 'budget', label: 'Budget' },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <Link to="/trips" className={styles.back}>
        <Icon name="arrow-left" size={18} />
        My Trips
      </Link>

      <TripHero trip={trip} today={today} />

      {hasPlan ? (
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.tabsBar}>
              <Tabs items={tabs} value={view} onChange={(v) => update({ view: v })} label="Trip sections" idPrefix="trip" />
            </div>

            <div role="tabpanel" id="trip-panel" aria-labelledby={`trip-tab-${view}`} className={styles.panel}>
              {view === 'itinerary' && <ItineraryView trip={trip} dayIndex={dayIndex} onDayChange={(d) => update({ day: d })} />}
              {view === 'bookings' && <BookingsView trip={trip} />}
              {view === 'budget' && <BudgetView trip={trip} />}
            </div>
          </div>

          <div className={styles.aside}>
            <TripGlance trip={trip} />
          </div>
        </div>
      ) : (
        <p className={styles.empty}>
          {trip.summary} The full plan for this trip isn’t available in the preview yet.
        </p>
      )}
    </div>
  );
}
