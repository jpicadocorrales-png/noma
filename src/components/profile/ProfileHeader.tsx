import { Link } from 'react-router';
import { traveler } from '../../data/profile';
import { useSaved } from '../../state/SavedProvider';
import styles from './ProfileHeader.module.css';

export function ProfileHeader() {
  const { entries } = useSaved();
  const stats = [...traveler.stats, { label: 'Saved', value: String(entries.length), to: '/saved' }];

  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <div className={styles.avatar} aria-hidden="true">
          {traveler.initials}
        </div>
        <div>
          <p className={`t-eyebrow ${styles.eyebrow}`}>Profile</p>
          <h1 className={styles.name}>{traveler.name}</h1>
          <p className={styles.meta}>
            Based in {traveler.homeBase} · Exploring since {traveler.exploringSince}
          </p>
        </div>
      </div>

      <dl className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <dt className="t-meta">{s.label}</dt>
            <dd>
              {'to' in s && s.to ? (
                <Link to={s.to} className={styles.statLink}>
                  {s.value}
                </Link>
              ) : (
                s.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
