import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { getOnboardingDraft, resetOnboardingDraft } from '../../lib/onboardingDraft';
import { profileFromDraft } from '../../lib/core';

const CHECKLIST_ITEMS = [
  'Active & resting energy',
  'Steps & distance',
  'Body weight',
];

export default function HealthScreen() {
  const router = useRouter();
  const { saveProfile, saveWeight } = useData();

  async function finishOnboarding() {
    const profile = profileFromDraft(getOnboardingDraft());
    if (!profile) {
      // Missing required fields — send the user back to fill them in.
      router.replace('/onboarding/goal');
      return;
    }
    await saveProfile(profile);
    await saveWeight(profile.weightKg);
    resetOnboardingDraft();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header: back button, step bar, step label */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backChevron}>{'‹'}</Text>
          </TouchableOpacity>
          <View style={styles.stepBar}>
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                style={[styles.stepDot, styles.stepDotFilled]}
              />
            ))}
          </View>
          <Text style={styles.stepLabel}>4/4</Text>
        </View>

        {/* Centered content */}
        <View style={styles.centeredContent}>
          {/* Pepper mascot (larger) */}
          <Image
            source={require('../../assets/images/pepper.png')}
            style={styles.pepperImage}
            resizeMode="contain"
          />

          {/* Heading */}
          <Text style={styles.heading}>Connect Apple Health</Text>

          {/* Description */}
          <Text style={styles.description}>
            Sync your Apple Watch and iPhone data so Pepper can auto-adjust your targets.
          </Text>

          {/* Checklist card */}
          <View style={styles.checklistCard}>
            {CHECKLIST_ITEMS.map((item, index) => (
              <View key={item}>
                <View style={styles.checklistRow}>
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>{'✓'}</Text>
                  </View>
                  <Text style={styles.checklistLabel}>{item}</Text>
                </View>
                {index < CHECKLIST_ITEMS.length - 1 && (
                  <View style={styles.checklistDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Bottom buttons */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={finishOnboarding}
            activeOpacity={0.8}
          >
            <View style={styles.connectButtonInner}>
              <View style={styles.dotIcon} />
              <Text style={styles.connectText}>Connect Apple Health</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manualLink}
            onPress={finishOnboarding}
            activeOpacity={0.6}
          >
            <Text style={styles.manualLinkText}>
              I'll add data manually
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4EEE1',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DFCE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    fontSize: 22,
    color: '#2A2F3A',
    marginTop: -2,
    marginLeft: -1,
  },
  stepBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    gap: 6,
  },
  stepDot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  stepDotFilled: {
    backgroundColor: '#14A9AE',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9A968B',
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  pepperImage: {
    width: 130,
    height: 98,
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2A2F3A',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#9A968B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1EADB',
    width: '100%',
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
    backgroundColor: '#14A9AE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checklistLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A2F3A',
  },
  checklistDivider: {
    height: 1,
    backgroundColor: '#F1EADB',
    marginHorizontal: 18,
  },
  bottomContainer: {
    paddingBottom: 16,
    paddingTop: 12,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#111111',
    borderRadius: 15,
    paddingVertical: 17,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  connectButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  connectText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  manualLink: {
    marginTop: 18,
    paddingVertical: 8,
  },
  manualLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9A968B',
    textDecorationLine: 'underline',
  },
});
