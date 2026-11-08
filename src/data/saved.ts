import { featured, trending } from './explore';
import type { PhotoRef } from './trips';

export type SavedKind = 'destination' | 'place' | 'food' | 'stay';

export interface SavedItem {
  id: string;
  kind: SavedKind;
  name: string;
  location: string;
  note: string;
  photo: PhotoRef;
}

export const SAVED_KIND_LABELS: Record<SavedKind, string> = {
  destination: 'Destination',
  place: 'Place',
  food: 'Food & drink',
  stay: 'Stay',
};

/** Places that only exist in the Saved sample (not on Explore). */
const savedOnly: SavedItem[] = [
  {
    id: 'braies',
    kind: 'place',
    name: 'Lago di Braies',
    location: 'Dolomites / IT',
    note: 'Rent a rowboat before 9 am, ahead of the tour buses.',
    photo: { id: '1501785888041-af3ef285b470', alt: 'A wooden rowboat on the turquoise water of Lago di Braies beneath steep peaks', focus: '50% 60%' },
  },
  {
    id: 'santorini',
    kind: 'destination',
    name: 'Santorini',
    location: 'Oia / GR',
    note: 'Whitewashed lanes and caldera sunsets. Best in May or late September.',
    photo: { id: '1533105079780-92b9be482077', alt: 'Whitewashed steps in Oia leading down toward the blue Aegean', focus: '50% 50%' },
  },
  {
    id: 'wine-bar',
    kind: 'food',
    name: 'Natural wine bar',
    location: 'Príncipe Real, Lisbon / PT',
    note: 'Small plates and Portuguese natural wines. Walk-ins only after 7.',
    photo: { id: '1517248135467-4c7edcad34c4', alt: 'A dim restaurant interior with leather banquettes and warm pendant lights', focus: '50% 50%' },
  },
  {
    id: 'ubud-villa',
    kind: 'stay',
    name: 'Jungle pool villa',
    location: 'Ubud, Bali / ID',
    note: 'A private pool under thatched roofs. Book about three months ahead.',
    photo: { id: '1520250497591-112f2f40a3f4', alt: 'A resort pool lined with loungers beneath thatched pavilions and palms', focus: '50% 55%' },
  },
  {
    id: 'tromso',
    kind: 'destination',
    name: 'Tromsø',
    location: 'Troms / NO',
    note: 'Aurora season runs September to March. Stay outside the city lights.',
    photo: { id: '1531366936337-7c912a4589a7', alt: 'Green northern lights over a snowy Arctic landscape at night', focus: '50% 40%' },
  },
];

/** Everything a traveler can save, keyed by id. */
export const SAVABLE: Map<string, SavedItem> = new Map(
  [
    ...savedOnly,
    {
      id: featured.id,
      kind: 'destination' as const,
      name: featured.name,
      location: featured.location,
      note: featured.description,
      photo: featured.photo,
    },
    ...trending.map((d) => ({
      id: d.id,
      kind: (d.id === 'stokksnes' ? 'place' : 'destination') as SavedKind,
      name: d.name,
      location: d.location,
      note: d.note,
      photo: d.photo,
    })),
  ].map((item) => [item.id, item]),
);

/** Sample saves: [id, saved how many days ago]. Newest first. */
export const SAMPLE_SAVES: Array<[string, number]> = [
  ['braies', 1],
  ['tokyo', 2],
  ['santorini', 5],
  ['wine-bar', 9],
  ['stokksnes', 14],
  ['ubud-villa', 21],
  ['tromso', 34],
];
