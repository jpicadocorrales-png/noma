import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import type { TabId } from './components/layout/navigation';
import { ExploreHome } from './screens/ExploreHome';
import { PlaceholderScreen } from './screens/PlaceholderScreen';

export function App() {
  const [tab, setTab] = useState<TabId>('explore');

  const handleTabChange = (next: TabId) => {
    setTab(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <AppShell activeTab={tab} onTabChange={handleTabChange}>
      {tab === 'explore' ? <ExploreHome /> : <PlaceholderScreen tab={tab} />}
    </AppShell>
  );
}
