// Ported from elephit @elephit/core.
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
];

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  brand?: string;
  externalId?: string;
  meal?: MealType;
  createdAt?: string;
}

export interface MacroTotals {
  total: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function calculateMacroTotals(foods: FoodEntry[]): MacroTotals {
  return foods.reduce(
    (totals, food) => ({
      total: totals.total + safeNumber(food.calories),
      protein: totals.protein + safeNumber(food.protein),
      carbs: totals.carbs + safeNumber(food.carbs),
      fat: totals.fat + safeNumber(food.fat),
    }),
    { total: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function caloriesFromMacros(protein: number, carbs: number, fat: number): number {
  return protein * 4 + carbs * 4 + fat * 9;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}
