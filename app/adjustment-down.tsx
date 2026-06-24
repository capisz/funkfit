import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AdjustmentDownScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Ghosted home screen background */}
      <View style={styles.ghostBg}>
        <View style={[styles.ghostCircle, { borderColor: 'rgba(20,169,174,0.15)' }]} />
        <View style={[styles.ghostRect, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
      </View>

      {/* Dark overlay scrim */}
      <View style={styles.scrim} />

      {/* Modal card */}
      <View style={styles.modalContainer}>
        {/* Pepper sleep pose overlapping top */}
        <View style={styles.pepperContainer}>
          <Image
            source={require('../assets/images/pepper-sleep.png')}
            style={styles.pepperImage}
            resizeMode="contain"
          />
        </View>

        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.card,
              shadowColor: colors.cardShadow,
            },
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.heading, { color: colors.text }]}>
              A lighter day today
            </Text>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              Looks like you're resting today — and that's totally fine. Pepper
              trimmed your target by 150 so you don't overeat on a low-burn day.
            </Text>

            {/* New target pill */}
            <View style={styles.targetPill}>
              <Text style={styles.targetLabel}>New target</Text>
              <Text style={styles.targetValue}>1,800 kcal</Text>
            </View>

            {/* Got it button */}
            <TouchableOpacity
              style={styles.gotItButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.gotItText}>Got it</Text>
            </TouchableOpacity>

            {/* See the math */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.mathLink}
            >
              <Text style={[styles.mathText, { color: colors.teal }]}>
                See the math
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F4EEE1',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  ghostCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 14,
    marginBottom: 24,
  },
  ghostRect: {
    width: SCREEN_WIDTH - 80,
    height: 80,
    borderRadius: 18,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16,14,38,0.55)',
  },
  modalContainer: {
    width: SCREEN_WIDTH - 48,
    alignItems: 'center',
    zIndex: 10,
  },
  pepperContainer: {
    zIndex: 11,
    marginBottom: -84,
  },
  pepperImage: {
    width: 120,
    height: 120,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    paddingTop: 60,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  targetPill: {
    backgroundColor: '#FBEFDC',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9A6A1E',
  },
  targetValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#9A6A1E',
  },
  gotItButton: {
    width: '100%',
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
    marginBottom: 12,
  },
  gotItText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mathLink: {
    paddingVertical: 4,
  },
  mathText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
