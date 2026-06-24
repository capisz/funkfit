import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../contexts/DataContext';

export default function SplashScreen() {
  const router = useRouter();
  const { hydrated, profile } = useData();

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(
      () => router.replace(profile ? '/(tabs)' : '/login'),
      1200
    );
    return () => clearTimeout(timer);
  }, [router, hydrated, profile]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image
          source={require('../assets/images/pepper.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={styles.wordmark}>funkfit</Text>
        <Text style={styles.subtitle}>the coach that adapts to you</Text>
      </View>

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, { backgroundColor: '#14A9AE' }]} />
        <View style={[styles.dot, { backgroundColor: '#9AD9D6' }]} />
        <View style={[styles.dot, { backgroundColor: '#E0D7C6' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EEE1',
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
    color: '#14A9AE',
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A968B',
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
