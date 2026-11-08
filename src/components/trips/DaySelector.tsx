import { useEffect, useRef } from 'react';
import type { Trip } from '../../data/trips';
import { Icon } from '../ui/Icon';
import { dayDate } from '../../state/TripsProvider';
import { formatWeekday } from '../../lib/dates';
import { cx } from '../../lib/cx';
import rail from '../ui/rail.module.css';
import styles from './DaySelector.module.css';

interface DaySelectorProps {
  trip: Trip;
  selected: number;
  onSelect: (dayIndex: number) => void;
}

export function DaySelector({ trip, selected, onSelect }: DaySelectorProps) {
  const listRef = useRef<HTMLOListElement>(null);

  // Keep the selected day fully visible inside the scrolling rail (phones).
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[selected] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    const pad = parseFloat(getComputedStyle(list).paddingLeft) || 0;
    const left = item.offsetLeft - list.offsetLeft - pad;
    const right = left + item.offsetWidth + pad * 2;
    if (left < list.scrollLeft || right > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: Math.max(0, left - list.clientWidth / 2 + item.offsetWidth / 2 + pad), behavior: 'smooth' });
    }
  }, [selected]);

  return (
    <ol ref={listRef} className={cx(rail.rail, styles.days)} aria-label="Trip days">
      {trip.days.map((day, i) => {
        const date = dayDate(trip, i);
        const active = i === selected;
        return (
          <li key={day.id}>
            <button
              type="button"
              className={cx(styles.day, active && styles.active)}
              aria-pressed={active}
              onClick={() => onSelect(i)}
            >
              <span className={`t-meta ${styles.index}`}>Day {String(i + 1).padStart(2, '0')}</span>
              <span className={styles.date}>
                {date ? (
                  <>
                    {formatWeekday(date)} <strong>{date.getDate()}</strong>
                  </>
                ) : (
                  `Day ${i + 1}`
                )}
              </span>
              <Icon
                name={day.weather.kind}
                size={18}
                className={cx(styles.weather, day.weather.alert && styles.weatherAlert)}
                aria-label={day.weather.label}
                aria-hidden={undefined}
                role="img"
              />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
