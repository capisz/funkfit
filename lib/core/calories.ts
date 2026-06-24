// Ported from elephit @elephit/core.
import { ACTIVITY_LEVEL_OPTIONS, UserProfile } from './profile';
import { DailyHealthMetrics } from './health';
import { KG_PER_LB } from './units';

export interface CalorieTarget {
  bmr: number;
  maintenanceCalories: number;
  goalCalories: number;
  adjustmentCalories: number;
  source: 'activity-level' | 'health-metrics';
  warning?: string;
}

export const CALORIE_ADJUSTMENT_FOR_ONE_POUND_PER_WEEK = 500;
export const KG_PER_WEEK_FOR_ONE_POUND = KG_PER_LB;

export function calculateBmr(profile: UserProfile): number {
  const sexAdjustment = profile.sex === 'male' ? 5 : -161;
  return Math.round(
    10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + sexAdjustment
  );
}

export function calculateMaintenanceCalories(
  profile: UserProfile,
  metrics?: DailyHealthMetrics | null
): { calories: number; source: CalorieTarget['source'] } {
  const bmr = calculateBmr(profile);
  const hasEnergyMetrics =
    metrics &&
    (Number.isFinite(metrics.activeEnergyKcal) || Number.isFinite(metrics.restingEnergyKcal)) &&
    metrics.source !== 'activity-level';

  if (hasEnergyMetrics) {
    const resting = Number.isFinite(metrics?.restingEnergyKcal) ? metrics?.restingEnergyKcal || 0 : bmr;
    const active = Number.isFinite(metrics?.activeEnergyKcal) ? metrics?.activeEnergyKcal || 0 : 0;
    return { calories: Math.round(resting + active), source: 'health-metrics' };
  }

  return {
    calories: Math.round(bmr * ACTIVITY_LEVEL_OPTIONS[profile.activityLevel].multiplier),
    source: 'activity-level',
  };
}

export function calculateDailyCalorieTarget(
  profile: UserProfile,
  metrics?: DailyHealthMetrics | null
): CalorieTarget {
  const bmr = calculateBmr(profile);
  const maintenance = calculateMaintenanceCalories(profile, metrics);
  const adjustment =
    profile.goal === 'lose'
      ? -CALORIE_ADJUSTMENT_FOR_ONE_POUND_PER_WEEK
      : profile.goal === 'gain'
        ? CALORIE_ADJUSTMENT_FOR_ONE_POUND_PER_WEEK
        : 0;
  const goalCalories = maintenance.calories + adjustment;

  return {
    bmr,
    maintenanceCalories: maintenance.calories,
    goalCalories,
    adjustmentCalories: adjustment,
    source: maintenance.source,
    warning: getLowCalorieWarning(profile, goalCalories),
  };
}

export function estimateGoalDaysRemaining(
  currentWeightKg: number | null,
  goalWeightKg: number | null,
  goal: UserProfile['goal']
): number | null {
  if (!currentWeightKg || !goalWeightKg || goal === 'maintain') return null;

  const deltaKg =
    goal === 'lose' ? currentWeightKg - goalWeightKg : goalWeightKg - currentWeightKg;

  if (deltaKg <= 0) return 0;
  return Math.round((deltaKg / KG_PER_WEEK_FOR_ONE_POUND) * 7);
}

function getLowCalorieWarning(profile: UserProfile, goalCalories: number): string | undefined {
  const floor = profile.sex === 'male' ? 1500 : 1200;
  if (goalCalories <= 0) {
    return 'This target is below zero. Check profile values or choose a slower goal.';
  }
  if (goalCalories < floor) {
    return `This ${goalCalories} calorie target is unusually low for most ${profile.sex === 'male' ? 'men' : 'women'}.`;
  }
  return undefined;
}
