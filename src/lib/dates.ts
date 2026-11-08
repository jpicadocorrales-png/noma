/** Date helpers. Trip dates are plain calendar days (no time zone math). */

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
}

export function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Whole calendar days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86_400_000);
}

const weekdayShort = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
const fullDay = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export const formatWeekday = (d: Date) => weekdayShort.format(d); // "Wed"
export const formatMonthDay = (d: Date) => monthDay.format(d); // "Nov 18"
export const formatMonthYear = (d: Date) => monthYear.format(d); // "Mar 2026"
export const formatFullDay = (d: Date) => fullDay.format(d); // "Wed, Nov 18"

/** "Nov 18 – 22, 2026" or "Nov 28 – Dec 2, 2026" */
export function formatRange(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const endLabel = sameMonth ? String(end.getDate()) : monthDay.format(end);
  return `${monthDay.format(start)} – ${endLabel}, ${end.getFullYear()}`;
}

/** "Today", "Tomorrow", "In 10 days" */
export function formatCountdown(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}
