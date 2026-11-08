import type { SVGProps } from 'react';

/**
 * NOMA's icon set: a single 1.6px line weight on a 24px grid.
 * Kept deliberately small and custom — no generic travel clip-art.
 */
const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.25" />
      <path d="m19.5 19.5-3.9-3.9" />
    </>
  ),
  'arrow-right': <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M8.5 7H17v8.5" />,
  'arrow-up': <path d="M12 19.5v-15M6 10.5l6-6 6 6" />,
  'chevron-left': <path d="m14.5 6-6 6 6 6" />,
  'chevron-right': <path d="m9.5 6 6 6-6 6" />,
  bookmark: <path d="M6.75 4.75h10.5v14.5L12 15.6l-5.25 3.65Z" />,
  close: <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />,
  'arrow-left': <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />,
  check: <path d="m5.5 12.5 4 4 9-9.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="3.75" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </>
  ),
  cloud: <path d="M7.5 18.5h9.25a3.75 3.75 0 0 0 .4-7.48A5.25 5.25 0 0 0 7.1 10.6 3.95 3.95 0 0 0 7.5 18.5Z" />,
  rain: (
    <>
      <path d="M7.5 15h9.25a3.75 3.75 0 0 0 .4-7.48A5.25 5.25 0 0 0 7.1 7.1 3.95 3.95 0 0 0 7.5 15Z" />
      <path d="m9 18-1 2.5M13 18l-1 2.5M17 18l-1 2.5" />
    </>
  ),
  // Explore — layered editorial frames
  explore: (
    <>
      <rect x="4" y="7.5" width="12" height="12.5" rx="2.5" />
      <path d="M8.5 4H17.5A2.5 2.5 0 0 1 20 6.5V15.5" />
    </>
  ),
  // My Trips — a route between two stops
  trips: (
    <>
      <circle cx="5.5" cy="18" r="2" />
      <circle cx="18.5" cy="6" r="2" />
      <path d="M7.5 18h7a3 3 0 0 0 0-6h-5a3 3 0 0 1 0-6h7" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1.2-3.5 3.9-5.4 7-5.4s5.8 1.9 7 5.4" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  filled?: boolean;
}

export function Icon({ name, size = 20, filled = false, strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
