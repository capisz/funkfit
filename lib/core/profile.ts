// Ported from elephit @elephit/core.
import {
  HeightUnit,
  WeightUnit,
  cmToImperialHeight,
  imperialHeightToCm,
  parsePositiveNumber,
  weightFromKg,
  weightToKg,
} from './units';

export type Sex = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very-active';

export interface UserProfile {
  name: string;
  sex: Sex;
  age: number;
  weightKg: number;
  weightUnit: WeightUnit;
  heightCm: number;
  heightUnit: HeightUnit;
  goal: Goal;
  activityLevel: ActivityLevel;
  image?: string | null;
  updatedAt: string;
}

export interface UserProfileDraft {
  name: string;
  sex: '' | Sex;
  age: string;
  weight: string;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  goal: '' | Goal;
  activityLevel: '' | ActivityLevel;
  image: string;
}

export const ACTIVITY_LEVEL_OPTIONS: Record<
  ActivityLevel,
  { label: string; description: string; multiplier: number }
> = {
  sedentary: {
    label: 'Sedentary',
    description: 'Mostly seated, little planned activity',
    multiplier: 1.2,
  },
  light: {
    label: 'Light',
    description: 'Light exercise or regular walking',
    multiplier: 1.375,
  },
  moderate: {
    label: 'Moderate',
    description: 'Training or active work several days per week',
    multiplier: 1.55,
  },
  'very-active': {
    label: 'Very active',
    description: 'Hard training, sport, or highly active work',
    multiplier: 1.725,
  },
};

export const DEFAULT_ACTIVITY_LEVEL: ActivityLevel = 'sedentary';

export function createEmptyProfileDraft(): UserProfileDraft {
  return {
    name: '',
    sex: '',
    age: '',
    weight: '',
    weightUnit: 'lbs',
    heightUnit: 'imperial',
    heightFeet: '5',
    heightInches: '0',
    heightCm: '170',
    goal: '',
    activityLevel: DEFAULT_ACTIVITY_LEVEL,
    image: '',
  };
}

export function draftFromProfile(profile: UserProfile): UserProfileDraft {
  const imperialHeight = cmToImperialHeight(profile.heightCm);

  return {
    name: profile.name,
    sex: profile.sex,
    age: String(profile.age),
    weight: weightFromKg(profile.weightKg, profile.weightUnit).toFixed(1),
    weightUnit: profile.weightUnit,
    heightUnit: profile.heightUnit,
    heightFeet: String(imperialHeight.feet),
    heightInches: String(imperialHeight.inches),
    heightCm: String(Math.round(profile.heightCm)),
    goal: profile.goal,
    activityLevel: profile.activityLevel,
    image: profile.image || '',
  };
}

export function profileFromDraft(draft: UserProfileDraft, now = new Date()): UserProfile | null {
  const age = parsePositiveNumber(draft.age);
  const weight = parsePositiveNumber(draft.weight);

  if (!draft.name.trim() || !draft.sex || !draft.goal || !draft.activityLevel || !age || !weight) {
    return null;
  }

  const heightCm =
    draft.heightUnit === 'imperial'
      ? imperialHeightToCm(Number(draft.heightFeet) || 0, Number(draft.heightInches) || 0)
      : parsePositiveNumber(draft.heightCm);

  if (!heightCm) return null;

  return {
    name: draft.name.trim(),
    sex: draft.sex,
    age: Math.round(age),
    weightKg: weightToKg(weight, draft.weightUnit),
    weightUnit: draft.weightUnit,
    heightCm,
    heightUnit: draft.heightUnit,
    goal: draft.goal,
    activityLevel: draft.activityLevel,
    image: draft.image || null,
    updatedAt: now.toISOString(),
  };
}

export function isActivityLevel(value: unknown): value is ActivityLevel {
  return (
    value === 'sedentary' ||
    value === 'light' ||
    value === 'moderate' ||
    value === 'very-active'
  );
}

export function isGoal(value: unknown): value is Goal {
  return value === 'lose' || value === 'maintain' || value === 'gain';
}

export function isSex(value: unknown): value is Sex {
  return value === 'male' || value === 'female';
}

export function isWeightUnit(value: unknown): value is WeightUnit {
  return value === 'lbs' || value === 'kg';
}

export function isHeightUnit(value: unknown): value is HeightUnit {
  return value === 'imperial' || value === 'metric';
}
