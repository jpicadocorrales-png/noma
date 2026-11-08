import { Link } from 'react-router';
import { EARLIER_JOURNEYS } from '../../data/profile';
import { tripDates, tripStatus, useTrips } from '../../state/TripsProvider';
import { cx } from '../../lib/cx';
import styles from './JourneyTimeline.module.css';

interface Entry {
  key: string;
  name: string;
  location: string;
  month: string;
  year: number;
  sort: number;
  to?: string;
  upcoming?: boolean;
}

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Trips by year, newest first: the upcoming plan, past trips, then earlier journeys. */
export function JourneyTimeline() {
  const { trips, today } = useTrips();
  const thisYear = today.getFullYear();

  const fromTrips: Entry[] = trips.flatMap((t) => {
    const dates = tripDates(t);
    const status = tripStatus(t, today);
    if (!dates || status === 'idea') return [];
    return [
      {
        key: t.id,
        name: t.name,
        location: t.location,
        month: monthFmt.format(dates.start),
        year: dates.start.getFullYear(),
        sort: dates.start.getTime(),
        to: `/trips/${t.id}`,
        upcoming: status !== 'past',
      },
    ];
  });

  const earlier: Entry[] = EARLIER_JOURNEYS.map((j, i) => ({
    key: `earlier-${i}`,
    name: j.name,
    location: j.location,
    month: j.month,
    year: thisYear - j.yearsAgo,
    sort: new Date(thisYear - j.yearsAgo, MONTHS.indexOf(j.month), 1).getTime(),
  }));

  const entries = [...fromTrips, ...earlier].sort((a, b) => b.sort - a.sort);
  const years = [...new Set(entries.map((e) => e.year))];

  return (
    <ol className={styles.timeline}>
      {years.map((year) => (
        <li key={year} className={styles.year}>
          <p className={styles.yearLabel}>{year}</p>
          <ol className={styles.entries}>
            {entries
              .filter((e) => e.year === year)
              .map((e) => (
                <li key={e.key} className={cx(styles.entry, e.upcoming && styles.upcoming)}>
                  <span className={styles.dot} aria-hidden="true" />
                  <div className={styles.text}>
                    <p className={styles.name}>
                      {e.to ? (
                        <Link to={e.to} className={styles.link}>
                          {e.name}
                        </Link>
                      ) : (
                        e.name
                      )}
                    </p>
                    <p className={`t-meta ${styles.location}`}>{e.location}</p>
                  </div>
                  <span className={styles.when}>{e.upcoming ? `${e.month} · Next` : e.month}</span>
                </li>
              ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
