import { NAV_ITEMS, type TabId } from './navigation';
import { Icon } from '../ui/Icon';
import { cx } from '../../lib/cx';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => {
          const active = item.id === activeTab;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={cx(styles.item, active && styles.active)}
                aria-current={active ? 'page' : undefined}
                onClick={() => onTabChange(item.id)}
              >
                <Icon name={item.icon} size={22} filled={active && item.id === 'saved'} strokeWidth={active ? 1.8 : 1.6} />
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
