import { useMemo } from 'react';
import { PLACES, getPlace, tripCovers, type Place } from '../../data/places';
import type { InterestId } from '../../data/destinations';
import { useSaved } from '../../state/SavedProvider';
import { tripStatus, useTrips } from '../../state/TripsProvider';

export interface Suggestion {
  place: Place;
  reason: string;
}

interface Options {
  interest?: InterestId;
  exclude?: string;
  limit?: number;
}

/**
 * Places picked from what the traveler already has: an upcoming trip or
 * trip idea, places they saved, and destinations they saved. Places
 * already saved are left out, since they're not news.
 */
export function useSuggestions({ interest, exclude, limit = 8 }: Options = {}): Suggestion[] {
  const { entries, isSaved } = useSaved();
  const { trips, today } = useTrips();

  return useMemo(() => {
    const activeTrips = trips.filter((t) => tripStatus(t, today) !== 'past');
    const savedPlaces = entries.map((e) => getPlace(e.item.id)).filter((p): p is Place => Boolean(p));
    const savedDestinations = new Map(
      entries.filter((e) => !getPlace(e.item.id)).map((e) => [e.item.id, e.item.name]),
    );

    const reasonFor = (p: Place): { reason: string; rank: number } | null => {
      const trip = activeTrips.find((t) => tripCovers(t.id, p.destinationId));
      if (trip) return { reason: `For your ${trip.name} ${trip.days.length ? 'trip' : 'idea'}`, rank: 0 };
      const near = savedPlaces.find((s) => s.destinationId === p.destinationId && s.id !== p.id);
      if (near) return { reason: `Near ${near.name}, which you saved`, rank: 1 };
      const dest = savedDestinations.get(p.destinationId);
      if (dest) return { reason: `Because you saved ${dest}`, rank: 2 };
      return null;
    };

    return PLACES.filter((p) => (!interest || p.interest === interest) && p.id !== exclude && !isSaved(p.id))
      .flatMap((p) => {
        const r = reasonFor(p);
        return r ? [{ place: p, ...r }] : [];
      })
      .sort((a, b) => a.rank - b.rank || b.place.rating - a.place.rating)
      .slice(0, limit)
      .map(({ place, reason }) => ({ place, reason }));
  }, [entries, isSaved, trips, today, interest, exclude, limit]);
}
