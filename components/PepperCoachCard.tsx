import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { PepperImages, PepperPose } from '../constants/Images';
import { useTheme } from '../contexts/ThemeContext';

interface PepperCoachCardProps {
  message: string;
  pose?: PepperPose;
}

export default function PepperCoachCard({
  message,
  pose = 'happy',
}: PepperCoachCardProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const bgColor = isDark ? '#15303A' : '#E2F6F4';
  const labelColor = isDark ? '#5FE0E4' : '#0E8E93';
  const textColor = isDark ? '#A9E6E8' : '#0E6E72';

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.iconContainer}>
        <Image
          source={PepperImages[pose] ?? PepperImages.happy}
          style={styles.icon}
          contentFit="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: labelColor }]}>
          PEPPER {'·'} YOUR COACH
        </Text>
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
    lineHeight: 20,
  },
});
