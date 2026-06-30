import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import PepperPrompt from '../../components/PepperPrompt';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';

export default function AgeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [age, setAge] = useState(getOnboardingDraft().age);

  const canContinue = Number(age) > 0;

  function handleContinue() {
    if (!canContinue) return;
    updateOnboardingDraft({ age });
    router.push('/onboarding/height');
  }

  return (
    <PepperPrompt
      step={4}
      totalSteps={8}
      pose="happy"
      message="How old are you?"
      onBack={() => router.back()}
      onContinue={handleContinue}
      continueDisabled={!canContinue}
    >
      <View style={[styles.field, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={age}
          onChangeText={(t) => setAge(t.replace(/[^\d]/g, ''))}
          placeholder="30"
          placeholderTextColor={colors.textSubtle}
          keyboardType="number-pad"
          autoFocus
          maxLength={3}
        />
        <Text style={[styles.unit, { color: colors.textMuted }]}>years</Text>
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
