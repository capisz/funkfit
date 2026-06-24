import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const COMPLETED_DAYS = [true, true, true, true, true, false, false];

interface Badge {
  name: string;
  description: string;
  earned: boolean;
}

const BADGES: Badge[] = [
  { name: 'First week', description: '7 days logged', earned: true },
  { name: 'On target', description: 'Hit your target 5x', earned: true },
  { name: '30 days', description: 'Log for 30 days straight', earned: false },
];

export default function StreakScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.borderLight,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backChevron, { color: colors.text }]}>{'‹'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>Your streak</Text>

        {/* Hero card with gradient */}
        <View style={styles.heroCard}>
          <View style={styles.heroGradient}>
            <Image
              source={require('../assets/images/pepper-flex.png')}
              style={styles.pepperFlex}
              resizeMode="contain"
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroNumber}>12</Text>
              <Text style={styles.heroLabel}>day logging streak</Text>
            </View>
          </View>
        </View>

        {/* This week */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          THIS WEEK
        </Text>
        <View
          style={[
            styles.weekCard,
            {
              backgroundColor: colors.card,
              shadowColor: colors.cardShadow,
            },
          ]}
        >
          <View style={styles.daysRow}>
            {DAYS.map((day, index) => {
              const completed = COMPLETED_DAYS[index];
              return (
                <View key={`${day}-${index}`} style={styles.dayItem}>
                  <View
                    style={[
                      styles.dayCircle,
                      completed
                        ? { backgroundColor: colors.teal }
                        : {
                            borderWidth: 2,
                            borderStyle: 'dashed',
                            borderColor: colors.borderLight,
                            backgroundColor: 'transparent',
                          },
                    ]}
                  >
                    {completed && (
                      <Text style={styles.checkmark}>{'✓'}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.dayLabel,
                      { color: completed ? colors.text : colors.textMuted },
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Badges earned */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          BADGES EARNED
        </Text>
        <View style={styles.badgesContainer}>
          {BADGES.map((badge) => (
            <View
              key={badge.name}
              style={[
                styles.badgeCard,
                {
                  backgroundColor: colors.card,
                  shadowColor: colors.cardShadow,
                  opacity: badge.earned ? 1 : 0.5,
                },
              ]}
            >
              {/* Badge icon placeholder */}
              <View
                style={[
                  styles.badgeIcon,
                  {
                    backgroundColor: badge.earned
                      ? colors.tealBg
                      : colors.border,
                  },
                ]}
              >
                <Text style={styles.badgeEmoji}>
                  {badge.earned ? '⭐' : '🔒'}
                </Text>
              </View>
              <Text
                style={[
                  styles.badgeName,
                  { color: colors.text },
                ]}
              >
                {badge.name}
              </Text>
              <Text style={[styles.badgeDesc, { color: colors.textMuted }]}>
                {badge.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    fontSize: 22,
    marginTop: -2,
    marginLeft: -1,
  },
  heading: {
    fontSize: 27,
    fontWeight: '900',
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 28,
  },
  heroGradient: {
    backgroundColor: '#F1455C',
    paddingVertical: 28,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  pepperFlex: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  heroContent: {
    flex: 1,
  },
  heroNumber: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    marginTop: -4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  weekCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    gap: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeEmoji: {
    fontSize: 20,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeDesc: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
