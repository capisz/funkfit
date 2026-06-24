import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

// Confetti piece component
function ConfettiPiece({
  top,
  left,
  color,
  size,
  rotation,
  isCircle,
}: {
  top: number;
  left: number;
  color: string;
  size: number;
  rotation: string;
  isCircle: boolean;
}) {
  return (
    <View
      style={[
        styles.confetti,
        {
          top,
          left,
          backgroundColor: color,
          width: isCircle ? size : size * 0.4,
          height: size,
          borderRadius: isCircle ? size / 2 : 2,
          transform: [{ rotate: rotation }],
        },
      ]}
    />
  );
}

const CONFETTI_PIECES = [
  { top: 60, left: 30, color: '#FFD700', size: 12, rotation: '25deg', isCircle: false },
  { top: 100, left: 280, color: '#FF6B7C', size: 10, rotation: '-15deg', isCircle: true },
  { top: 80, left: 160, color: '#FFFFFF', size: 8, rotation: '45deg', isCircle: false },
  { top: 140, left: 50, color: '#9AD9D6', size: 14, rotation: '60deg', isCircle: false },
  { top: 120, left: 320, color: '#FFD700', size: 10, rotation: '-30deg', isCircle: true },
  { top: 200, left: 20, color: '#FF6B7C', size: 8, rotation: '80deg', isCircle: false },
  { top: 180, left: 300, color: '#FFFFFF', size: 12, rotation: '-45deg', isCircle: false },
  { top: 240, left: 100, color: '#F7C285', size: 10, rotation: '15deg', isCircle: true },
  { top: 160, left: 220, color: '#9AD9D6', size: 8, rotation: '-60deg', isCircle: false },
  { top: 280, left: 260, color: '#FFD700', size: 12, rotation: '35deg', isCircle: false },
  { top: 320, left: 40, color: '#FFFFFF', size: 10, rotation: '-20deg', isCircle: true },
  { top: 350, left: 180, color: '#FF6B7C', size: 14, rotation: '70deg', isCircle: false },
  { top: 400, left: 310, color: '#F7C285', size: 8, rotation: '-50deg', isCircle: false },
  { top: 440, left: 70, color: '#9AD9D6', size: 12, rotation: '40deg', isCircle: true },
];

export default function GoalHitScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background gradient simulation */}
      <View style={styles.gradientBg}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Confetti */}
      {CONFETTI_PIECES.map((piece, index) => (
        <ConfettiPiece key={index} {...piece} />
      ))}

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require('../assets/images/pepper-cheer.png')}
          style={styles.pepperCheer}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Goal smashed!</Text>
        <Text style={styles.message}>
          You hit your target 7 days straight. Your body's adapting — and so am I.
        </Text>

        <TouchableOpacity
          style={styles.keepGoingButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.keepGoingText}>Keep it going</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBg: {
    ...StyleSheet.absoluteFill,
  },
  gradientTop: {
    flex: 1,
    backgroundColor: '#1BAFB3',
  },
  gradientBottom: {
    flex: 1,
    backgroundColor: '#0E8E93',
  },
  confetti: {
    position: 'absolute',
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 2,
  },
  pepperCheer: {
    width: 178,
    height: 134,
    marginBottom: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  keepGoingButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  keepGoingText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0E8E93',
  },
});
