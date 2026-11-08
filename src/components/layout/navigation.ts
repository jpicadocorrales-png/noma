import type { IconName } from '../ui/Icon';

export interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  /** Other path prefixes that belong to this section. */
  also?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Explore', icon: 'explore', also: ['/discover', '/destinations', '/collections'] },
  { to: '/trips', label: 'My Trips', icon: 'trips' },
  { to: '/saved', label: 'Saved', icon: 'bookmark' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

/** Is this nav item the current section for the given path? */
export function isNavActive(item: NavItem, pathname: string): boolean {
  const matches = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);
  if (item.to === '/') return pathname === '/' || (item.also ?? []).some(matches);
  return matches(item.to) || (item.also ?? []).some(matches);
}
