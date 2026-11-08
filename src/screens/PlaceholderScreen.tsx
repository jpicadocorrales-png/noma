import type { TabId } from '../components/layout/navigation';
import styles from './PlaceholderScreen.module.css';

const COPY: Record<Exclude<TabId, 'explore'>, { title: string; body: string }> = {
  trips: { title: 'My Trips', body: 'Itineraries, reservations and budgets will live here, day by day.' },
  saved: { title: 'Saved', body: 'Places and stories you bookmark while exploring will gather here.' },
  profile: { title: 'Profile', body: 'Your travel style, preferences and memories, all in one place.' },
};

export function PlaceholderScreen({ tab }: { tab: Exclude<TabId, 'explore'> }) {
  const copy = COPY[tab];
  return (
    <section className={`container ${styles.screen}`} aria-labelledby="placeholder-title">
      <p className={`t-meta ${styles.meta}`}>Coming soon</p>
      <h1 id="placeholder-title" className={styles.title}>
        {copy.title}
      </h1>
      <p className={styles.body}>{copy.body}</p>
    </section>
  );
}
