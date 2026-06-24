// Lightweight cross-screen holder for the onboarding wizard. Each step writes
// its fields here; the final step builds a UserProfile via profileFromDraft.
import { UserProfileDraft, createEmptyProfileDraft } from './core';

let draft: UserProfileDraft = createEmptyProfileDraft();

export function getOnboardingDraft(): UserProfileDraft {
  return draft;
}

export function updateOnboardingDraft(patch: Partial<UserProfileDraft>): void {
  draft = { ...draft, ...patch };
}

export function resetOnboardingDraft(): void {
  draft = createEmptyProfileDraft();
}
