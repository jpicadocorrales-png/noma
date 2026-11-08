import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadJSON, saveJSON } from '../lib/storage';

const KEY = 'noma.preferences.v1';

export type Pace = 'slow' | 'balanced' | 'full';
export type BudgetStyle = 'considered' | 'comfortable' | 'indulgent';
export type Units = 'metric' | 'imperial';

export interface Preferences {
  pace: Pace;
  interests: string[];
  stays: string[];
  budget: BudgetStyle;
  units: Units;
  homeAirport: string;
  notifications: { reminders: boolean; planChanges: boolean; priceDrops: boolean };
}

export const DEFAULT_PREFERENCES: Preferences = {
  pace: 'slow',
  interests: ['culture', 'food', 'nature'],
  stays: ['local-homes', 'inns'],
  budget: 'comfortable',
  units: 'metric',
  homeAirport: 'SFO',
  notifications: { reminders: true, planChanges: true, priceDrops: false },
};

interface PreferencesContextValue {
  preferences: Preferences;
  update: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(() => ({
    ...DEFAULT_PREFERENCES,
    ...loadJSON<Partial<Preferences>>(KEY, {}),
  }));

  useEffect(() => saveJSON(KEY, preferences), [preferences]);

  const update = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo(() => ({ preferences, update }), [preferences, update]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return ctx;
}

/** Format a Celsius temperature in the traveler's chosen units. */
export function formatTemp(celsius: number, units: Units): string {
  return units === 'imperial' ? `${Math.round((celsius * 9) / 5 + 32)}°F` : `${celsius}°`;
}

/** Remove everything this preview stored, so the sample data starts fresh. */
export function resetSampleData() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith('noma.'))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* storage unavailable — nothing to reset */
  }
  window.location.reload();
}
