import { Link, useLocation } from 'react-router';
import { NAV_ITEMS, isNavActive } from './navigation';
import { Icon } from '../ui/Icon';
import { cx } from '../../lib/cx';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item, pathname);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cx(styles.item, active && styles.active)}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  filled={active && item.icon === 'bookmark'}
                  strokeWidth={active ? 1.8 : 1.6}
                />
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
