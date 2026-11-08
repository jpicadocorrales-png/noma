import { addDays, toISODate } from '../lib/dates';

/* ---------- Types ---------- */

export interface PhotoRef {
  id: string;
  alt: string;
  focus?: string;
}

export type ActivityCategory = 'sight' | 'food' | 'stay' | 'transit' | 'experience';

export interface Activity {
  id: string;
  time: string; // "07:00"
  title: string;
  place: string;
  category: ActivityCategory;
  duration?: string;
  note?: string;
  bookingId?: string;
  /** How to reach the next stop, e.g. "8 min walk". */
  transit?: string;
}

export interface WeatherAlert {
  title: string;
  body: string;
  /** Prefilled request for Ask NOMA. The traveler decides whether to send it. */
  prompt: string;
}

export interface Weather {
  kind: 'sun' | 'cloud' | 'rain';
  label: string;
  high: number;
  low: number;
  alert?: WeatherAlert;
}

export interface TripDay {
  id: string;
  title: string;
  summary: string;
  weather: Weather;
  items: Activity[];
}

export type BookingKind = 'flight' | 'train' | 'stay' | 'dining' | 'experience';

export interface Booking {
  id: string;
  kind: BookingKind;
  title: string;
  provider: string;
  detail: string;
  dayIndex: number;
  time: string;
  reference: string;
  status: 'confirmed' | 'pending';
  amount: number;
  categoryId: BudgetCategoryId;
}

export type BudgetCategoryId = 'transport' | 'stay' | 'food' | 'experiences' | 'other';

export interface BudgetCategory {
  id: BudgetCategoryId;
  label: string;
  planned: number;
}

export interface Expense {
  id: string;
  categoryId: BudgetCategoryId;
  label: string;
  amount: number;
  dayIndex: number;
}

export interface Budget {
  planned: number;
  categories: BudgetCategory[];
  /** Spending not tied to a booking. Bookings count toward the budget automatically. */
  expenses: Expense[];
}

export interface Trip {
  id: string;
  name: string;
  location: string; // "Kyoto / JP"
  region: string;
  photo: PhotoRef;
  summary: string;
  /** ISO date; null while a trip is still an idea. */
  startDate: string | null;
  travelers: number;
  /** Tentative timing for ideas, e.g. "Spring 2027". */
  tentative?: string;
  savedPlaces?: number;
  stats?: { label: string; value: string }[];
  days: TripDay[];
  bookings: Booking[];
  budget: Budget | null;
}

export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  sight: 'Sight',
  food: 'Food & drink',
  stay: 'Stay',
  transit: 'Transit',
  experience: 'Experience',
};

export const BOOKING_LABELS: Record<BookingKind, string> = {
  flight: 'Flight',
  train: 'Train',
  stay: 'Stay',
  dining: 'Dining',
  experience: 'Experience',
};

/* ---------- Sample data ---------- */

/**
 * Sample trips are dated relative to today, so the Kyoto trip is always
 * upcoming whenever someone opens the app.
 */
export function createSampleTrips(today: Date): Trip[] {
  const kyotoStart = addDays(today, 10);
  const lisbonStart = addDays(today, -236);

  return [
    {
      id: 'kyoto',
      name: 'Kyoto',
      location: 'Kyoto / JP',
      region: 'Kansai',
      summary: 'Five days of temples, gardens and maple season, paced slowly.',
      photo: {
        id: '1493976040374-85c8e12f0c0e',
        alt: 'Evening on a stone lane in Higashiyama with the Yasaka pagoda rising between wooden houses',
        focus: '50% 40%',
      },
      startDate: toISODate(kyotoStart),
      travelers: 2,
      days: kyotoDays,
      bookings: kyotoBookings,
      budget: {
        planned: 5300,
        categories: [
          { id: 'transport', label: 'Transport', planned: 2000 },
          { id: 'stay', label: 'Stay', planned: 1300 },
          { id: 'food', label: 'Food & drink', planned: 1000 },
          { id: 'experiences', label: 'Experiences', planned: 600 },
          { id: 'other', label: 'Other', planned: 400 },
        ],
        expenses: [{ id: 'e-ic', categoryId: 'other', label: 'ICOCA transit cards', amount: 40, dayIndex: 0 }],
      },
    },
    {
      id: 'douro',
      name: 'Douro Valley',
      location: 'Douro / PT',
      region: 'Northern Portugal',
      summary: 'A slow week among terraced vineyards. Dates not set yet.',
      photo: {
        id: '1445019980597-93fa8acb246c',
        alt: 'Lounge chairs on a quiet terrace above a misty valley',
        focus: '50% 60%',
      },
      startDate: null,
      tentative: 'Spring 2027',
      travelers: 2,
      savedPlaces: 6,
      days: [],
      bookings: [],
      budget: null,
    },
    {
      id: 'lisbon',
      name: 'Lisbon',
      location: 'Lisbon / PT',
      region: 'Estremadura',
      summary: 'Trams, miradouros and long dinners in Alfama.',
      photo: {
        id: '1585208798174-6cedd86e019a',
        alt: 'A yellow tram climbing a narrow Lisbon street',
        focus: '70% 50%',
      },
      startDate: toISODate(lisbonStart),
      travelers: 2,
      stats: [
        { label: 'Days', value: '5' },
        { label: 'Places', value: '14' },
      ],
      days: [],
      bookings: [],
      budget: null,
    },
  ];
}

const kyotoDays: TripDay[] = [
  {
    id: 'd1',
    title: 'Arrival & a first evening in Gion',
    summary: 'Land, settle into the machiya, then an easy first walk through lantern-lit Gion.',
    weather: { kind: 'cloud', label: 'Cloudy', high: 16, low: 9 },
    items: [
      { id: 'd1-1', time: '14:10', title: 'Land at Kansai International', place: 'KIX · Terminal 1', category: 'transit', bookingId: 'b-flight-out', transit: '20 min to platform' },
      { id: 'd1-2', time: '16:00', title: 'Haruka Express to Kyoto', place: 'KIX → Kyoto Station', category: 'transit', duration: '75 min', bookingId: 'b-train-in', transit: '15 min taxi' },
      { id: 'd1-3', time: '17:30', title: 'Check in to the machiya', place: 'Higashiyama', category: 'stay', note: 'Your host meets you at the door with keys and tea.', bookingId: 'b-stay', transit: '10 min walk' },
      { id: 'd1-4', time: '18:30', title: 'Evening walk through Gion', place: 'Hanamikōji Street', category: 'sight', duration: '1 h', transit: '5 min walk' },
      { id: 'd1-5', time: '19:45', title: 'Kaiseki dinner', place: 'Gion Shirakawa', category: 'food', duration: '2 h', bookingId: 'b-dinner' },
    ],
  },
  {
    id: 'd2',
    title: 'Higashiyama at first light',
    summary: 'Beat the crowds to Kiyomizu-dera, then follow the maples north along the Philosopher’s Path.',
    weather: { kind: 'sun', label: 'Clear', high: 17, low: 8 },
    items: [
      { id: 'd2-1', time: '07:00', title: 'Kiyomizu-dera at opening', place: 'Kiyomizu, Higashiyama', category: 'sight', duration: '1 h 30', note: 'Head straight to the wooden stage. The light is best before 8.', transit: '8 min walk' },
      { id: 'd2-2', time: '08:45', title: 'Sannenzaka & Ninenzaka', place: 'Historic stone lanes', category: 'sight', duration: '1 h', transit: '5 min walk' },
      { id: 'd2-3', time: '10:00', title: 'Matcha & wagashi', place: 'Tea house, Ninenzaka', category: 'food', duration: '45 min', transit: '20 min bus' },
      { id: 'd2-4', time: '12:30', title: 'Yudōfu lunch', place: 'Nanzen-ji temple grounds', category: 'food', duration: '1 h', transit: '5 min walk' },
      { id: 'd2-5', time: '14:00', title: 'Philosopher’s Path', place: 'Nanzen-ji → Ginkaku-ji', category: 'sight', duration: '2 h', note: 'Peak maple colour this week.', transit: '25 min walk' },
      { id: 'd2-6', time: '17:30', title: 'Eikan-dō autumn illumination', place: 'Eikan-dō Zenrin-ji', category: 'experience', duration: '1 h 30', bookingId: 'b-eikando' },
    ],
  },
  {
    id: 'd3',
    title: 'Arashiyama & the western hills',
    summary: 'Bamboo at dawn, a quiet villa garden, and the river by boat.',
    weather: {
      kind: 'rain',
      label: 'Rain from 2 pm',
      high: 14,
      low: 9,
      alert: {
        title: 'Rain expected from 2 pm',
        body: 'The Hozugawa river boat is likely to be cancelled. NOMA can suggest an indoor afternoon nearby. Nothing changes until you approve it.',
        prompt: 'Rework the afternoon of Day 03 around the rain',
      },
    },
    items: [
      { id: 'd3-1', time: '07:30', title: 'Arashiyama bamboo grove', place: 'Sagano', category: 'sight', duration: '45 min', transit: '5 min walk' },
      { id: 'd3-2', time: '08:30', title: 'Tenryū-ji garden', place: 'Arashiyama', category: 'sight', duration: '1 h', transit: '10 min walk' },
      { id: 'd3-3', time: '10:00', title: 'Ōkōchi Sansō villa', place: 'Ogurayama', category: 'sight', duration: '1 h', note: 'Entry includes matcha in the garden tea house.', transit: '15 min walk' },
      { id: 'd3-4', time: '12:00', title: 'Soba by the river', place: 'Togetsukyō Bridge', category: 'food', duration: '1 h', transit: '20 min train' },
      { id: 'd3-5', time: '14:00', title: 'Hozugawa river boat', place: 'Kameoka → Arashiyama', category: 'experience', duration: '2 h', bookingId: 'b-boat' },
    ],
  },
  {
    id: 'd4',
    title: 'Northern temples & Nishiki',
    summary: 'Gold leaf and raked stone in the north, then an afternoon of tasting and making.',
    weather: { kind: 'cloud', label: 'Partly cloudy', high: 15, low: 7 },
    items: [
      { id: 'd4-1', time: '08:00', title: 'Kinkaku-ji', place: 'Kitayama', category: 'sight', duration: '1 h', transit: '20 min walk' },
      { id: 'd4-2', time: '09:30', title: 'Ryōan-ji rock garden', place: 'Ukyō', category: 'sight', duration: '1 h', transit: '30 min bus' },
      { id: 'd4-3', time: '12:00', title: 'Nishiki Market tasting', place: 'Nakagyō', category: 'food', duration: '1 h 30', transit: '15 min walk' },
      { id: 'd4-4', time: '15:00', title: 'Pottery workshop', place: 'Gojōzaka', category: 'experience', duration: '2 h', bookingId: 'b-pottery', transit: '20 min walk' },
      { id: 'd4-5', time: '19:00', title: 'Dinner in Pontochō', place: 'Pontochō Alley', category: 'food', duration: '2 h' },
    ],
  },
  {
    id: 'd5',
    title: 'Fushimi Inari & farewell',
    summary: 'Thousands of torii at dawn, one last coffee, then the long way home.',
    weather: { kind: 'sun', label: 'Clear', high: 16, low: 8 },
    items: [
      { id: 'd5-1', time: '06:30', title: 'Fushimi Inari at dawn', place: 'Fushimi', category: 'sight', duration: '2 h', note: 'Climb to the Yotsutsuji viewpoint, about 45 minutes up.', transit: '15 min train' },
      { id: 'd5-2', time: '09:30', title: 'Coffee & breakfast', place: 'Kawaramachi', category: 'food', duration: '45 min', transit: '20 min taxi' },
      { id: 'd5-3', time: '11:00', title: 'Check out', place: 'Higashiyama', category: 'stay', transit: '15 min taxi' },
      { id: 'd5-4', time: '13:30', title: 'Haruka Express to KIX', place: 'Kyoto Station → KIX', category: 'transit', duration: '75 min', bookingId: 'b-train-out', transit: '2 h check-in' },
      { id: 'd5-5', time: '17:45', title: 'Flight home', place: 'KIX · Terminal 1', category: 'transit', bookingId: 'b-flight-back' },
    ],
  },
];

const kyotoBookings: Booking[] = [
  { id: 'b-flight-out', kind: 'flight', title: 'Flight to Osaka Kansai', provider: 'All Nippon Airways', detail: 'SFO → KIX · 2 seats, round trip', dayIndex: 0, time: '14:10', reference: 'NQ8K2L', status: 'confirmed', amount: 1680, categoryId: 'transport' },
  { id: 'b-train-in', kind: 'train', title: 'Haruka Express', provider: 'JR West', detail: 'KIX → Kyoto · Reserved seats', dayIndex: 0, time: '16:00', reference: 'HR-20418', status: 'confirmed', amount: 64, categoryId: 'transport' },
  { id: 'b-stay', kind: 'stay', title: 'Higashiyama machiya', provider: 'Private townhouse', detail: '4 nights · Check-in from 17:00', dayIndex: 0, time: '17:30', reference: 'MCH-5521', status: 'confirmed', amount: 1240, categoryId: 'stay' },
  { id: 'b-dinner', kind: 'dining', title: 'Kaiseki dinner', provider: 'Gion Shirakawa', detail: 'Table for 2 · Counter seats', dayIndex: 0, time: '19:45', reference: 'GS-0938', status: 'confirmed', amount: 320, categoryId: 'food' },
  { id: 'b-eikando', kind: 'experience', title: 'Autumn illumination', provider: 'Eikan-dō Zenrin-ji', detail: 'Evening entry · 2 tickets', dayIndex: 1, time: '17:30', reference: 'Awaiting', status: 'pending', amount: 24, categoryId: 'experiences' },
  { id: 'b-boat', kind: 'experience', title: 'Hozugawa river boat', provider: 'Hozugawa Kudari', detail: '2 seats · Weather dependent', dayIndex: 2, time: '14:00', reference: 'HZ-7713', status: 'confirmed', amount: 56, categoryId: 'experiences' },
  { id: 'b-pottery', kind: 'experience', title: 'Pottery workshop', provider: 'Gojōzaka studio', detail: '2 places · Wheel throwing', dayIndex: 3, time: '15:00', reference: 'PT-2207', status: 'confirmed', amount: 110, categoryId: 'experiences' },
  { id: 'b-train-out', kind: 'train', title: 'Haruka Express', provider: 'JR West', detail: 'Kyoto → KIX · Reserved seats', dayIndex: 4, time: '13:30', reference: 'HR-20977', status: 'confirmed', amount: 64, categoryId: 'transport' },
  { id: 'b-flight-back', kind: 'flight', title: 'Flight home', provider: 'All Nippon Airways', detail: 'KIX → SFO · Return leg', dayIndex: 4, time: '17:45', reference: 'NQ8K2L', status: 'confirmed', amount: 0, categoryId: 'transport' },
];
