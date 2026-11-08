import { useState } from 'react';
import type { Trip } from '../../data/trips';
import { DaySelector } from './DaySelector';
import { ActivityRow } from './ActivityRow';
import { WeatherAlert } from './WeatherAlert';
import { Icon } from '../ui/Icon';
import { ProgressBar } from '../ui/ProgressBar';
import { dayDate, useTrips } from '../../state/TripsProvider';
import { useAssistant } from '../assistant/AssistantProvider';
import { formatFullDay } from '../../lib/dates';
import { formatTemp, usePreferences } from '../../state/PreferencesProvider';
import styles from './ItineraryView.module.css';

interface ItineraryViewProps {
  trip: Trip;
  dayIndex: number;
  onDayChange: (dayIndex: number) => void;
}

export function ItineraryView({ trip, dayIndex, onDayChange }: ItineraryViewProps) {
  const { isDone, toggleDone } = useTrips();
  const assistant = useAssistant();
  const { units } = usePreferences().preferences;
  const [dismissed, setDismissed] = useState<Record<string, true>>({});

  const day = trip.days[dayIndex];
  const date = dayDate(trip, dayIndex);
  const doneCount = day.items.filter((a) => isDone(a.id)).length;
  const bookingsById = new Map(trip.bookings.map((b) => [b.id, b]));
  const alert = day.weather.alert && !dismissed[day.id] ? day.weather.alert : null;

  return (
    <div className={styles.view}>
      <DaySelector trip={trip} selected={dayIndex} onSelect={onDayChange} />

      <header className={styles.dayHeader}>
        <p className={`t-meta ${styles.dayMeta}`}>
          Day {String(dayIndex + 1).padStart(2, '0')}
          {date && ` · ${formatFullDay(date)}`}
        </p>
        <h2 className={styles.dayTitle}>{day.title}</h2>
        <p className={styles.daySummary}>{day.summary}</p>

        <div className={styles.dayFacts}>
          <span className={styles.weather}>
            <Icon name={day.weather.kind} size={18} />
            {day.weather.label} · {formatTemp(day.weather.high, units)} / {formatTemp(day.weather.low, units)}
          </span>
          <span className={styles.progress}>
            <span className={styles.progressText}>
              {doneCount} of {day.items.length} done
            </span>
            <ProgressBar value={doneCount} max={day.items.length} label={`Day ${dayIndex + 1} progress`} className={styles.progressBar} />
          </span>
        </div>
      </header>

      {alert && (
        <WeatherAlert
          alert={alert}
          onAdapt={() => assistant.open(alert.prompt)}
          onDismiss={() => setDismissed((d) => ({ ...d, [day.id]: true }))}
        />
      )}

      <ol className={styles.timeline} aria-label={`Plan for day ${dayIndex + 1}`}>
        {day.items.map((a, i) => (
          <ActivityRow
            key={a.id}
            activity={a}
            booking={a.bookingId ? bookingsById.get(a.bookingId) : undefined}
            done={isDone(a.id)}
            isLast={i === day.items.length - 1}
            onToggle={() => toggleDone(a.id)}
          />
        ))}
      </ol>
    </div>
  );
}
