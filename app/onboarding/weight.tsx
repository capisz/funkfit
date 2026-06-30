import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import PepperPrompt from '../../components/PepperPrompt';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';
import { cleanDecimalInput } from '../../lib/core';

export default function WeightScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [weight, setWeight] = useState(getOnboardingDraft().weight);

  const canContinue = Number(weight) > 0;

  function handleContinue() {
    if (!canContinue) return;
    updateOnboardingDraft({ weight, weightUnit: 'lbs' });
    router.push('/onboarding/activity');
  }

  return (
    <PepperPrompt
      step={6}
      totalSteps={8}
      pose="happy"
      message="And your current weight? This is just our starting point."
      onBack={() => router.back()}
      onContinue={handleContinue}
      continueDisabled={!canContinue}
    >
      <View style={[styles.field, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={weight}
          onChangeText={(t) => setWeight(cleanDecimalInput(t))}
          placeholder="200"
          placeholderTextColor={colors.textSubtle}
          keyboardType="decimal-pad"
          autoFocus
        />
        <Text style={[styles.unit, { color: colors.textMuted }]}>lbs</Text>
      </View>
    </PepperPrompt>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  input: { flex: 1, fontSize: 28, fontWeight: '800' },
  unit: { fontSize: 16, fontWeight: '700' },
});
