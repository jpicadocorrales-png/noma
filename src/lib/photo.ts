/**
 * Photography is served from Unsplash's image CDN so we can request
 * exactly the crop/size each layout needs.
 */
const BASE = 'https://images.unsplash.com/photo-';
const WIDTHS = [400, 640, 960, 1280, 1800, 2400];

export function photoUrl(id: string, width: number, quality = 75): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export function photoSrcSet(id: string, maxWidth = 2400): string {
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${photoUrl(id, w)} ${w}w`)
    .join(', ');
}
