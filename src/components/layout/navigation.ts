import type { IconName } from '../ui/Icon';

export type TabId = 'explore' | 'trips' | 'saved' | 'profile';

export interface NavItem {
  id: TabId;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'explore', label: 'Explore', icon: 'explore' },
  { id: 'trips', label: 'My Trips', icon: 'trips' },
  { id: 'saved', label: 'Saved', icon: 'bookmark' },
  { id: 'profile', label: 'Profile', icon: 'profile' },
];
