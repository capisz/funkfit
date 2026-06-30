import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import PepperPrompt from '../../components/PepperPrompt';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';

export default function NameScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState(getOnboardingDraft().name);

  const canContinue = name.trim().length > 0;

  function handleContinue() {
    if (!canContinue) return;
    updateOnboardingDraft({ name: name.trim() });
    router.push('/onboarding/goal');
  }

  return (
    <PepperPrompt
      step={1}
      totalSteps={8}
      pose="happy"
      message="First things first — what should I call you?"
      onBack={() => router.back()}
      onContinue={handleContinue}
      continueDisabled={!canContinue}
    >
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, borderColor: colors.borderLight, color: colors.text },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={colors.textSubtle}
        returnKeyType="done"
        autoFocus
        autoCapitalize="words"
        onSubmitEditing={handleContinue}
      />
    </PepperPrompt>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 20,
    fontWeight: '700',
  },
});
