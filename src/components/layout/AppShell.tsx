import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { AskNoma } from '../assistant/AskNoma';
import styles from './AppShell.module.css';

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  // New screen → start at the top (query-string changes keep position).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <TopBar />
      <main className={styles.main}>{children}</main>
      <AskNoma />
      <BottomNav />
    </div>
  );
}
