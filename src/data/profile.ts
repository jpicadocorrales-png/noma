/** Sample traveler for the preview. Fictional. */
export const traveler = {
  name: 'Alex Moreno',
  initials: 'AM',
  homeBase: 'San Francisco, US',
  exploringSince: 2019,
  stats: [
    { label: 'Countries', value: '14' },
    { label: 'Trips', value: '9' },
    { label: 'Days away', value: '86' },
  ],
};

export interface Option {
  id: string;
  label: string;
  hint?: string;
}

export const PACE_OPTIONS: Option[] = [
  { id: 'slow', label: 'Slow & deep', hint: 'Two or three things a day, with room to wander.' },
  { id: 'balanced', label: 'Balanced', hint: 'A full morning, an easy afternoon.' },
  { id: 'full', label: 'Full days', hint: 'Early starts and as much as the day can hold.' },
];

export const INTEREST_OPTIONS: Option[] = [
  { id: 'nature', label: 'Nature' },
  { id: 'culture', label: 'Culture' },
  { id: 'food', label: 'Food' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'relaxation', label: 'Relaxation' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'nightlife', label: 'Nightlife' },
];

export const STAY_OPTIONS: Option[] = [
  { id: 'boutique', label: 'Boutique hotels' },
  { id: 'local-homes', label: 'Local homes' },
  { id: 'inns', label: 'Ryokans & inns' },
  { id: 'design', label: 'Design hotels' },
  { id: 'cabins', label: 'Cabins & lodges' },
];

export const BUDGET_OPTIONS: Option[] = [
  { id: 'considered', label: 'Considered', hint: 'Spend where it matters, save everywhere else.' },
  { id: 'comfortable', label: 'Comfortable', hint: 'Good rooms, good meals, no splurges.' },
  { id: 'indulgent', label: 'Indulgent', hint: 'The memorable option, most of the time.' },
];

export const AIRPORTS: Option[] = [
  { id: 'SFO', label: 'SFO · San Francisco' },
  { id: 'LAX', label: 'LAX · Los Angeles' },
  { id: 'JFK', label: 'JFK · New York' },
  { id: 'MEX', label: 'MEX · Mexico City' },
  { id: 'SJO', label: 'SJO · San José, Costa Rica' },
  { id: 'MAD', label: 'MAD · Madrid' },
  { id: 'LHR', label: 'LHR · London Heathrow' },
];

/** Earlier journeys, dated relative to the current year so the timeline never goes stale. */
export const EARLIER_JOURNEYS: Array<{ name: string; location: string; month: string; yearsAgo: number }> = [
  { name: 'Mexico City', location: 'CDMX / MX', month: 'Oct', yearsAgo: 1 },
  { name: 'Iceland ring road', location: 'Iceland / IS', month: 'Jun', yearsAgo: 1 },
  { name: 'Cinque Terre', location: 'Liguria / IT', month: 'Sep', yearsAgo: 2 },
  { name: 'Tokyo & Osaka', location: 'Kantō, Kansai / JP', month: 'Apr', yearsAgo: 2 },
  { name: 'Patagonia', location: 'Torres del Paine / CL', month: 'Feb', yearsAgo: 3 },
];
