import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import PepperPrompt from '../../components/PepperPrompt';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';

export default function HeightScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const draft = getOnboardingDraft();
  const [feet, setFeet] = useState(draft.heightFeet);
  const [inches, setInches] = useState(draft.heightInches);

  const canContinue = Number(feet) > 0;

  function handleContinue() {
    if (!canContinue) return;
    updateOnboardingDraft({
      heightUnit: 'imperial',
      heightFeet: feet,
      heightInches: inches || '0',
    });
    router.push('/onboarding/weight');
  }

  return (
    <PepperPrompt
      step={5}
      totalSteps={8}
      pose="point"
      message="How tall are you?"
      onBack={() => router.back()}
      onContinue={handleContinue}
      continueDisabled={!canContinue}
    >
      <View style={styles.row}>
        <View style={[styles.field, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={feet}
            onChangeText={(t) => setFeet(t.replace(/[^\d]/g, ''))}
            placeholder="5"
            placeholderTextColor={colors.textSubtle}
            keyboardType="number-pad"
            autoFocus
            maxLength={1}
          />
          <Text style={[styles.unit, { color: colors.textMuted }]}>ft</Text>
        </View>
        <View style={[styles.field, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={inches}
            onChangeText={(t) => setInches(t.replace(/[^\d]/g, ''))}
            placeholder="10"
            placeholderTextColor={colors.textSubtle}
            keyboardType="number-pad"
            maxLength={2}
          />
          <Text style={[styles.unit, { color: colors.textMuted }]}>in</Text>
        </View>
      </View>
    </PepperPrompt>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  field: {
    flex: 1,
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
