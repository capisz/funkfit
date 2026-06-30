import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PepperPrompt from '../../components/PepperPrompt';
import ChoiceCard from '../../components/ChoiceCard';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';

const GOALS = [
  { id: 'lose', label: 'Lose weight', description: 'Reduce body fat while keeping muscle' },
  { id: 'maintain', label: 'Maintain', description: 'Stay right where you are' },
  { id: 'gain', label: 'Gain weight', description: 'Build muscle and add size' },
] as const;

type GoalId = (typeof GOALS)[number]['id'];

export default function GoalScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<GoalId>(
    (getOnboardingDraft().goal as GoalId) || 'lose'
  );

  return (
    <PepperPrompt
      step={2}
      totalSteps={8}
      pose="point"
      message="What are we working toward?"
      onBack={() => router.back()}
      onContinue={() => {
        updateOnboardingDraft({ goal: selected });
        router.push('/onboarding/sex');
      }}
    >
      <View style={styles.options}>
        {GOALS.map((goal) => (
          <ChoiceCard
            key={goal.id}
            label={goal.label}
            description={goal.description}
            selected={selected === goal.id}
            onPress={() => setSelected(goal.id)}
          />
        ))}
      </View>
    </PepperPrompt>
  );
}

const styles = StyleSheet.create({
  options: { gap: 12 },
});
