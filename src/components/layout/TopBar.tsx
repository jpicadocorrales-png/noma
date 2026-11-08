import { NavLink } from 'react-router';
import { NAV_ITEMS } from './navigation';
import { Wordmark } from './Wordmark';
import { cx } from '../../lib/cx';
import styles from './TopBar.module.css';

/**
 * Mobile: a simple masthead that scrolls away.
 * Desktop: a sticky bar that also carries primary navigation.
 */
export function TopBar() {
  return (
    <header className={styles.bar}>
      <div className={cx('container', styles.inner)}>
        <Wordmark />

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cx(styles.link, isActive && styles.active)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className={cx('t-meta', styles.edition)}>
          <span className={styles.editionLabel}>Autumn edit · </span>Nº 11
        </p>
      </div>
    </header>
  );
}
