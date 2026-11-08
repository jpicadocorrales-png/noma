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
  /** Months (1–12) when the destination is at its best. */
  seasonMonths: number[];
  seasonNote: string;
  firstVisit: string;
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
    seasonMonths: [4, 11, 12],
    seasonNote: 'The maples peak in late November and cherry blossom arrives in early April. Summer is hot and humid; winter is quiet and clear.',
    firstVisit: 'Stay in Higashiyama so the old lanes are on your doorstep, and give Arashiyama and Fushimi Inari a morning each, before the crowds arrive.',
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
    seasonMonths: [3, 4, 5, 6, 9, 10],
    seasonNote: 'Spring and early autumn are warm without August’s heat and crowds. Winter is mild but often rainy.',
    firstVisit: 'Stay in Príncipe Real or Chiado. Walk Alfama on day one, and keep half a day for Belém and another for Sintra.',
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
    seasonMonths: [3, 4, 5, 10, 11],
    seasonNote: 'Spring blossom and autumn leaves come with the best weather. July and August are hot and humid; winter is cold but bright.',
    firstVisit: 'Split your stay between two neighbourhoods, such as Shibuya and Asakusa, so each half of the city feels close. Get a Suica card on day one.',
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
    seasonMonths: [5, 6, 9],
    seasonNote: 'May, June and September are warm enough to swim, with fewer people than July and August. Many places close from November to March.',
    firstVisit: 'Stay in one village rather than moving between five. Vernazza or Manarola work well: hike one stretch of the path and take the train back.',
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
    seasonMonths: [4, 5, 6, 9, 10],
    seasonNote: 'Spring and early autumn are mild and mostly dry. Late September adds the grape harvest up the Douro valley.',
    firstVisit: 'Stay near Ribeira or Bolhão, cross to Gaia for the port lodges, and save one evening for sunset from the Jardim do Morro.',
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
    seasonMonths: [4, 5, 6, 7, 8, 9, 10],
    seasonNote: 'April to October is the dry season. From November to March, expect heavy afternoon rain, though the highlands are greener and quieter.',
    firstVisit: 'Split the trip between Ubud and the coast, and hire a driver for the highland temples rather than riding a scooter on mountain roads.',
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
    seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    seasonNote: 'It’s reachable all year. Summer brings near-endless light; from September to March, clear nights can bring the aurora.',
    firstVisit: 'Treat it as a stop on a Ring Road drive. Stay in Höfn and come at sunrise or sunset, when the light on Vestrahorn is at its best.',
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
    seasonMonths: [10, 11, 12, 1, 2, 3, 4],
    seasonNote: 'October to April is dry and mild. Summer is hot, with storms that can cancel sailings.',
    firstVisit: 'Book an overnight boat into Lan Ha Bay rather than a day trip, and pick one that includes kayaks.',
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
    seasonMonths: [5, 9, 10],
    seasonNote: 'May and late September bring a warm sea and thinner crowds. July and August are packed, and many hotels close in winter.',
    firstVisit: 'Stay in Imerovigli or Firostefani for caldera views, walk to Oia instead of taking the bus, and swim at the red and black beaches in the south.',
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
    seasonMonths: [9, 10, 11, 12, 1, 2, 3],
    seasonNote: 'September to March brings the dark skies the aurora needs. In June the midnight sun means no darkness at all.',
    firstVisit: 'Book a guided aurora chase early in your stay, so you have spare nights if the first one is cloudy.',
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
