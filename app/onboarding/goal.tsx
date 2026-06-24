import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';

const GOALS = [
  {
    id: 'lose',
    label: 'Lose weight',
    description: 'Reduce body fat while keeping muscle',
  },
  {
    id: 'maintain',
    label: 'Maintain',
    description: 'Stay right where you are',
  },
  {
    id: 'gain',
    label: 'Gain weight',
    description: 'Build muscle and add size',
  },
] as const;

type GoalId = (typeof GOALS)[number]['id'];

export default function GoalScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<GoalId>(
    (getOnboardingDraft().goal as GoalId) || 'lose'
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: back button, step bar, step label */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backChevron}>{'‹'}</Text>
          </TouchableOpacity>
          <View style={styles.stepBar}>
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                style={[
                  styles.stepDot,
                  step <= 1 ? styles.stepDotFilled : styles.stepDotEmpty,
                ]}
              />
            ))}
          </View>
          <Text style={styles.stepLabel}>1/4</Text>
        </View>

        {/* Pepper mascot with speech bubble */}
        <View style={styles.pepperRow}>
          <Image
            source={require('../../assets/images/pepper.png')}
            style={styles.pepperImage}
            resizeMode="contain"
          />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              First — what are we working toward?
            </Text>
            <View style={styles.speechTail} />
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Your goal</Text>

        {/* Goal options */}
        <View style={styles.optionsContainer}>
          {GOALS.map((goal) => {
            const isSelected = selected === goal.id;
            return (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(goal.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.radio,
                      isSelected && styles.radioSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {goal.label}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {goal.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            updateOnboardingDraft({ goal: selected });
            router.push('/onboarding/body');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4EEE1',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
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
  stepDotEmpty: {
    backgroundColor: '#E7E0CF',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9A968B',
  },
  pepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  pepperImage: {
    width: 62,
    height: 48,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#F1EADB',
  },
  speechText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A2F3A',
    lineHeight: 21,
  },
  speechTail: {
    position: 'absolute',
    left: -8,
    bottom: 12,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: '#FFFFFF',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2A2F3A',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F1EADB',
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCardSelected: {
    backgroundColor: '#E2F6F4',
    borderColor: '#14A9AE',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E7DFCE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioSelected: {
    borderColor: '#14A9AE',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#14A9AE',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2F3A',
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: '#0E6E72',
  },
  optionDescription: {
    fontSize: 13,
    color: '#9A968B',
    lineHeight: 18,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 12,
  },
  continueButton: {
    backgroundColor: '#14A9AE',
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(20,169,174,0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  continueText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
