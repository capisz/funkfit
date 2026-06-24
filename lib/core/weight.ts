// Ported from elephit @elephit/core.
import { WeightUnit, weightFromKg } from './units';

export type WeightSource = 'manual' | 'profile' | 'healthkit';

export interface WeightEntry {
  date: string;
  weightKg: number;
  source: WeightSource;
  createdAt?: string;
  updatedAt?: string;
}

export function upsertWeightEntry(entries: WeightEntry[], nextEntry: WeightEntry): WeightEntry[] {
  const existing = entries.find((entry) => entry.date === nextEntry.date);
  const merged = existing
    ? entries.map((entry) =>
        entry.date === nextEntry.date
          ? {
              ...entry,
              ...nextEntry,
              createdAt: entry.createdAt || nextEntry.createdAt,
              updatedAt: nextEntry.updatedAt || new Date().toISOString(),
            }
          : entry
      )
    : [...entries, nextEntry];

  return merged
    .filter((entry) => Number.isFinite(entry.weightKg) && entry.weightKg > 0 && isValidDateKey(entry.date))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getLatestWeightEntry(entries: WeightEntry[]): WeightEntry | null {
  if (!entries.length) return null;
  return [...entries].sort((a, b) => a.date.localeCompare(b.date)).at(-1) || null;
}

export function calculateWeeklyWeightTrend(entries: WeightEntry[], unit: WeightUnit): number {
  const sorted = entries
    .filter((entry) => isValidDateKey(entry.date) && Number.isFinite(entry.weightKg))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length < 2) return 0;

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const daySpan = daysBetween(first.date, last.date);
  if (daySpan <= 0) return 0;

  const kgPerWeek = ((last.weightKg - first.weightKg) / daySpan) * 7;
  return weightFromKg(kgPerWeek, unit);
}

export function daysBetween(startDate: string, endDate: string): number {
  const start = Date.parse(`${startDate}T00:00:00`);
  const end = Date.parse(`${endDate}T00:00:00`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.round((end - start) / 86_400_000);
}

function isValidDateKey(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(`${date}T00:00:00`));
}
