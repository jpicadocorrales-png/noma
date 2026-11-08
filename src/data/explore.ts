/**
 * Editorial content for Explore Home.
 * Static for now; shaped like the API payload we expect later.
 */

export interface FeaturedDestination {
  id: string;
  name: string;
  location: string; // "KYOTO / JP"
  region: string;
  coordinates: string;
  description: string;
  facts: { label: string; value: string }[];
  photo: { id: string; alt: string; focus?: string };
}

export interface Interest {
  id: string;
  label: string;
  count: number;
  photo: { id: string; alt: string; focus?: string };
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  note: string;
  photo: { id: string; alt: string; focus?: string };
}

export interface Collection {
  id: string;
  title: string;
  kicker: string;
  excerpt: string;
  places: number;
  duration: string;
  route: string[];
  intro: string;
  stops: { name: string; days: string; note: string }[];
  photo: { id: string; alt: string; focus?: string };
}

export const featured: FeaturedDestination = {
  id: 'kyoto',
  name: 'Kyoto',
  location: 'Kyoto / JP',
  region: 'Kansai',
  coordinates: '35.0116° N · 135.7681° E',
  description:
    'Lantern-lit lanes, moss gardens and early temple mornings. In maple season, Kyoto rewards those who slow down and wander without a plan.',
  facts: [
    { label: 'Best season', value: 'Nov – Dec' },
    { label: 'Ideal stay', value: '4–5 days' },
  ],
  photo: {
    id: '1493976040374-85c8e12f0c0e',
    alt: 'Evening on a stone lane in Higashiyama, Kyoto, with the Yasaka pagoda rising between wooden houses',
    focus: '50% 45%',
  },
};

export const interests: Interest[] = [
  {
    id: 'nature',
    label: 'Nature',
    count: 214,
    photo: { id: '1508672019048-805c876b67e2', alt: 'A traveler sitting on a lakeside dock between steep green mountains', focus: '50% 60%' },
  },
  {
    id: 'culture',
    label: 'Culture',
    count: 186,
    photo: { id: '1548013146-72479768bada', alt: 'The Taj Mahal framed by a carved sandstone archway', focus: '50% 55%' },
  },
  {
    id: 'food',
    label: 'Food',
    count: 152,
    photo: { id: '1504674900247-0877df9cc836', alt: 'Seared steak, herbs and chillies laid out on a dark table', focus: '50% 50%' },
  },
  {
    id: 'adventure',
    label: 'Adventure',
    count: 97,
    photo: { id: '1551632811-561732d1e306', alt: 'Two hikers with packs walking a ridge toward snow-capped peaks', focus: '60% 50%' },
  },
  {
    id: 'relaxation',
    label: 'Relaxation',
    count: 128,
    photo: { id: '1566073771259-6a8506099945', alt: 'A timber-roofed resort pool glowing at dusk', focus: '50% 60%' },
  },
];

export const trending: Destination[] = [
  {
    id: 'lisbon',
    name: 'Lisbon',
    location: 'Lisbon / PT',
    note: 'Hillside trams & tiled façades',
    photo: { id: '1585208798174-6cedd86e019a', alt: 'A yellow tram climbing a narrow street of pastel buildings in Lisbon', focus: '70% 50%' },
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    location: 'Tokyo / JP',
    note: 'Lantern alleys after dark',
    photo: { id: '1528360983277-13d401cdc186', alt: 'Red paper lanterns glowing in a narrow Tokyo alley at night', focus: '30% 50%' },
  },
  {
    id: 'cinque-terre',
    name: 'Cinque Terre',
    location: 'Liguria / IT',
    note: 'Cliffside villages, sea walks',
    photo: { id: '1516483638261-f4dbaf036963', alt: 'Colourful houses stacked on the cliffs of Manarola above the sea', focus: '45% 50%' },
  },
  {
    id: 'porto',
    name: 'Porto',
    location: 'Porto / PT',
    note: 'Riverside wine lodges',
    photo: { id: '1555881400-74d7acaacd8b', alt: 'Ribeira waterfront in Porto with boats on the Douro river', focus: '50% 50%' },
  },
  {
    id: 'bali',
    name: 'Bali',
    location: 'Bedugul / ID',
    note: 'Lake temples in the highlands',
    photo: { id: '1537996194471-e657df975ab4', alt: 'Pura Ulun Danu Bratan temple reflected on a still lake in Bali', focus: '50% 50%' },
  },
  {
    id: 'stokksnes',
    name: 'Stokksnes',
    location: 'East Iceland / IS',
    note: 'Black sand under Vestrahorn',
    photo: { id: '1504829857797-ddff29c27927', alt: 'Black sand dunes beneath the jagged Vestrahorn mountain in Iceland', focus: '50% 50%' },
  },
  {
    id: 'ha-long',
    name: 'Hạ Long Bay',
    location: 'Quảng Ninh / VN',
    note: 'Limestone karsts by boat',
    photo: { id: '1528127269322-539801943592', alt: 'Boats drifting between limestone karsts in Hạ Long Bay', focus: '50% 50%' },
  },
];

export const collections: Collection[] = [
  {
    id: 'slow-escapes',
    title: 'Slow escapes',
    kicker: 'Portugal · 7 days',
    excerpt:
      'Terraced valleys, long lunches and nowhere to be. A week that moves at the pace of the landscape.',
    places: 12,
    duration: '7 days',
    route: ['Douro', 'Alentejo', 'Comporta'],
    intro:
      'This route trades sights for rhythm. It follows the country south from the terraced vineyards of the north to the rice fields and dunes of the Atlantic coast, with no early alarms and at least one lunch a day that runs past four.',
    stops: [
      { name: 'Douro Valley', days: 'Days 1–3', note: 'Stay at a quinta among the terraces. Taste after the harvest, take the river train, and let lunch last three hours.' },
      { name: 'Alentejo', days: 'Days 4–5', note: 'Cork oaks, whitewashed Évora and the slowest dinners in Portugal. Book a farmhouse with a pool.' },
      { name: 'Comporta', days: 'Days 6–7', note: 'Rice fields, stilt-house restaurants and empty Atlantic beaches to end on.' },
    ],
    photo: {
      id: '1445019980597-93fa8acb246c',
      alt: 'Lounge chairs on a quiet terrace looking out over a misty mountain valley',
      focus: '50% 60%',
    },
  },
  {
    id: 'hidden-gems',
    title: 'Hidden gems',
    kicker: 'Andaman Sea · 10 days',
    excerpt: 'Quiet islands the ferries rarely stop at, with mangrove channels and empty morning beaches.',
    places: 9,
    duration: '10 days',
    route: ['Ko Yao Noi', 'Ko Lanta', 'Ko Libong'],
    intro:
      'Thailand’s Andaman coast still has islands where the longtail is the only traffic. This route hops between three of them, getting quieter at each stop.',
    stops: [
      { name: 'Ko Yao Noi', days: 'Days 1–4', note: 'Cycle past rubber plantations to beaches facing the karsts of Phang Nga Bay.' },
      { name: 'Ko Lanta', days: 'Days 5–7', note: 'Long west-coast beaches, mangroves by kayak and the stilt houses of the old town.' },
      { name: 'Ko Libong', days: 'Days 8–10', note: 'Dugong territory: seagrass meadows, one road and no cash machines.' },
    ],
    photo: {
      id: '1559128010-7c1ad6e1b6a5',
      alt: 'A forested limestone island rising from turquoise water',
      focus: '50% 45%',
    },
  },
  {
    id: 'weekend-getaways',
    title: 'Weekend getaways',
    kicker: 'Øresund · 2 days',
    excerpt: 'Two cities, one bridge. A short list of good cafés, better walks and an evening by the water.',
    places: 15,
    duration: '2 days',
    route: ['Copenhagen', 'Malmö'],
    intro:
      'Two cities, two countries and one bridge, close enough for a single weekend. Spend Saturday in Copenhagen, then cross the Øresund for a slower Sunday in Malmö.',
    stops: [
      { name: 'Copenhagen', days: 'Day 1', note: 'Bakeries in Nørrebro, a harbour swim and a long dinner in Vesterbro.' },
      { name: 'Malmö', days: 'Day 2', note: 'A 35-minute train across the bridge, then falafel, Västra Hamnen and a seaside sauna.' },
    ],
    photo: {
      id: '1554118811-1e0d58224f24',
      alt: 'A sunlit café with plants, wooden tables and an open kitchen',
      focus: '50% 50%',
    },
  },
];
