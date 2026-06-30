import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import PepperMascot from '../../components/PepperMascot';
import SpeechBubble from '../../components/SpeechBubble';
import DuoButton from '../../components/DuoButton';

// Pepper introduces itself, Duolingo-style, one line at a time.
const LINES: { pose: 'wave' | 'happy' | 'point' | 'flex'; text: string }[] = [
  { pose: 'wave', text: "Hi, I'm Pepper! I'm going to be your coach. 👋" },
  { pose: 'happy', text: "Most calorie apps give you one number and never change it. Not me." },
  { pose: 'point', text: "I watch how much you move and adjust your target every day — move more, eat more." },
  { pose: 'flex', text: "You just log your food and live your day. I'll handle the math. Ready?" },
];

export default function IntroScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);

  const isLast = index === LINES.length - 1;
  const line = LINES[index];

  function advance() {
    if (isLast) {
      router.push('/onboarding/name');
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Pressable style={styles.tapArea} onPress={advance}>
        <PepperMascot pose={line.pose} size={180} animated />
        <SpeechBubble message={line.text} tail="top" style={styles.bubble} />
        <Text style={[styles.hint, { color: colors.textSubtle }]}>
          {isLast ? '' : 'tap to continue'}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <DuoButton title={isLast ? "Let's go" : 'Next'} onPress={advance} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  tapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 24,
  },
  bubble: { alignSelf: 'stretch' },
  hint: { fontSize: 13, fontWeight: '700', marginTop: -8 },
  footer: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 12 },
});
