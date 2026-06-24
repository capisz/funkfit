import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

interface CalorieRingProps {
  remaining: number;
  target: number;
  adapted?: number;
  showAdaptBadge?: boolean;
}

export default function CalorieRing({
  remaining,
  target,
  adapted,
  showAdaptBadge = false,
}: CalorieRingProps) {
  const { colors } = useTheme();

  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const eaten = target - remaining;
  const progress = target > 0 ? Math.min(Math.max(eaten / target, 0), 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#14A9AE" />
            <Stop offset="100%" stopColor="#3DCCC3" />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.ringTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.centerContent}>
        {showAdaptBadge && adapted != null && (
          <View style={styles.adaptBadge}>
            <Text style={styles.adaptText}>
              Adapted +{adapted} today
            </Text>
          </View>
        )}
        <Text style={[styles.remaining, { color: colors.text }]}>
          {remaining}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          kcal left
        </Text>
        <Text style={[styles.targetText, { color: colors.textSubtle }]}>
          of {target} target
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adaptBadge: {
    backgroundColor: '#14A9AE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  adaptText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  remaining: {
    fontSize: 42,
    fontFamily: 'System',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
    marginTop: -2,
  },
  targetText: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '500',
    marginTop: 2,
  },
});
