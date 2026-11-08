import { NavLink } from 'react-router';
import { NAV_ITEMS } from './navigation';
import { Icon } from '../ui/Icon';
import { cx } from '../../lib/cx';
import styles from './BottomNav.module.css';

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.end} className={({ isActive }) => cx(styles.item, isActive && styles.active)}>
              {({ isActive }) => (
                <>
                  <Icon
                    name={item.icon}
                    size={22}
                    filled={isActive && item.icon === 'bookmark'}
                    strokeWidth={isActive ? 1.8 : 1.6}
                  />
                  <span className={styles.label}>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
