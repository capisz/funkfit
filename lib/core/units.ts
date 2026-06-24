// Ported from elephit @elephit/core — framework-agnostic unit helpers.
export type WeightUnit = 'lbs' | 'kg';
export type HeightUnit = 'imperial' | 'metric';

export const KG_PER_LB = 0.45359237;
export const LBS_PER_KG = 1 / KG_PER_LB;
export const CM_PER_INCH = 2.54;

export function lbsToKg(lbs: number): number {
  return lbs * KG_PER_LB;
}

export function kgToLbs(kg: number): number {
  return kg * LBS_PER_KG;
}

export function weightToKg(weight: number, unit: WeightUnit): number {
  return unit === 'lbs' ? lbsToKg(weight) : weight;
}

export function weightFromKg(weightKg: number, unit: WeightUnit): number {
  return unit === 'lbs' ? kgToLbs(weightKg) : weightKg;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

export function imperialHeightToCm(feet: number, inches: number): number {
  return inchesToCm(feet * 12 + inches);
}

export function cmToImperialHeight(cm: number): { feet: number; inches: number } {
  const totalInches = Math.max(0, Math.round(cmToInches(cm)));
  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12,
  };
}

export function roundTo(value: number, places = 1): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function formatWeight(weightKg: number, unit: WeightUnit, places = 1): string {
  return roundTo(weightFromKg(weightKg, unit), places).toFixed(places);
}

export function parsePositiveNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '.') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function cleanDecimalInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [whole, ...decimalParts] = cleaned.split('.');
  if (!decimalParts.length) return whole;
  return `${whole}.${decimalParts.join('')}`;
}

export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
