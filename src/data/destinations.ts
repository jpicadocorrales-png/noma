import { SAVABLE, type SavedItem } from './saved';

export type InterestId = 'nature' | 'culture' | 'food' | 'adventure' | 'relaxation';

export interface Highlight {
  name: string;
  kind: string;
  note: string;
}

export interface DestinationDetail {
  id: string;
  region: string;
  coordinates: string;
  tagline: string;
  description: string;
  interests: InterestId[];
  bestSeason: string;
  idealStay: string;
  gettingAround: string;
  highlights: Highlight[];
}

/** Editorial detail per destination. Name, location and photo come from the shared catalog (SAVABLE). */
const DETAILS: DestinationDetail[] = [
  {
    id: 'kyoto',
    region: 'Kansai',
    coordinates: '35.0116° N · 135.7681° E',
    tagline: 'Temples, gardens and maple season, paced slowly.',
    description:
      'Lantern-lit lanes, moss gardens and early temple mornings. In maple season, Kyoto rewards those who slow down and wander without a plan. Base yourself in Higashiyama and walk everywhere you can.',
    interests: ['culture', 'food', 'nature'],
    bestSeason: 'Nov – Dec · Apr',
    idealStay: '4–5 days',
    gettingAround: 'Buses, bikes, walking',
    highlights: [
      { name: 'Kiyomizu-dera', kind: 'Temple', note: 'Arrive at opening to have the wooden stage almost to yourself.' },
      { name: 'Philosopher’s Path', kind: 'Walk', note: 'Two kilometres of canal-side maples between temples.' },
      { name: 'Nishiki Market', kind: 'Food', note: 'Five blocks of pickles, tofu, tea and knife shops.' },
      { name: 'Fushimi Inari', kind: 'Hike', note: 'Climb past the first gates and the crowds thin out fast.' },
    ],
  },
  {
    id: 'lisbon',
    region: 'Estremadura',
    coordinates: '38.7223° N · 9.1393° W',
    tagline: 'Hillside trams, tiled façades and long lunches.',
    description:
      'Seven hills, a river light painters chase, and a food scene that rewards slow lunches. Lisbon is best explored on foot, one miradouro at a time, with a pastel de nata never far away.',
    interests: ['culture', 'food'],
    bestSeason: 'Mar – Jun · Sep – Oct',
    idealStay: '3–4 days',
    gettingAround: 'Trams, metro, walking',
    highlights: [
      { name: 'Alfama', kind: 'Neighbourhood', note: 'Get lost below the castle; fado drifts out after dark.' },
      { name: 'Tram 28', kind: 'Ride', note: 'Board at Martim Moniz early to get a seat by the window.' },
      { name: 'Belém', kind: 'Sight', note: 'Jerónimos Monastery, then pastéis still warm from the oven.' },
      { name: 'Senhora do Monte', kind: 'Viewpoint', note: 'The widest view of the city, best at sunset.' },
    ],
  },
  {
    id: 'tokyo',
    region: 'Kantō',
    coordinates: '35.6762° N · 139.6503° E',
    tagline: 'Lantern alleys, forest shrines and the best food on earth.',
    description:
      'A city of neighbourhoods, each with its own rhythm: Yanaka’s old wooden streets, Shimokitazawa’s record shops, and alleys of tiny bars that seat six. Plan less than you think and leave room to wander.',
    interests: ['culture', 'food'],
    bestSeason: 'Mar – May · Oct – Nov',
    idealStay: '5–7 days',
    gettingAround: 'Metro and JR lines',
    highlights: [
      { name: 'Omoide Yokochō', kind: 'Food', note: 'Smoky yakitori stalls in the shadow of Shinjuku Station.' },
      { name: 'Meiji Jingū', kind: 'Shrine', note: 'A forest shrine a few minutes’ walk from Harajuku.' },
      { name: 'Yanaka', kind: 'Neighbourhood', note: 'Old Tokyo: temples, cats and family-run shops.' },
      { name: 'Tsukiji Outer Market', kind: 'Food', note: 'Breakfast of tamagoyaki and fresh tuna, standing up.' },
    ],
  },
  {
    id: 'cinque-terre',
    region: 'Liguria',
    coordinates: '44.1461° N · 9.6439° E',
    tagline: 'Five cliffside villages linked by sea paths.',
    description:
      'Five fishing villages cling to the Ligurian cliffs, joined by footpaths through vineyards and lemon terraces. Hike between them in the morning and swim off the rocks by afternoon.',
    interests: ['nature', 'adventure', 'food'],
    bestSeason: 'May – Jun · Sep',
    idealStay: '3 days',
    gettingAround: 'Coastal trains, footpaths',
    highlights: [
      { name: 'Sentiero Azzurro', kind: 'Hike', note: 'The classic coastal path from Monterosso to Vernazza.' },
      { name: 'Manarola at dusk', kind: 'Viewpoint', note: 'The postcard view from the path above the harbour.' },
      { name: 'Pesto & focaccia', kind: 'Food', note: 'Liguria invented both. Eat them by the water.' },
    ],
  },
  {
    id: 'porto',
    region: 'Norte',
    coordinates: '41.1579° N · 8.6291° W',
    tagline: 'Riverside wine lodges and tiled churches.',
    description:
      'Granite hills tumble down to the Douro, with the port lodges of Gaia across the river. Porto is grittier and warmer than Lisbon, and easy to fall for in a weekend.',
    interests: ['culture', 'food'],
    bestSeason: 'Apr – Jun · Sep – Oct',
    idealStay: '2–3 days',
    gettingAround: 'Walking, metro, funicular',
    highlights: [
      { name: 'Ribeira', kind: 'Neighbourhood', note: 'Waterfront arcades beneath the Dom Luís I bridge.' },
      { name: 'Port lodges, Gaia', kind: 'Tasting', note: 'Tour a cellar, then taste tawnies on a terrace.' },
      { name: 'Livraria Lello', kind: 'Sight', note: 'Book a timed ticket online to skip the queue.' },
    ],
  },
  {
    id: 'bali',
    region: 'Tabanan highlands',
    coordinates: '8.2752° S · 115.1668° E',
    tagline: 'Lake temples, rice terraces and slow mornings.',
    description:
      'Beyond the beach clubs, Bali’s highlands are cool and green: lake temples in the mist, terraces carved into hillsides, and villages where offerings are laid out every morning.',
    interests: ['culture', 'nature', 'relaxation'],
    bestSeason: 'Apr – Oct',
    idealStay: '7–10 days',
    gettingAround: 'Private driver, scooter',
    highlights: [
      { name: 'Ulun Danu Beratan', kind: 'Temple', note: 'A lake temple that seems to float at sunrise.' },
      { name: 'Jatiluwih', kind: 'Walk', note: 'UNESCO-listed rice terraces, far quieter than Tegallalang.' },
      { name: 'Ubud', kind: 'Town', note: 'Craft villages, yoga and the Campuhan ridge walk.' },
    ],
  },
  {
    id: 'stokksnes',
    region: 'East Iceland',
    coordinates: '64.2486° N · 14.9706° W',
    tagline: 'Black sand dunes beneath the Vestrahorn.',
    description:
      'A windswept peninsula where black dunes and tufted grass sit beneath the jagged Vestrahorn. Come at low tide on a still day, when the wet sand mirrors the mountain.',
    interests: ['nature', 'adventure'],
    bestSeason: 'Year-round',
    idealStay: '1 day',
    gettingAround: 'Self-drive on the Ring Road',
    highlights: [
      { name: 'Vestrahorn reflections', kind: 'Viewpoint', note: 'Low tide and no wind give you the mirror shot.' },
      { name: 'Viking Café', kind: 'Food', note: 'Waffles and coffee where you pay the small land fee.' },
      { name: 'Höfn', kind: 'Town', note: 'The nearest harbour town, famous for langoustine.' },
    ],
  },
  {
    id: 'ha-long',
    region: 'Quảng Ninh',
    coordinates: '20.9101° N · 107.1839° E',
    tagline: 'Limestone karsts, best seen slowly by boat.',
    description:
      'Nearly two thousand limestone islands rise from emerald water. Skip the day trips: an overnight boat into quieter Lan Ha Bay lets you kayak at dawn before anyone else arrives.',
    interests: ['nature', 'relaxation', 'adventure'],
    bestSeason: 'Oct – Apr',
    idealStay: '2 days',
    gettingAround: 'Overnight boat, kayak',
    highlights: [
      { name: 'Lan Ha Bay', kind: 'Boat', note: 'Quieter than Hạ Long proper, with better kayaking.' },
      { name: 'Sửng Sốt Cave', kind: 'Sight', note: 'Vast chambers; go early before the tour groups.' },
      { name: 'Cát Bà Island', kind: 'Hike', note: 'Forest trails up to the island’s viewpoints.' },
    ],
  },
  {
    id: 'santorini',
    region: 'Cyclades',
    coordinates: '36.4618° N · 25.3753° E',
    tagline: 'Whitewashed lanes and caldera sunsets.',
    description:
      'A volcanic crescent of white villages stacked on cliffs above the caldera. Stay in Imerovigli for the views without Oia’s crowds, and watch the famous sunset from a boat instead.',
    interests: ['culture', 'relaxation', 'food'],
    bestSeason: 'May · Sep – Oct',
    idealStay: '3–4 days',
    gettingAround: 'Bus, walking, boat',
    highlights: [
      { name: 'Fira to Oia', kind: 'Hike', note: 'Ten kilometres along the caldera rim; start early.' },
      { name: 'Caldera by boat', kind: 'Experience', note: 'Sunset from the water, away from the crowds.' },
      { name: 'Volcanic wineries', kind: 'Tasting', note: 'Assyrtiko grown in baskets of volcanic soil.' },
    ],
  },
  {
    id: 'tromso',
    region: 'Northern Norway',
    coordinates: '69.6492° N · 18.9553° E',
    tagline: 'Aurora nights and Arctic fjords.',
    description:
      'A small city 350 kilometres above the Arctic Circle, and one of the best bases for the northern lights. Days are for fjords and dog sledding; nights are for chasing clear skies.',
    interests: ['nature', 'adventure'],
    bestSeason: 'Sep – Mar',
    idealStay: '4–5 days',
    gettingAround: 'Guided tours, rental car',
    highlights: [
      { name: 'Aurora chase', kind: 'Experience', note: 'Guides drive toward clear skies, sometimes to Finland.' },
      { name: 'Fjellheisen', kind: 'Viewpoint', note: 'The city and fjord from 420 metres up.' },
      { name: 'Lyngen Alps', kind: 'Nature', note: 'Fjords and peaks a two-hour drive east.' },
    ],
  },
];

export interface Destination extends DestinationDetail {
  name: string;
  location: string;
  photo: SavedItem['photo'];
}

export const DESTINATIONS: Destination[] = DETAILS.flatMap((d) => {
  const base = SAVABLE.get(d.id);
  return base ? [{ ...d, name: base.name, location: base.location, photo: base.photo }] : [];
});

const BY_ID = new Map(DESTINATIONS.map((d) => [d.id, d]));

export const getDestination = (id: string | undefined) => (id ? BY_ID.get(id) : undefined);
export const hasDestinationPage = (id: string) => BY_ID.has(id);

/** Other destinations ranked by shared interests. */
export function relatedDestinations(id: string, limit = 4): Destination[] {
  const self = BY_ID.get(id);
  if (!self) return [];
  return DESTINATIONS.filter((d) => d.id !== id)
    .map((d) => ({ d, score: d.interests.filter((i) => self.interests.includes(i)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ d }) => d);
}

/** Case- and accent-insensitive search across name, place and interests. */
export function searchDestinations(query: string, interest?: string): Destination[] {
  const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const q = normalize(query.trim());
  return DESTINATIONS.filter((d) => {
    if (interest && !d.interests.includes(interest as InterestId)) return false;
    if (!q) return true;
    const haystack = normalize([d.name, d.location, d.region, d.tagline, ...d.interests].join(' '));
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}
