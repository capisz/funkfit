import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOnboardingDraft, updateOnboardingDraft } from '../../lib/onboardingDraft';
import { cleanDecimalInput } from '../../lib/core';

type Sex = 'male' | 'female';

export default function BodyScreen() {
  const router = useRouter();
  const draft = getOnboardingDraft();
  const [sex, setSex] = useState<Sex>((draft.sex as Sex) || 'male');
  const [name, setName] = useState(draft.name);
  const [age, setAge] = useState(draft.age);
  const [heightFeet, setHeightFeet] = useState(draft.heightFeet);
  const [heightInches, setHeightInches] = useState(draft.heightInches);
  const [weight, setWeight] = useState(draft.weight);

  const canContinue =
    name.trim().length > 0 &&
    Number(age) > 0 &&
    Number(heightFeet) > 0 &&
    Number(weight) > 0;

  function handleContinue() {
    if (!canContinue) return;
    updateOnboardingDraft({
      name: name.trim(),
      sex,
      age,
      heightUnit: 'imperial',
      heightFeet,
      heightInches: heightInches || '0',
      weight,
      weightUnit: 'lbs',
    });
    router.push('/onboarding/activity');
  }

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
                  step <= 2 ? styles.stepDotFilled : styles.stepDotEmpty,
                ]}
              />
            ))}
          </View>
          <Text style={styles.stepLabel}>2/4</Text>
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
              A few numbers so I can do the math.
            </Text>
            <View style={styles.speechTail} />
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>About you</Text>

        {/* Sex toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              styles.toggleLeft,
              sex === 'male' && styles.toggleActive,
            ]}
            onPress={() => setSex('male')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleText,
                sex === 'male' && styles.toggleTextActive,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              styles.toggleRight,
              sex === 'female' && styles.toggleActive,
            ]}
            onPress={() => setSex('female')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleText,
                sex === 'female' && styles.toggleTextActive,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form card */}
        <View style={styles.formCard}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Name</Text>
            <TextInput
              style={styles.formInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#BBB4A4"
              returnKeyType="next"
            />
          </View>
          <View style={styles.formDivider} />
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Age</Text>
            <TextInput
              style={styles.formInput}
              value={age}
              onChangeText={(t) => setAge(t.replace(/[^\d]/g, ''))}
              placeholder="30"
              placeholderTextColor="#BBB4A4"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.formDivider} />
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Height</Text>
            <View style={styles.heightGroup}>
              <TextInput
                style={styles.heightInput}
                value={heightFeet}
                onChangeText={(t) => setHeightFeet(t.replace(/[^\d]/g, ''))}
                placeholder="5"
                placeholderTextColor="#BBB4A4"
                keyboardType="number-pad"
              />
              <Text style={styles.heightUnit}>ft</Text>
              <TextInput
                style={styles.heightInput}
                value={heightInches}
                onChangeText={(t) => setHeightInches(t.replace(/[^\d]/g, ''))}
                placeholder="10"
                placeholderTextColor="#BBB4A4"
                keyboardType="number-pad"
              />
              <Text style={styles.heightUnit}>in</Text>
            </View>
          </View>
          <View style={styles.formDivider} />
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Weight</Text>
            <View style={styles.heightGroup}>
              <TextInput
                style={styles.formInput}
                value={weight}
                onChangeText={(t) => setWeight(cleanDecimalInput(t))}
                placeholder="200"
                placeholderTextColor="#BBB4A4"
                keyboardType="decimal-pad"
              />
              <Text style={styles.heightUnit}>lbs</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!canContinue}
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
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E7DFCE',
  },
  toggleLeft: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightWidth: 0.75,
  },
  toggleRight: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderLeftWidth: 0.75,
  },
  toggleActive: {
    backgroundColor: '#14A9AE',
    borderColor: '#14A9AE',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2F3A',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1EADB',
    overflow: 'hidden',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A2F3A',
  },
  formValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2F3A',
  },
  formInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2F3A',
    textAlign: 'right',
    minWidth: 80,
    padding: 0,
  },
  heightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heightInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2F3A',
    textAlign: 'right',
    minWidth: 28,
    padding: 0,
  },
  heightUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9A968B',
  },
  formDivider: {
    height: 1,
    backgroundColor: '#F1EADB',
    marginHorizontal: 18,
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
  continueButtonDisabled: {
    opacity: 0.45,
  },
  continueText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
