import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DailyHealthMetrics,
  DailySummary,
  FoodEntry,
  UserProfile,
  WeightEntry,
  buildDailySummary,
  toLocalDateKey,
  upsertWeightEntry,
} from '../lib/core';

const KEYS = {
  profile: 'funkfit:v1:profile',
  weights: 'funkfit:v1:weights',
  goalWeightKg: 'funkfit:v1:goalWeightKg',
  foodsByDate: 'funkfit:v1:foodsByDate',
  activityByDate: 'funkfit:v1:activityByDate',
};

type FoodsByDate = Record<string, FoodEntry[]>;
type ActivityByDate = Record<string, DailyHealthMetrics>;

interface DataContextValue {
  hydrated: boolean;
  profile: UserProfile | null;
  weights: WeightEntry[];
  goalWeightKg: number | null;
  foodsByDate: FoodsByDate;
  activityByDate: ActivityByDate;

  saveProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  getFoods: (date: string) => FoodEntry[];
  addFood: (date: string, food: FoodEntry) => Promise<void>;
  removeFood: (date: string, foodId: string) => Promise<void>;
  saveWeight: (weightKg: number, date?: string) => Promise<void>;
  saveGoalWeightKg: (weightKg: number) => Promise<void>;
  getActivity: (date: string) => DailyHealthMetrics | null;
  saveActivity: (metrics: DailyHealthMetrics) => Promise<void>;
  getDailySummary: (date: string) => DailySummary;
  resetAll: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

function createId(): string {
  return globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [goalWeightKg, setGoalWeightKg] = useState<number | null>(null);
  const [foodsByDate, setFoodsByDate] = useState<FoodsByDate>({});
  const [activityByDate, setActivityByDate] = useState<ActivityByDate>({});

  // Latest snapshots for synchronous reads inside callbacks.
  const foodsRef = useRef(foodsByDate);
  foodsRef.current = foodsByDate;
  const activityRef = useRef(activityByDate);
  activityRef.current = activityByDate;
  const weightsRef = useRef(weights);
  weightsRef.current = weights;

  useEffect(() => {
    (async () => {
      const [p, w, g, f, a] = await Promise.all([
        readJson<UserProfile | null>(KEYS.profile, null),
        readJson<WeightEntry[]>(KEYS.weights, []),
        readJson<number | null>(KEYS.goalWeightKg, null),
        readJson<FoodsByDate>(KEYS.foodsByDate, {}),
        readJson<ActivityByDate>(KEYS.activityByDate, {}),
      ]);
      setProfile(p);
      setWeights(w);
      setGoalWeightKg(g);
      setFoodsByDate(f);
      setActivityByDate(a);
      setHydrated(true);
    })();
  }, []);

  const saveProfile = useCallback(async (next: UserProfile) => {
    setProfile(next);
    await AsyncStorage.setItem(KEYS.profile, JSON.stringify(next));
  }, []);

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      AsyncStorage.setItem(KEYS.profile, JSON.stringify(next));
      return next;
    });
  }, []);

  const getFoods = useCallback((date: string) => foodsRef.current[date] || [], []);

  const persistFoods = useCallback(async (next: FoodsByDate) => {
    setFoodsByDate(next);
    await AsyncStorage.setItem(KEYS.foodsByDate, JSON.stringify(next));
  }, []);

  const addFood = useCallback(
    async (date: string, food: FoodEntry) => {
      const withId: FoodEntry = {
        ...food,
        id: food.id || createId(),
        createdAt: food.createdAt || new Date().toISOString(),
      };
      const next = {
        ...foodsRef.current,
        [date]: [...(foodsRef.current[date] || []), withId],
      };
      await persistFoods(next);
    },
    [persistFoods]
  );

  const removeFood = useCallback(
    async (date: string, foodId: string) => {
      const next = {
        ...foodsRef.current,
        [date]: (foodsRef.current[date] || []).filter((f) => f.id !== foodId),
      };
      await persistFoods(next);
    },
    [persistFoods]
  );

  const saveWeight = useCallback(
    async (weightKg: number, date = toLocalDateKey()) => {
      const now = new Date().toISOString();
      const next = upsertWeightEntry(weightsRef.current, {
        date,
        weightKg,
        source: 'manual',
        createdAt: now,
        updatedAt: now,
      });
      setWeights(next);
      await AsyncStorage.setItem(KEYS.weights, JSON.stringify(next));
      // Keep the profile's current weight in sync.
      setProfile((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, weightKg, updatedAt: now };
        AsyncStorage.setItem(KEYS.profile, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const saveGoalWeightKgFn = useCallback(async (weightKg: number) => {
    setGoalWeightKg(weightKg);
    await AsyncStorage.setItem(KEYS.goalWeightKg, JSON.stringify(weightKg));
  }, []);

  const getActivity = useCallback((date: string) => activityRef.current[date] || null, []);

  const saveActivity = useCallback(async (metrics: DailyHealthMetrics) => {
    const next = { ...activityRef.current, [metrics.date]: metrics };
    setActivityByDate(next);
    await AsyncStorage.setItem(KEYS.activityByDate, JSON.stringify(next));
  }, []);

  const getDailySummary = useCallback(
    (date: string): DailySummary =>
      buildDailySummary({
        date,
        profile,
        foods: foodsRef.current[date] || [],
        weight: weightsRef.current.find((w) => w.date === date) || null,
        healthMetrics: activityRef.current[date] || null,
      }),
    [profile]
  );

  const resetAll = useCallback(async () => {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    setProfile(null);
    setWeights([]);
    setGoalWeightKg(null);
    setFoodsByDate({});
    setActivityByDate({});
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      hydrated,
      profile,
      weights,
      goalWeightKg,
      foodsByDate,
      activityByDate,
      saveProfile,
      updateProfile,
      getFoods,
      addFood,
      removeFood,
      saveWeight,
      saveGoalWeightKg: saveGoalWeightKgFn,
      getActivity,
      saveActivity,
      getDailySummary,
      resetAll,
    }),
    [
      hydrated,
      profile,
      weights,
      goalWeightKg,
      foodsByDate,
      activityByDate,
      saveProfile,
      updateProfile,
      getFoods,
      addFood,
      removeFood,
      saveWeight,
      saveGoalWeightKgFn,
      getActivity,
      saveActivity,
      getDailySummary,
      resetAll,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
