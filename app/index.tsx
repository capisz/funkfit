import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { hydrateOnboardingDraft } from '../lib/onboardingDraft';

export default function SplashScreen() {
  const router = useRouter();
  const { hydrated, profile } = useData();
  const { colors } = useTheme();

  // Restore any in-progress onboarding draft before we might route into it.
  useEffect(() => {
    hydrateOnboardingDraft();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(
      () => router.replace(profile ? '/(tabs)' : '/login'),
      1200
    );
    return () => clearTimeout(timer);
  }, [router, hydrated, profile]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <Image
          source={require('../assets/images/pepper.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={[styles.wordmark, { color: colors.teal }]}>funkfit</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          the coach that adapts to you
        </Text>
      </View>

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, { backgroundColor: colors.teal }]} />
        <View style={[styles.dot, { backgroundColor: colors.tealSoft }]} />
        <View style={[styles.dot, { backgroundColor: colors.ringTrack }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  mascot: {
    width: 178,
    height: 134,
    marginBottom: 16,
  },
  wordmark: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
});
