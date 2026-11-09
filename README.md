# NOMA

**The journey, thoughtfully designed.**
Your AI-powered travel companion — from the first idea to the final destination.

NOMA helps travelers discover destinations, plan trips with AI assistance, organize itineraries and budgets, adapt when plans change, and keep the places and memories that matter.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

> Open the app through the dev server. Double-clicking `index.html` shows a blank page — Vite has to process it first.

## Stack

- React 19 + TypeScript, built with Vite
- React Router (shareable URLs; `vercel.json` rewrites for SPA hosting)
- CSS Modules + global design tokens (no UI framework)
- Google Fonts: Manrope (interface) and DM Serif Display (editorial)
- Photography served from the Unsplash image CDN (prototype only)

## Project structure

```
src/
  styles/          tokens.css (colors, spacing, radii, shadows, motion) and global.css
  lib/             small helpers (class names, photo URLs)
  components/
    ui/            reusable primitives: Button, IconButton, SearchBar, Photo, RouteLine…
    layout/        AppShell, TopBar (desktop nav), BottomNav (mobile/tablet), Wordmark
    assistant/     AskNoma floating entry point and panel
    explore/       Explore Home sections and cards
    trips/         itinerary, bookings, budget and trip cards
    saved/         saved place cards
    profile/       profile header, journeys timeline, sections
  state/           providers for trips, saved places and preferences (localStorage)
  data/            sample content (shaped like a future API)
  screens/         ExploreHome, MyTrips, TripDetail, Saved, Profile
```

## Visual identity — "Modern Explorer"

| Token        | Value     | Use                                         |
| ------------ | --------- | ------------------------------------------- |
| Deep Forest  | `#183B38` | Primary brand, buttons, navigation emphasis |
| Warm Ivory   | `#F4F0E7` | Main background                             |
| Sand         | `#D7C7AA` | Secondary neutral                           |
| Sage         | `#A9C5B4` | Supporting surfaces and tags                |
| Terracotta   | `#E97852` | Sparing accent for meaningful highlights    |
| Charcoal     | `#252B2A` | Primary text                                |

- **Typography:** DM Serif Display only for headlines, destination names and editorial statements; Manrope for everything else.
- **Spacing:** 8px base, 32px section spacing (scales to 48/64px on tablet/desktop).
- **Radii:** 16px cards, 12px buttons.
- **Layout:** mobile-first from a 390 × 844 reference; tablet and desktop get their own compositions rather than a stretched mobile layout.

All values live in `src/styles/tokens.css`; components should reference tokens, not raw values.

## Status

- ✅ Design foundation and Explore Home (responsive)
- ✅ My Trips: trip list, day-by-day itinerary, bookings and budget (`/trips/kyoto`)
- ✅ Saved: places synced with Explore bookmarks, filters, undo
- ✅ Profile: travel style, journeys timeline, settings
- ✅ Discover, destination pages and collection stories
- ✅ Ask NOMA **demo**: prepared, context-aware replies to every suggestion in the app, built from live trip, saved and preference data (`src/components/assistant/demo/replies.ts`). The Day 03 rain alert walks through the full flow: NOMA proposes a plan change, shows exactly what changes, and applies it only when the traveler approves (undoable).
- ✅ Link previews: Open Graph / X card tags and a 1200 × 630 share image (`public/og-image.jpg`, source in `design/og-image.html`)
- ⏳ Live model behind Ask NOMA

Sample data is dated relative to today, and changes are stored only in the browser. Profile → "Reset sample data" restores the preview.
