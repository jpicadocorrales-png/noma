/**
 * Ask NOMA demo: prepared, context-aware replies.
 *
 * There is no model behind this. Each intent matches a known request (the
 * suggestions shown across the app) and builds a reply from live app state:
 * the trip, its bookings and budget, saved places and travel-style preferences.
 * Anything unmatched gets an honest fallback that points to what the demo can do.
 */
import { collections } from '../../../data/explore';
import { DESTINATIONS, getDestination, type Destination } from '../../../data/destinations';
import { getPlanChange } from '../../../data/planChanges';
import type { Trip } from '../../../data/trips';
import type { SavedEntry } from '../../../state/SavedProvider';
import type { Preferences } from '../../../state/PreferencesProvider';
import { budgetSummary, bookingTotals, dayDate } from '../../../state/TripsProvider';
import { formatFullDay } from '../../../lib/dates';
import { formatMoney } from '../../../lib/money';

export interface DemoReply {
  /** Paragraphs separated by a blank line. Streamed in. */
  text: string;
  bullets?: string[];
  /** Destination ids rendered as small linked cards. */
  destinations?: string[];
  links?: { label: string; to: string }[];
  /** A plan change id rendered as an approve/decline card. */
  proposal?: string;
  followUps?: string[];
}

export interface ReplyContext {
  screenLabel: string;
  screenSuggestions: string[];
  today: Date;
  trips: Trip[];
  preferences: Preferences;
  saved: SavedEntry[];
  isApplied: (changeId: string) => boolean;
}

type Intent = {
  match: (q: string, ctx: ReplyContext) => RegExpMatchArray | boolean | null;
  reply: (ctx: ReplyContext, m: RegExpMatchArray | null) => DemoReply;
};

/* ---------- Helpers ---------- */

export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?.!\s]+$/, '')
    .trim();
}

/** "a", "a and b", "a, b and c" */
const listJoin = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

const kyotoOf = (ctx: ReplyContext) => ctx.trips.find((t) => t.id === 'kyoto');
const pad = (n: number) => String(n).padStart(2, '0');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const PACE_LABEL = { slow: 'slow and deep', balanced: 'balanced', full: 'full days' } as const;

/** Day the traveler is looking at, from a screen label like "Kyoto · Day 03". */
function screenDayIndex(ctx: ReplyContext): number | null {
  const m = ctx.screenLabel.match(/Day (\d+)/);
  return m ? Number(m[1]) - 1 : null;
}

function findByName(name: string): Destination | undefined {
  const n = normalize(name);
  return DESTINATIONS.find((d) => normalize(d.name) === n);
}

function collectionFromScreen(ctx: ReplyContext) {
  return collections.find((c) => ctx.screenLabel.startsWith(c.title));
}

/** Destinations ranked by overlap with the traveler's interests. */
function byInterests(ctx: ReplyContext, exclude: string[] = []): Destination[] {
  const wanted = ctx.preferences.interests;
  return DESTINATIONS.filter((d) => !exclude.includes(d.id))
    .map((d) => ({ d, score: d.interests.filter((i) => wanted.includes(i)).length }))
    .sort((a, b) => b.score - a.score)
    .map(({ d }) => d);
}

/* ---------- Trip & itinerary ---------- */

function rainReply(ctx: ReplyContext): DemoReply {
  if (ctx.isApplied('kyoto-d3-rain')) {
    return {
      text: 'Day 03 is already rearranged around the rain: the morning stays outdoors, and the afternoon moves to the Fukuda Art Museum, a riverside tea house and a hot spring soak.\n\nIf the forecast clears, you can undo the change from the day itself and rebook the boat.',
      links: [{ label: 'View Day 03', to: '/trips/kyoto?day=3' }],
    };
  }
  return {
    text: 'Rain is forecast in Arashiyama from about 2 pm on Day 03, and the Hozugawa river boat usually stops running in heavy rain. Your morning is all outdoors but wraps up before then, so I’d keep it exactly as it is.\n\nFor the afternoon, here’s an indoor plan within a short walk of where you’ll have lunch. The boat company refunds cancellations made more than a day ahead, so you won’t lose anything.',
    proposal: 'kyoto-d3-rain',
  };
}

const DINNER_BY_DAY: Record<number, string> = {
  0: 'Day 01 already ends with your kaiseki dinner at Gion Shirakawa. If you’re hungry later, the side streets of Gion have small bars serving oden until midnight.',
  1: 'Day 02 ends at the Eikan-dō illumination around 7 pm. Okazaki is a 10-minute walk away: counter udon shops there rarely need a booking, and queues are short after 7:30.\n\nFor something slower, take a taxi to an izakaya on Sanjō, about 15 minutes.',
  2: 'Arashiyama empties after 5 pm and many places close early. I’d eat back in central Kyoto: Pontochō is about 30 minutes by train, with riverside terraces and small set-menu restaurants.\n\nIf you’d rather stay put, have an early yudōfu dinner near Tenryū-ji before 6.',
  3: 'Day 04 already ends with dinner in Pontochō. Book a terrace seat over the river if the evening is mild; most places hold a few for walk-ins.',
  4: 'Day 05 ends at the airport. Terminal 1 at KIX has a good ramen counter and a sushi bar after security, but there’s more choice before it, so eat first.',
};

const BRING_BY_BOOKING: Record<string, string> = {
  'b-flight-out': 'Flight to Osaka Kansai: passports and booking NQ8K2L. Online check-in opens 48 hours before.',
  'b-train-in': 'Haruka Express: reserved-seat tickets, or the QR code from the JR West app.',
  'b-stay': 'Machiya: nothing to print. Your host meets you at the door from 17:00.',
  'b-dinner': 'Kaiseki dinner: smart-casual, no shorts. Arrive five minutes early.',
  'b-eikando': 'Autumn illumination: tickets are still pending, so bring the confirmation once it arrives.',
  'b-boat': 'Hozugawa river boat: a waterproof layer, and cash for the bus back if you miss the train.',
  'b-pottery': 'Pottery workshop: clothes you don’t mind getting clay on. Pieces are fired and posted home.',
  'b-train-out': 'Haruka Express back: same as the way in. Allow two hours at KIX for check-in.',
  'b-flight-back': 'Flight home: the same booking reference, NQ8K2L.',
};

/* ---------- Collections ---------- */

const FEWER_DAYS: Record<string, string> = {
  'slow-escapes':
    'It can, but it changes character. In four days, drop the Alentejo: two nights in the Douro, then two in Comporta, with a train through Lisbon in between. Any shorter and it stops being a slow escape.',
  'hidden-gems':
    'Ten days is about the minimum for three islands with ferries in between. In six days, choose two: Ko Yao Noi and Ko Lanta connect easily by boat.',
  'weekend-getaways':
    'It already fits a weekend. If you only have one day, choose Copenhagen and save Malmö for another trip.',
};

const STAYS: Record<string, string[]> = {
  'slow-escapes': [
    'Douro: a family-run quinta near Pinhão, with river views from the terrace.',
    'Alentejo: a farmhouse (monte) outside Évora, with a pool.',
    'Comporta: a cabin or small guesthouse among the rice fields, a short drive from the beach.',
  ],
  'hidden-gems': [
    'Ko Yao Noi: bungalows on the east coast, facing the karsts.',
    'Ko Lanta: the quieter southern beaches, away from Saladan.',
    'Ko Libong: one of the few beachfront guesthouses on the west side.',
  ],
  'weekend-getaways': [
    'Copenhagen: Vesterbro or Nørrebro, close to the bakeries and the harbour baths.',
    'Malmö: near Västra Hamnen, for the sea sauna and the waterfront walk.',
  ],
};

/* ---------- Profile ---------- */

const LONG_WEEKEND_FROM: Record<string, { text: string; destinations?: string[] }> = {
  SFO: { text: 'From SFO, I’d keep a long weekend on this side of the Pacific: Mexico City is about four and a half hours direct, and Vancouver under two and a half. Everything in this guide is long-haul from California, so I’d save those for a week or more.' },
  LAX: { text: 'From LAX, Mexico City and Oaxaca are both easy long weekends, about four hours away. The destinations in this guide are long-haul from LA, better for a week or more.' },
  JFK: { text: 'From JFK, Lisbon is an overnight flight of about seven hours, so a long weekend works if you leave on Thursday night and come back Monday.', destinations: ['lisbon'] },
  MEX: { text: 'From Mexico City, Oaxaca is less than an hour’s flight away and perfect for three days. The destinations in this guide are long-haul from Mexico, better for a longer trip.' },
  SJO: { text: 'From San José, Panama City and Cartagena are short flights for a long weekend. The destinations in this guide are long-haul from Costa Rica, better for a week or more.' },
  MAD: { text: 'From Madrid, Lisbon and Porto are about an hour away by air. Either makes an ideal long weekend.', destinations: ['lisbon', 'porto'] },
  LHR: { text: 'From London, Lisbon and Porto are under three hours away, and Cinque Terre is a short flight to Pisa plus a train along the coast.', destinations: ['lisbon', 'porto', 'cinque-terre'] },
};

/* ---------- Intents (first match wins) ---------- */

const INTENTS: Intent[] = [
  /* Day 03 rain — the weather alert prefill, or anything about rain */
  {
    match: (q) => !/doesn'?t rain/.test(q) && /around the rain|\brain\b|\braining\b|forecast/.test(q),
    reply: rainReply,
  },

  {
    match: (q) => /what if it doesn'?t rain/.test(q),
    reply: () => ({
      text: 'Then nothing is lost. I’ll check the forecast again the evening before. If Day 03 clears, you can undo the change from the itinerary in one tap and I’ll rebook the boat, which usually has seats on weekdays.',
    }),
  },

  {
    match: (q) => q.match(/make day 0?(\d) less rushed/),
    reply: (ctx, m) => {
      const trip = kyotoOf(ctx);
      const i = Number(m?.[1] ?? 1) - 1;
      const day = trip?.days[i];
      if (!trip || !day) return { text: 'I couldn’t find that day in your trip.' };
      const first = day.items[0];
      const last = day.items[day.items.length - 1];
      const anchors = day.items.filter((a) => a.bookingId || a.category === 'sight').slice(0, 3);
      if (day.id === 'd2') {
        return {
          text: `Day 02 has ${day.items.length} stops, from ${first.time} to the illumination at ${last.time}. Two easy wins that keep everything you came for:`,
          bullets: [
            'Skip a separate stop for Sannenzaka & Ninenzaka. You’ll walk through both on the way down from Kiyomizu-dera anyway.',
            'Take a taxi to Nanzen-ji instead of the 20-minute bus. It costs about $12 and buys back half an hour.',
          ],
          followUps: ['Find a good dinner near the last stop'],
        };
      }
      return {
        text: `Day ${pad(i + 1)} has ${day.items.length} stops, from ${first.time} to ${last.time}. Your pace is set to ${PACE_LABEL[ctx.preferences.pace]}, so I’d treat three as fixed and the rest as optional:`,
        bullets: anchors.map((a) => `${a.time} · ${a.title}`),
        followUps: ['Find a good dinner near the last stop'],
      };
    },
  },

  {
    match: (q) => /dinner near the last stop/.test(q),
    reply: (ctx) => {
      const i = screenDayIndex(ctx) ?? 0;
      return { text: DINNER_BY_DAY[i] ?? DINNER_BY_DAY[0] };
    },
  },

  {
    match: (q) => /book in advance/.test(q),
    reply: (ctx) => {
      const trip = kyotoOf(ctx);
      const pending = trip?.bookings.filter((b) => b.status === 'pending') ?? [];
      return {
        text: 'In maple season, three things in Kyoto sell out. Here’s where you stand:',
        bullets: [
          pending.some((b) => b.id === 'b-eikando')
            ? 'Eikan-dō evening illumination: your tickets are still pending. This is the one to chase.'
            : 'Eikan-dō evening illumination: confirmed.',
          'Kaiseki dinners: yours at Gion Shirakawa is confirmed.',
          'Ōkōchi Sansō and Fushimi Inari: no booking needed. Just arrive early.',
        ],
        links: [{ label: 'View bookings', to: '/trips/kyoto?view=bookings' }],
      };
    },
  },

  {
    match: (q) => /still (unconfirmed|unbooked)|what'?s pending/.test(q),
    reply: (ctx) => {
      const trip = kyotoOf(ctx);
      if (!trip) return { text: 'You don’t have an upcoming trip yet.' };
      const t = bookingTotals(trip);
      const pending = trip.bookings.filter((b) => b.status === 'pending');
      if (pending.length === 0) return { text: `Everything is confirmed: all ${t.total} bookings for Kyoto.` };
      return {
        text: `${t.confirmed} of ${t.total} Kyoto bookings are confirmed. ${pending.length === 1 ? 'One is' : `${pending.length} are`} still waiting:`,
        bullets: pending.map((b) => {
          const date = dayDate(trip, b.dayIndex);
          return `${b.title}, ${b.provider} · ${date ? formatFullDay(date) : `Day ${b.dayIndex + 1}`}, ${b.time}`;
        }),
        links: [{ label: 'View bookings', to: '/trips/kyoto?view=bookings' }],
      };
    },
  },

  {
    match: (q) => /what to bring/.test(q),
    reply: (ctx) => {
      const trip = kyotoOf(ctx);
      return {
        text: 'Here’s what each booking needs from you, in order:',
        bullets: (trip?.bookings ?? []).map((b) => BRING_BY_BOOKING[b.id]).filter(Boolean),
      };
    },
  },

  {
    match: (q) => /where can i save/.test(q),
    reply: (ctx) => {
      const trip = kyotoOf(ctx);
      const s = trip && budgetSummary(trip);
      if (!s) return { text: 'This trip doesn’t have a budget yet.' };
      return {
        text: `You’ve committed ${formatMoney(s.committed)} of ${formatMoney(s.planned)}, leaving ${formatMoney(s.remaining)}. Most of what’s left is food and day-to-day spending, so that’s where small changes add up:`,
        bullets: [
          'Have one kaiseki meal as a lunch set instead of dinner: same kitchen, about a third of the price.',
          'Use your ICOCA card on buses rather than taxis between temples; Kyoto is compact.',
          'Make the last night a depachika picnic: department-store food halls are excellent and inexpensive.',
        ],
      };
    },
  },

  {
    match: (q) => /food budget realistic/.test(q),
    reply: (ctx) => {
      const trip = kyotoOf(ctx);
      const food = trip && budgetSummary(trip)?.categories.find((c) => c.id === 'food');
      if (!trip || !food) return { text: 'This trip doesn’t have a food budget yet.' };
      const left = food.planned - food.committed;
      const daysLeft = Math.max(1, trip.days.length - 1);
      const perDay = Math.round(left / daysLeft);
      return {
        text: `Yes, comfortably. You planned ${formatMoney(food.planned)} for two. With the kaiseki dinner (${formatMoney(food.committed)}) already booked, that leaves ${formatMoney(left)}, about ${formatMoney(perDay)} a day for the other ${daysLeft} days.\n\nIn Kyoto that covers coffee and breakfast, a lunch set at around $20 each, and an izakaya dinner for two at $50–70, with room for matcha along the way.`,
      };
    },
  },

  /* ---------- Explore & Discover ---------- */

  {
    match: (q) => /late november/.test(q),
    reply: () => ({
      text: 'Late November is maple season in Japan and the start of the dry season in northern Vietnam. Three I’d look at:',
      destinations: ['kyoto', 'ha-long', 'tromso'],
      bullets: [
        'Kyoto: peak autumn colour, and you already have a trip planned.',
        'Hạ Long Bay: cool, clear mornings on the water.',
        'Tromsø: long dark nights for the aurora, before the deep winter cold.',
      ],
    }),
  },

  {
    match: (q) => /plan (five|5) slow days in kyoto/.test(q),
    reply: () => ({
      text: 'You already have one: five days in Kyoto, one neighbourhood a day, with two or three anchors each and long lunches in between. It even has an indoor backup ready for the rainy afternoon on Day 03.',
      links: [{ label: 'Open your Kyoto trip', to: '/trips/kyoto' }],
    }),
  },

  {
    match: (q) => /weekend trips from lisbon/.test(q),
    reply: () => ({
      text: 'The best weekends from Lisbon don’t need a flight:',
      bullets: [
        'Porto: three hours by train. Riverside wine lodges and tiled churches.',
        'Sintra and Cascais: 40 minutes by train. Palaces in the morning, the sea by afternoon.',
        'Comporta: about 90 minutes by car. Rice fields, stilt-house restaurants and empty beaches.',
      ],
      destinations: ['porto'],
      links: [{ label: 'Read “Slow escapes”', to: '/collections/slow-escapes' }],
    }),
  },

  {
    match: (q) => /warm in december/.test(q),
    reply: () => ({
      text: 'Most of NOMA’s sample guide is in the northern hemisphere, so December options are limited. Bali is the warmest: expect heavy afternoon rain, but clear mornings and quiet, green highlands.\n\nBeyond this guide, I’d look at Oaxaca, Cape Town, or Patagonia in its summer.',
      destinations: ['bali'],
    }),
  },

  {
    match: (q) => /quiet place for a long weekend/.test(q),
    reply: () => ({
      text: 'Two that stay calm if you avoid high summer:',
      destinations: ['porto', 'cinque-terre'],
      bullets: [
        'Porto in spring or autumn: walkable, unhurried, and easy in three days.',
        'Cinque Terre in May or September: stay in one village and hike a single stretch of the coast.',
      ],
      links: [{ label: 'Read “Hidden gems”', to: '/collections/hidden-gems' }],
    }),
  },

  {
    match: (q) => /northern lights|aurora/.test(q),
    reply: () => ({
      text: 'Your best odds are from September to March, with dark skies and a clear forecast. Two places in the guide:',
      destinations: ['tromso', 'stokksnes'],
      bullets: [
        'Tromsø: the classic base, with guides who drive toward clear skies each night.',
        'Stokksnes: wilder, on Iceland’s Ring Road, with the Vestrahorn as a backdrop.',
      ],
    }),
  },

  {
    match: (q) => q.match(/suggest places like "(.+)"/),
    reply: (ctx, m) => ({
      text: `“${m?.[1]}” is beyond NOMA’s sample guide, which covers ten destinations. In the full version, I’d search a much wider catalogue. These are the closest fits for your travel style:`,
      destinations: byInterests(ctx, ['kyoto', 'lisbon']).slice(0, 3).map((d) => d.id),
    }),
  },

  /* ---------- Saved ---------- */

  {
    match: (q) => /group my saved places/.test(q),
    reply: (ctx) => {
      const asia = ctx.saved.filter((e) => /\/ (JP|ID|VN)$/.test(e.item.location)).map((e) => e.item.name);
      const europe = ctx.saved.filter((e) => !/\/ (JP|ID|VN)$/.test(e.item.location)).map((e) => e.item.name);
      if (ctx.saved.length === 0) return { text: 'You haven’t saved anything yet. Tap the bookmark on any place while exploring.' };
      const bullets = [];
      if (europe.length) bullets.push(`Europe: ${europe.join(', ')}. Too spread out for one trip, so I’d pair them by season: the Arctic in winter, the south in late spring.`);
      if (asia.length) bullets.push(`Asia: ${asia.join(', ')}. ${asia.length > 1 ? 'They combine well into a 10-day trip, ending slowly.' : 'An easy add-on to your Kyoto trip.'}`);
      return { text: 'Your saves fall into two clear groups:', bullets };
    },
  },

  {
    match: (q) => /suits a long weekend/.test(q),
    reply: (ctx) => {
      const savedDest = ctx.saved.map((e) => getDestination(e.item.id)).filter((d): d is Destination => Boolean(d));
      const short = savedDest.filter((d) => parseInt(d.idealStay, 10) <= 3);
      const long = savedDest.filter((d) => parseInt(d.idealStay, 10) > 3);
      if (short.length === 0) return { text: 'None of your saved destinations really fit three days. Porto or Cinque Terre would.', destinations: ['porto', 'cinque-terre'] };
      return {
        text: `For three or four days, ${listJoin(short.map((d) => d.name))} work${short.length === 1 ? 's' : ''} best.${long.length ? ` ${listJoin(long.map((d) => d.name))} deserve${long.length === 1 ? 's' : ''} five days or more.` : ''}`,
        destinations: short.map((d) => d.id),
      };
    },
  },

  {
    match: (q) => /in season next month/.test(q),
    reply: (ctx) => {
      const next = (ctx.today.getMonth() + 1) % 12;
      const inSeason = DESTINATIONS.filter((d) => d.seasonMonths.includes(next + 1));
      const savedIds = ctx.saved.map((e) => e.item.id);
      const savedFirst = [...inSeason].sort((a, b) => Number(savedIds.includes(b.id)) - Number(savedIds.includes(a.id)));
      return {
        text: `In ${MONTHS[next]}, ${inSeason.length} places in the guide are at their best${savedFirst.some((d) => savedIds.includes(d.id)) ? ', including some you’ve saved' : ''}:`,
        destinations: savedFirst.slice(0, 3).map((d) => d.id),
      };
    },
  },

  {
    match: (q) => q.match(/add (.+) to one of my trips/),
    reply: (ctx, m) => {
      const name = m?.[1] ?? '';
      const item = ctx.saved.find((e) => normalize(e.item.name) === normalize(name))?.item;
      if (item && /\/ JP$/.test(item.location)) {
        return {
          text: `${item.name} pairs well with your Kyoto trip: it’s two hours fifteen by shinkansen. I’d add two nights at the start, flying into Tokyo and out of Osaka.`,
          links: [{ label: 'Open your Kyoto trip', to: '/trips/kyoto' }],
        };
      }
      return {
        text: `None of your current trips go near ${item?.name ?? name}. I can start a new trip around it, or keep it saved until the season is right.`,
        followUps: ['Help me plan a new trip'],
      };
    },
  },

  /* ---------- My Trips ---------- */

  {
    match: (q) => /help me plan a new trip|suggest somewhere new/.test(q),
    reply: (ctx) => {
      const savedDest = ctx.saved.map((e) => e.item.id).filter((id) => getDestination(id)).slice(0, 3);
      return {
        text: `Happily. Three quick questions and I’ll draft a first itinerary for you to edit${savedDest.length ? ', or start from one of your saved places below' : ''}:`,
        bullets: ['Roughly when, and for how long?', 'Who’s coming?', 'One thing the trip has to include?'],
        ...(savedDest.length ? { destinations: savedDest } : {}),
        followUps: ['Suggest a trip that fits my style'],
      };
    },
  },

  {
    match: (q) => /douro/.test(q) && !/route/.test(q),
    reply: () => ({
      text: 'You noted spring 2027 for the Douro. I’d aim for mid-May: the vines are green, the river boats are running, and it’s after the Easter crowds. Late September is the alternative if you want the harvest.\n\nA first sketch for seven days:',
      bullets: ['Days 1–3: a quinta near Pinhão, tastings and the river train', 'Days 4–5: the Alentejo, with Évora and long dinners', 'Days 6–7: Comporta, rice fields and the beach'],
      links: [{ label: 'Read “Slow escapes”', to: '/collections/slow-escapes' }],
    }),
  },

  /* ---------- Destination pages ---------- */

  {
    match: (q) => q.match(/^plan (.+) in (.+)$/),
    reply: (ctx, m) => {
      const d = findByName(m?.[2] ?? '');
      if (!d) return fallback(ctx);
      if (ctx.trips.some((t) => t.id === d.id)) {
        return { text: `You already have a trip to ${d.name}, planned at a ${PACE_LABEL[ctx.preferences.pace]} pace.`, links: [{ label: `Open your ${d.name} trip`, to: `/trips/${d.id}` }] };
      }
      const days = Math.min(5, Math.max(1, parseInt(d.idealStay, 10) || 3));
      const bullets = Array.from({ length: days }, (_, i) => {
        const h = d.highlights[i];
        return h ? `Day ${i + 1}: ${h.name}. ${h.note}` : `Day ${i + 1}: unplanned. Wander, and go back to what you loved.`;
      });
      return {
        text: `A first sketch for ${d.name}, at a ${PACE_LABEL[ctx.preferences.pace]} pace with one anchor a day. ${d.firstVisit}`,
        bullets,
        followUps: [`When is the best time for ${d.name}?`],
      };
    },
  },

  {
    match: (q) => q.match(/when is the best time for (.+)/),
    reply: (ctx, m) => {
      const d = findByName(m?.[1] ?? '');
      if (!d) return fallback(ctx);
      return { text: `${d.bestSeason}. ${d.seasonNote}` };
    },
  },

  {
    match: (q) => q.match(/what'?s (.+) like for a first visit/),
    reply: (ctx, m) => {
      const d = findByName(m?.[1] ?? '');
      if (!d) return fallback(ctx);
      return { text: `Give ${d.name} ${d.idealStay}. ${d.firstVisit}`, followUps: [`Plan ${d.idealStay} in ${d.name}`] };
    },
  },

  /* ---------- Collections ---------- */

  {
    match: (q) => q.match(/plan the (.+?) route/),
    reply: (ctx, m) => {
      const c = collections.find((x) => normalize(x.title) === normalize(m?.[1] ?? ''));
      if (!c) return fallback(ctx);
      return {
        text: `Here’s how I’d shape ${c.title} at your ${PACE_LABEL[ctx.preferences.pace]} pace. I’d start on a Saturday so the quietest stretch falls midweek:`,
        bullets: c.stops.map((s) => `${s.days}: ${s.name}`),
        followUps: ['Can this route work in fewer days?', 'Where should I stay at each stop?'],
      };
    },
  },

  {
    match: (q) => /work in fewer days/.test(q),
    reply: (ctx) => {
      const c = collectionFromScreen(ctx) ?? collections[0];
      return { text: FEWER_DAYS[c.id] };
    },
  },

  {
    match: (q) => /where should i stay at each stop/.test(q),
    reply: (ctx) => {
      const c = collectionFromScreen(ctx) ?? collections[0];
      return { text: `For ${c.title}, small places suit the pace better than hotels:`, bullets: STAYS[c.id] };
    },
  },

  /* ---------- Profile ---------- */

  {
    match: (q) => /fits my (travel )?style/.test(q),
    reply: (ctx) => {
      const p = ctx.preferences;
      const picks = byInterests(ctx, ['kyoto', 'lisbon']).slice(0, 2);
      return {
        text: `You travel ${PACE_LABEL[p.pace]} and lean towards ${p.interests.length ? listJoin(p.interests.slice(0, 3)) : 'a bit of everything'}. Two places that fit, and that you haven’t been to:`,
        destinations: picks.map((d) => d.id),
        bullets: picks.map((d) => `${d.name}: ${d.tagline} Best ${d.bestSeason}.`),
      };
    },
  },

  {
    match: (q) => /why do you recommend slow travel/.test(q),
    reply: (ctx) =>
      ctx.preferences.pace === 'slow'
        ? {
            text: 'Because you asked me to: your pace is set to slow and deep. So I plan two or three anchors a day, leave room around transit, and keep lunches long.\n\nYou can change it any time in your travel style, and I’ll reshape suggestions around the new pace.',
          }
        : {
            text: `I don’t, right now. Your pace is set to ${PACE_LABEL[ctx.preferences.pace]}, so I’m planning fuller days. If you switch to slow and deep, I’ll keep each day to two or three anchors.`,
          },
  },

  {
    match: (q) => /long weekend from my home airport/.test(q),
    reply: (ctx) => {
      const r = LONG_WEEKEND_FROM[ctx.preferences.homeAirport] ?? LONG_WEEKEND_FROM.SFO;
      return { text: r.text, ...(r.destinations ? { destinations: r.destinations } : {}) };
    },
  },

  /* ---------- Loose keywords ---------- */

  { match: (q) => /\bbudget\b|\bspend/.test(q), reply: (ctx) => INTENTS.find((i) => i.match('where can i save', ctx))!.reply(ctx, null) },
  {
    match: (q) => /\bkyoto\b/.test(q),
    reply: (ctx) => {
      const trip = kyotoOf(ctx);
      const t = trip ? bookingTotals(trip) : null;
      return {
        text: `Your Kyoto trip is five days in maple season${t ? `, with ${t.confirmed} of ${t.total} bookings confirmed` : ''}. Want to look at a day, the bookings or the budget?`,
        links: [{ label: 'Open your Kyoto trip', to: '/trips/kyoto' }],
        followUps: ['What’s still unconfirmed?', 'Where can I save on this trip?'],
      };
    },
  },
];

function fallback(ctx: ReplyContext): DemoReply {
  const followUps = ctx.screenSuggestions.length
    ? ctx.screenSuggestions
    : ['Where is good in late November?', 'Plan five slow days in Kyoto', 'Help me plan a new trip'];
  return {
    text: `This is a demo, so I answer a set of prepared questions rather than anything you type. In the full version, a live model answers using what you’re looking at, here ${ctx.screenLabel}, as context.\n\nTry one of these:`,
    followUps,
  };
}

export function demoReply(question: string, ctx: ReplyContext): DemoReply {
  const q = normalize(question);
  for (const intent of INTENTS) {
    const m = intent.match(q, ctx);
    if (m) return intent.reply(ctx, typeof m === 'boolean' ? null : m);
  }
  return fallback(ctx);
}

export { getPlanChange };
