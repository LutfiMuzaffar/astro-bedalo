// Indonesian-locale date formatting helpers.
// Centralized so every card/list/detail page formats the same way.

const ID = 'id-ID';

const LONG = new Intl.DateTimeFormat(ID, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const MEDIUM = new Intl.DateTimeFormat(ID, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const TIME = new Intl.DateTimeFormat(ID, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const DAY = new Intl.DateTimeFormat(ID, { day: '2-digit' });
const MONTH_SHORT = new Intl.DateTimeFormat(ID, { month: 'short' });
const WEEKDAY = new Intl.DateTimeFormat(ID, { weekday: 'long' });

export const formatLong = (d: Date): string => LONG.format(d);
export const formatMedium = (d: Date): string => MEDIUM.format(d);
export const formatTime = (d: Date): string => TIME.format(d);
export const formatDay = (d: Date): string => DAY.format(d);
export const formatMonthShort = (d: Date): string =>
  MONTH_SHORT.format(d).replace('.', '').toUpperCase();
export const formatWeekday = (d: Date): string => WEEKDAY.format(d);

export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);

export function relativeFromNow(d: Date, now: Date = new Date()): string {
  const days = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Hari ini';
  if (days === 1) return 'Besok';
  if (days === -1) return 'Kemarin';
  if (days > 0 && days < 7) return `${days} hari lagi`;
  if (days < 0 && days > -7) return `${Math.abs(days)} hari yang lalu`;
  return formatLong(d);
}
