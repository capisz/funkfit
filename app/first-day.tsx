import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import Svg, { Circle } from 'react-native-svg';

export default function FirstDayScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const ringSize = 200;
  const strokeWidth = 14;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashLength = 12;
  const gapLength = 8;

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
          <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
            Today
          </Text>
        </View>

        {/* Dashed ring - no progress */}
        <View style={styles.ringContainer}>
          <Svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={colors.ringTrack}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${dashLength} ${gapLength}`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={[styles.ringTarget, { color: colors.text }]}>
              1,950
            </Text>
            <Text style={[styles.ringSubtitle, { color: colors.textMuted }]}>
              kcal to spend
            </Text>
            <Text style={[styles.ringNote, { color: colors.textSubtle }]}>
              nothing logged yet
            </Text>
          </View>
        </View>

        {/* Pepper coach card */}
        <View
          style={[
            styles.coachCard,
            {
              backgroundColor: colors.tealBg,
            },
          ]}
        >
          <View style={styles.coachDot}>
            <Text style={styles.coachDotEmoji}>{'🌶️'}</Text>
          </View>
          <View style={styles.coachContent}>
            <Text style={[styles.coachLabel, { color: colors.tealText }]}>
              PEPPER {'·'} YOUR COACH
            </Text>
            <Text style={[styles.coachMessage, { color: colors.tealTextDark }]}>
              Welcome! Log your first meal and I'll start adapting your target to
              your day.
            </Text>
          </View>
        </View>

        {/* Empty macros card */}
        <View
          style={[
            styles.macrosCard,
            {
              backgroundColor: colors.card,
              shadowColor: colors.cardShadow,
            },
          ]}
        >
          <Text style={[styles.macrosEmpty, { color: colors.textMuted }]}>
            Your macros will appear here once you log food.
          </Text>
        </View>

        {/* Log breakfast button */}
        <TouchableOpacity
          style={styles.logButton}
          onPress={() => router.push('/food-log')}
          activeOpacity={0.8}
        >
          <Text style={styles.logButtonText}>+ Log breakfast</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tab bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderTopColor: colors.tabBorder }]}>
        <View style={styles.tabItem}>
          <View style={[styles.tabIcon, { backgroundColor: colors.teal, borderRadius: 7 }]} />
          <Text style={[styles.tabLabel, { color: colors.teal }]}>Today</Text>
        </View>
        <View style={styles.tabItem}>
          <View style={[styles.tabIconOutline, { borderColor: colors.tabIconBorder, borderRadius: 7 }]} />
          <Text style={[styles.tabLabel, { color: colors.tabInactive }]}>Activity</Text>
        </View>
        <View style={styles.tabItem}>
          <View style={[styles.tabIconOutline, { borderColor: colors.tabIconBorder, borderRadius: 7 }]} />
          <Text style={[styles.tabLabel, { color: colors.tabInactive }]}>Weight</Text>
        </View>
        <View style={styles.tabItem}>
          <View style={[styles.tabIconOutline, { borderColor: colors.tabIconBorder, borderRadius: 10 }]} />
          <Text style={[styles.tabLabel, { color: colors.tabInactive }]}>You</Text>
        </View>
      </View>
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
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTarget: {
    fontSize: 42,
    fontWeight: '800',
  },
  ringSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: -2,
  },
  ringNote: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  coachCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  coachDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,169,174,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  coachDotEmoji: {
    fontSize: 18,
  },
  coachContent: {
    flex: 1,
  },
  coachLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  coachMessage: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  macrosCard: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  macrosEmpty: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  logButton: {
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
  logButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 11,
    paddingBottom: 26,
    height: 80,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
  tabIconOutline: {
    width: 20,
    height: 20,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
