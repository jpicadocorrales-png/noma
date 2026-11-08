import { Link } from 'react-router';
import { useAssistantScreen } from '../components/assistant/AssistantProvider';
import styles from './PlaceholderScreen.module.css';

const COPY = {
  notFound: { meta: 'Off the map', title: 'Page not found', body: 'This route doesn’t lead anywhere yet.' },
} as const;

export function PlaceholderScreen({ screen }: { screen: keyof typeof COPY }) {
  const copy = COPY[screen];
  useAssistantScreen(copy.title, []);

  return (
    <section className={`container ${styles.screen}`} aria-labelledby="placeholder-title">
      <p className={`t-meta ${styles.meta}`}>{copy.meta}</p>
      <h1 id="placeholder-title" className={styles.title}>
        {copy.title}
      </h1>
      <p className={styles.body}>{copy.body}</p>
      {screen === 'notFound' && (
        <Link to="/" className={styles.link}>
          Back to Explore
        </Link>
      )}
    </section>
  );
}
