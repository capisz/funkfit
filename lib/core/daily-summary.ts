// Ported from elephit @elephit/core.
import { CalorieTarget, calculateDailyCalorieTarget } from './calories';
import { FoodEntry, MacroTotals, calculateMacroTotals } from './food';
import { DailyHealthMetrics } from './health';
import { UserProfile } from './profile';
import { WeightEntry } from './weight';

export interface DailySummary {
  date: string;
  profile: UserProfile | null;
  foods: FoodEntry[];
  consumed: MacroTotals;
  weight: WeightEntry | null;
  healthMetrics: DailyHealthMetrics | null;
  calorieTarget: CalorieTarget | null;
}

export function buildDailySummary(input: {
  date: string;
  profile: UserProfile | null;
  foods: FoodEntry[];
  weight: WeightEntry | null;
  healthMetrics: DailyHealthMetrics | null;
}): DailySummary {
  return {
    ...input,
    consumed: calculateMacroTotals(input.foods),
    calorieTarget: input.profile
      ? calculateDailyCalorieTarget(input.profile, input.healthMetrics)
      : null,
  };
}
