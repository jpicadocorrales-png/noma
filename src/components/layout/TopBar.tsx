import { NAV_ITEMS, type TabId } from './navigation';
import { Wordmark } from './Wordmark';
import { cx } from '../../lib/cx';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

/**
 * Mobile: a simple masthead that scrolls away.
 * Desktop: a sticky bar that also carries primary navigation.
 */
export function TopBar({ activeTab, onTabChange }: TopBarProps) {
  return (
    <header className={styles.bar}>
      <div className={cx('container', styles.inner)}>
        <Wordmark />

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cx(styles.link, activeTab === item.id && styles.active)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              onClick={() => onTabChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <p className={cx('t-meta', styles.edition)}>
          <span className={styles.editionLabel}>Autumn edit · </span>Nº 11
        </p>
      </div>
    </header>
  );
}
