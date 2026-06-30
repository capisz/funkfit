// Daily logging-streak math. A day "counts" when it appears in loggedDates
// (YYYY-MM-DD local keys, e.g. dates that have food entries).
import { toLocalDateKey } from './units';

export interface StreakInfo {
  current: number;
  longest: number;
  /** Mon→Sun of the week containing `today`; true if that day was logged. */
  thisWeek: boolean[];
}

function keyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function shiftKey(key: string, deltaDays: number): string {
  const d = keyToDate(key);
  d.setDate(d.getDate() + deltaDays);
  return toLocalDateKey(d);
}

export function computeStreak(
  loggedDates: string[],
  today: string = toLocalDateKey()
): StreakInfo {
  const set = new Set(loggedDates);

  // Current streak: count back from today, or from yesterday if today is not
  // logged yet (so the streak stays "alive" until the day ends).
  let current = 0;
  let cursor: string | null = null;
  if (set.has(today)) cursor = today;
  else if (set.has(shiftKey(today, -1))) cursor = shiftKey(today, -1);
  while (cursor && set.has(cursor)) {
    current += 1;
    cursor = shiftKey(cursor, -1);
  }

  // Longest streak across all logged dates.
  let longest = 0;
  const sorted = [...set].sort();
  let run = 0;
  let prev: string | null = null;
  for (const key of sorted) {
    if (prev && shiftKey(prev, 1) === key) run += 1;
    else run = 1;
    if (run > longest) longest = run;
    prev = key;
  }

  // This week, Monday-first.
  const todayDate = keyToDate(today);
  const dow = (todayDate.getDay() + 6) % 7; // 0 = Monday
  const monday = shiftKey(today, -dow);
  const thisWeek = Array.from({ length: 7 }, (_, i) => set.has(shiftKey(monday, i)));

  return { current, longest, thisWeek };
}
