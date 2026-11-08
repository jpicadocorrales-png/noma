import { useAssistant, useAssistantScreen } from '../components/assistant/AssistantProvider';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { UpcomingTripCard } from '../components/trips/UpcomingTripCard';
import { TripRow } from '../components/trips/TripRow';
import { tripDates, tripStatus, useTrips } from '../state/TripsProvider';
import { formatMonthYear } from '../lib/dates';
import styles from './MyTrips.module.css';

const SUGGESTIONS = ['Help me plan a new trip', 'What’s still unbooked for Kyoto?', 'Find dates for the Douro Valley'];

export function MyTrips() {
  const { trips, today } = useTrips();
  const assistant = useAssistant();
  useAssistantScreen('My Trips', SUGGESTIONS);

  const upcoming = trips.filter((t) => ['upcoming', 'ongoing'].includes(tripStatus(t, today)));
  const ideas = trips.filter((t) => tripStatus(t, today) === 'idea');
  const past = trips.filter((t) => tripStatus(t, today) === 'past');

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <div>
          <p className={`t-eyebrow ${styles.eyebrow}`}>My Trips</p>
          <h1 className={styles.title}>Your journeys</h1>
          <p className={styles.lede}>The plan, the bookings and the budget for every trip, in one place.</p>
        </div>
        <Button
          variant="primary"
          iconLeft="plus"
          className={styles.newTrip}
          onClick={() => assistant.open('Help me plan a new trip')}
        >
          Plan a new trip
        </Button>
      </header>

      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-title">
          <SectionHeader id="upcoming-title" title="Upcoming" />
          <div className={styles.stack}>
            {upcoming.map((t) => (
              <UpcomingTripCard key={t.id} trip={t} today={today} />
            ))}
          </div>
        </section>
      )}

      <div className={styles.columns}>
        {ideas.length > 0 && (
          <section aria-labelledby="ideas-title">
            <SectionHeader id="ideas-title" title="In planning" />
            <div className={styles.stack}>
              {ideas.map((t) => (
                <TripRow
                  key={t.id}
                  trip={t}
                  meta={`Idea · ${t.tentative ?? 'Dates open'}`}
                  detail={`${t.savedPlaces ?? 0} saved places · dates not set`}
                  actionLabel="Shape it with NOMA"
                  onSelect={() => assistant.open(`Turn my ${t.name} idea into a plan`)}
                />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section aria-labelledby="past-title">
            <SectionHeader id="past-title" title="Past trips" />
            <div className={styles.stack}>
              {past.map((t) => {
                const dates = tripDates(t);
                return (
                  <TripRow
                    key={t.id}
                    trip={t}
                    meta={`${t.location}${dates ? ` · ${formatMonthYear(dates.start)}` : ''}`}
                    detail={[...(t.stats ?? []).map((s) => `${s.value} ${s.label.toLowerCase()}`), `${t.travelers} travelers`].join(' · ')}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
