import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AdjustmentPopupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ delta?: string; newTarget?: string }>();
  const delta = Math.abs(Number(params.delta)) || 200;
  const newTarget = Number(params.newTarget) || 0;

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
        {/* Pepper mascot overlapping top */}
        <View style={styles.pepperContainer}>
          <Image
            source={require('../assets/images/pepper.png')}
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
              You've earned {delta} more calories!
            </Text>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              You moved more than usual today, so Pepper raised your target
              {newTarget ? ` to ${newTarget.toLocaleString()} kcal` : ''} to keep you fueled.
            </Text>

            {/* Food suggestion card */}
            <View style={styles.foodCard}>
              <View style={styles.foodIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.foodName}>Peanut Butter Toast</Text>
                <Text style={styles.foodCal}>~210 kcal {'·'} you log this often</Text>
              </View>
            </View>

            {/* Log it button */}
            <TouchableOpacity
              style={styles.logButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.logButtonText}>Log it</Text>
            </TouchableOpacity>

            {/* Maybe later */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.laterLink}
            >
              <Text style={[styles.laterText, { color: colors.textMuted }]}>
                Maybe later
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
  foodCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E2F6F4',
    borderRadius: 14,
    padding: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  foodIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#F7C285',
  },
  foodName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2A2F3A',
  },
  foodCal: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#0E8E93',
    marginTop: 1,
  },
  logButton: {
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
  logButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  laterLink: {
    paddingVertical: 4,
  },
  laterText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
