// Cross-screen holder for the onboarding wizard. Each step writes its fields
// here; the final step builds a UserProfile via profileFromDraft. Backed by
// AsyncStorage so progress survives an app reload mid-onboarding.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfileDraft, createEmptyProfileDraft } from './core';

const STORAGE_KEY = 'funkfit:v1:onboardingDraft';

let draft: UserProfileDraft = createEmptyProfileDraft();

/** Load any persisted draft into memory. Call once on app start. */
export async function hydrateOnboardingDraft(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      draft = { ...createEmptyProfileDraft(), ...(JSON.parse(raw) as Partial<UserProfileDraft>) };
    }
  } catch {
    // Ignore corrupt/empty storage — fall back to the empty draft.
  }
}

export function getOnboardingDraft(): UserProfileDraft {
  return draft;
}

export function updateOnboardingDraft(patch: Partial<UserProfileDraft>): void {
  draft = { ...draft, ...patch };
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(draft)).catch(() => {});
}

export function resetOnboardingDraft(): void {
  draft = createEmptyProfileDraft();
  AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
}
