import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PepperPrompt from '../../components/PepperPrompt';
import ChoiceCard from '../../components/ChoiceCard';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';
import type { ActivityLevel } from '../../lib/core';

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little or no exercise, desk job' },
  { id: 'light', label: 'Light', description: 'Light exercise 1–3 days/week' },
  { id: 'moderate', label: 'Moderate', description: 'Moderate exercise 3–5 days/week' },
  { id: 'very_active', label: 'Very active', description: 'Hard exercise 6–7 days/week' },
] as const;

type ActivityId = (typeof ACTIVITY_LEVELS)[number]['id'];

const ACTIVITY_ID_TO_LEVEL: Record<ActivityId, ActivityLevel> = {
  sedentary: 'sedentary',
  light: 'light',
  moderate: 'moderate',
  very_active: 'very-active',
};

const LEVEL_TO_ID: Record<ActivityLevel, ActivityId> = {
  sedentary: 'sedentary',
  light: 'light',
  moderate: 'moderate',
  'very-active': 'very_active',
};

export default function ActivityScreen() {
  const router = useRouter();
  const draftLevel = getOnboardingDraft().activityLevel;
  const [selected, setSelected] = useState<ActivityId>(
    draftLevel ? LEVEL_TO_ID[draftLevel] : 'moderate'
  );

  return (
    <PepperPrompt
      step={7}
      totalSteps={8}
      pose="flex"
      message="How active is a normal week for you?"
      onBack={() => router.back()}
      onContinue={() => {
        updateOnboardingDraft({ activityLevel: ACTIVITY_ID_TO_LEVEL[selected] });
        router.push('/onboarding/health');
      }}
    >
      <View style={styles.options}>
        {ACTIVITY_LEVELS.map((level) => (
          <ChoiceCard
            key={level.id}
            label={level.label}
            description={level.description}
            selected={selected === level.id}
            onPress={() => setSelected(level.id)}
          />
        ))}
      </View>
    </PepperPrompt>
  );
}

const styles = StyleSheet.create({
  options: { gap: 12 },
});
