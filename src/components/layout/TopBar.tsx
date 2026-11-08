import { Link, useLocation } from 'react-router';
import { NAV_ITEMS, isNavActive } from './navigation';
import { Wordmark } from './Wordmark';
import { cx } from '../../lib/cx';
import styles from './TopBar.module.css';

/**
 * Mobile: a simple masthead that scrolls away.
 * Desktop: a sticky bar that also carries primary navigation.
 */
export function TopBar() {
  const { pathname } = useLocation();

  return (
    <header className={styles.bar}>
      <div className={cx('container', styles.inner)}>
        <Wordmark />

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item, pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cx(styles.link, active && styles.active)}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className={cx('t-meta', styles.edition)}>
          <span className={styles.editionLabel}>Autumn edit · </span>Nº 11
        </p>
      </div>
    </header>
  );
}
