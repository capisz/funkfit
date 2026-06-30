import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import PepperPrompt from '../../components/PepperPrompt';
import { getOnboardingDraft, resetOnboardingDraft } from '../../lib/onboardingDraft';
import { profileFromDraft } from '../../lib/core';

const CHECKLIST_ITEMS = ['Active & resting energy', 'Steps & distance', 'Body weight'];

export default function HealthScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { saveProfile, saveWeight } = useData();

  async function finishOnboarding() {
    const profile = profileFromDraft(getOnboardingDraft());
    if (!profile) {
      // Missing required fields — send the user back to fill them in.
      router.replace('/onboarding/name');
      return;
    }
    await saveProfile(profile);
    await saveWeight(profile.weightKg);
    resetOnboardingDraft();
    router.replace('/(tabs)');
  }

  return (
    <PepperPrompt
      step={8}
      totalSteps={8}
      pose="point"
      message="Last thing! Connect Apple Health and I'll adjust your targets automatically."
      onBack={() => router.back()}
      onContinue={finishOnboarding}
      continueLabel="Connect Apple Health"
      footerExtra={
        <TouchableOpacity style={styles.manualLink} onPress={finishOnboarding} activeOpacity={0.6}>
          <Text style={[styles.manualLinkText, { color: colors.textMuted }]}>
            I'll add data manually
          </Text>
        </TouchableOpacity>
      }
    >
      <View style={[styles.checklistCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {CHECKLIST_ITEMS.map((item, index) => (
          <View key={item}>
            <View style={styles.checklistRow}>
              <View style={[styles.checkCircle, { backgroundColor: colors.teal }]}>
                <Text style={styles.checkText}>{'✓'}</Text>
              </View>
              <Text style={[styles.checklistLabel, { color: colors.text }]}>{item}</Text>
            </View>
            {index < CHECKLIST_ITEMS.length - 1 && (
              <View style={[styles.checklistDivider, { backgroundColor: colors.border }]} />
            )}
          </View>
        ))}
      </View>
    </PepperPrompt>
  );
}

const styles = StyleSheet.create({
  checklistCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  checklistLabel: { fontSize: 16, fontWeight: '600' },
  checklistDivider: { height: 1, marginHorizontal: 18 },
  manualLink: { paddingVertical: 8, alignItems: 'center' },
  manualLinkText: { fontSize: 15, fontWeight: '700', textDecorationLine: 'underline' },
});
