import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { AskNoma } from '../assistant/AskNoma';
import { NAV_ITEMS, type TabId } from './navigation';
import styles from './AppShell.module.css';

interface AppShellProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
}

export function AppShell({ activeTab, onTabChange, children }: AppShellProps) {
  const screenLabel = NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? 'Explore';

  return (
    <div className={styles.shell}>
      <TopBar activeTab={activeTab} onTabChange={onTabChange} />
      <main className={styles.main}>{children}</main>
      <AskNoma context={screenLabel} />
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
