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

export default function WhyChangedScreen() {
  const router = useRouter();
  const { mode, colors } = useTheme();
  const isDark = mode === 'dark';

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
            <Text style={[styles.backChevron, { color: colors.text }]}>
              {'‹'}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerLabel, { color: colors.textMuted }]}>
            Today's target
          </Text>
        </View>

        {/* Heading */}
        <Text style={[styles.heading, { color: colors.text }]}>
          Why your target changed
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Updated this morning · synced from Apple Health
        </Text>

        {/* Pepper speech bubble */}
        <View style={styles.pepperRow}>
          <Image
            source={require('../assets/images/pepper-point.png')}
            style={styles.pepperImage}
            resizeMode="contain"
          />
          <View
            style={[
              styles.speechBubble,
              {
                backgroundColor: isDark ? '#15303A' : '#E2F6F4',
                borderColor: isDark ? '#2A3150' : '#C8EDE8',
              },
            ]}
          >
            <Text
              style={[
                styles.speechText,
                { color: isDark ? '#A9E6E8' : '#0E6E72' },
              ]}
            >
              You moved more than usual today, so I raised your maintenance and
              target to keep you fueled. Here's the math — it adapts as you do.
            </Text>
            <View
              style={[
                styles.speechTail,
                {
                  borderRightColor: isDark ? '#15303A' : '#E2F6F4',
                },
              ]}
            />
          </View>
        </View>

        {/* Hero target card */}
        <View style={styles.heroCard}>
          <View style={styles.heroGradient}>
            {/* Decorative circle */}
            <View style={styles.heroCircle} />
            <Text style={styles.heroLabel}>TODAY'S TARGET</Text>
            <Text style={styles.heroValue}>1,950 kcal</Text>
            <Text style={styles.heroDelta}>+200 vs a typical day</Text>
          </View>
        </View>

        {/* Section label */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          HOW PEPPER GOT HERE
        </Text>

        {/* Breakdown card */}
        <View
          style={[
            styles.breakdownCard,
            {
              backgroundColor: colors.card,
              shadowColor: colors.cardShadow,
            },
          ]}
        >
          {/* Resting energy */}
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
              Resting energy
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>
              1,800
            </Text>
          </View>
          <View
            style={[
              styles.energyBar,
              { backgroundColor: colors.tealSoft },
            ]}
          />

          {/* Active energy */}
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
              Active energy
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>
              +650
            </Text>
          </View>
          <View
            style={[styles.energyBar, { backgroundColor: colors.teal }]}
          />
          <Text style={[styles.breakdownNote, { color: colors.textMuted }]}>
            Apple Watch today · {'↑'}200 vs avg
          </Text>

          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />

          {/* Maintenance */}
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
              Maintenance
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>
              2,450
            </Text>
          </View>

          {/* Goal */}
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
              Goal: lose ~1 lb/week
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.coral }]}>
              -500
            </Text>
          </View>
          <View
            style={[styles.energyBar, { backgroundColor: colors.coral }]}
          />

          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />

          {/* Today's target */}
          <View style={styles.breakdownRow}>
            <Text
              style={[
                styles.breakdownLabel,
                { color: colors.text, fontWeight: '700' },
              ]}
            >
              Today's target
            </Text>
            <Text
              style={[
                styles.breakdownValueBold,
                { color: colors.teal },
              ]}
            >
              1,950
            </Text>
          </View>
        </View>

        {/* Status line */}
        <Text style={[styles.statusLine, { color: colors.textMuted }]}>
          On track · −1.0 lb/week · ~98 days to goal
        </Text>

        {/* Action buttons */}
        <TouchableOpacity
          style={styles.gotItButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.gotItText}>Got it</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.adjustLink}
        >
          <Text style={[styles.adjustText, { color: colors.teal }]}>
            Adjust my goal
          </Text>
        </TouchableOpacity>
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
    marginBottom: 24,
    gap: 12,
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
  headerLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  heading: {
    fontSize: 27,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 20,
  },
  pepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  pepperImage: {
    width: 62,
    height: 48,
  },
  speechBubble: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 10,
    borderWidth: 1,
  },
  speechText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  speechTail: {
    position: 'absolute',
    left: -8,
    bottom: 12,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 28,
  },
  heroGradient: {
    backgroundColor: '#1BAFB3',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroDelta: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  breakdownCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  breakdownValueBold: {
    fontSize: 17,
    fontWeight: '800',
  },
  energyBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  breakdownNote: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  statusLine: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  gotItButton: {
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
  adjustLink: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  adjustText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
