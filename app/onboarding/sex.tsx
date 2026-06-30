import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PepperPrompt from '../../components/PepperPrompt';
import ChoiceCard from '../../components/ChoiceCard';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';

type Sex = 'male' | 'female';

export default function SexScreen() {
  const router = useRouter();
  const [sex, setSex] = useState<Sex>((getOnboardingDraft().sex as Sex) || 'male');

  return (
    <PepperPrompt
      step={3}
      totalSteps={8}
      pose="happy"
      message="This helps me estimate your energy use. What's your biological sex?"
      onBack={() => router.back()}
      onContinue={() => {
        updateOnboardingDraft({ sex });
        router.push('/onboarding/age');
      }}
    >
      <View style={styles.options}>
        <ChoiceCard label="Male" selected={sex === 'male'} onPress={() => setSex('male')} />
        <ChoiceCard label="Female" selected={sex === 'female'} onPress={() => setSex('female')} />
      </View>
    </PepperPrompt>
  );
}

const styles = StyleSheet.create({
  options: { gap: 12 },
});
