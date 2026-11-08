import { useNavigate } from 'react-router';
import { SearchBar } from '../ui/SearchBar';
import styles from './WelcomeSection.module.css';

export function WelcomeSection() {
  const navigate = useNavigate();

  return (
    <section className={styles.welcome} aria-labelledby="welcome-title">
      <div className={styles.heading}>
        <p className={`t-eyebrow ${styles.eyebrow}`}>Explore</p>
        <h1 id="welcome-title" className={styles.title}>
          Where to <em>next?</em>
        </h1>
      </div>
      <div className={styles.aside}>
        <p className={styles.lede}>
          Find places shaped around how you like to travel, then plan the whole journey in one place.
        </p>
        <SearchBar onSearch={(q) => navigate(`/discover?q=${encodeURIComponent(q)}`)} />
      </div>
    </section>
  );
}
