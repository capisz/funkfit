import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, DimensionValue } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import {
  calculateDailyCalorieTarget,
  calculateWeeklyWeightTrend,
  computeStreak,
  estimateGoalDaysRemaining,
  getLatestWeightEntry,
  toLocalDateKey,
} from '../../lib/core';

function coachMessage(opts: {
  firstName: string;
  hasEverLogged: boolean;
  remaining: number;
  streak: number;
  hour: number;
}): string {
  const { firstName, hasEverLogged, remaining, streak, hour } = opts;
  if (!hasEverLogged) {
    return `Welcome, ${firstName}! Log your first meal and I'll start adapting your target to your day.`;
  }
  if (remaining < 0) {
    return `You're ${Math.abs(remaining).toLocaleString()} kcal over today. No stress — tomorrow's a fresh start.`;
  }
  if (streak >= 3) {
    return `${streak}-day streak! 🔥 ${remaining.toLocaleString()} kcal left — keep it rolling.`;
  }
  if (hour >= 17) {
    return `Evening check-in: ${remaining.toLocaleString()} kcal left. Room for a good dinner.`;
  }
  const partOfDay = hour < 11 ? 'Morning' : 'Afternoon';
  return `${partOfDay}! You've got ${remaining.toLocaleString()} kcal left today — room for a solid meal.`;
}

export default function TodayScreen() {
  const { mode, colors, toggleTheme } = useTheme();
  const router = useRouter();
  const { profile, weights, goalWeightKg, foodsByDate, getDailySummary } = useData();

  const today = toLocalDateKey();
  const summary = getDailySummary(today);
  const target = summary.calorieTarget?.goalCalories ?? 0;
  const eaten = Math.round(summary.consumed.total);
  const remaining = target - eaten;
  const activeEnergy = Math.round(summary.healthMetrics?.activeEnergyKcal ?? 0);
  const steps = summary.healthMetrics?.steps ?? null;
  const adapted = summary.calorieTarget?.source === 'health-metrics';

  // Logging streak, derived from days that have any food entries.
  const loggedDates = useMemo(
    () => Object.keys(foodsByDate).filter((d) => (foodsByDate[d]?.length ?? 0) > 0),
    [foodsByDate]
  );
  const streak = useMemo(() => computeStreak(loggedDates, today), [loggedDates, today]);
  const hasEverLogged = loggedDates.length > 0;

  // How far the health-adjusted target moved from the activity-level baseline.
  const adjustmentDelta = useMemo(() => {
    if (!profile || !adapted) return 0;
    const base = calculateDailyCalorieTarget(profile, null).goalCalories;
    return target - base;
  }, [profile, adapted, target]);

  // Pepper's contextual moment-screens — each fires at most once per day.
  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    (async () => {
      if (target > 0 && eaten >= target) {
        const key = `funkfit:v1:goalHitShown:${today}`;
        if (!(await AsyncStorage.getItem(key))) {
          await AsyncStorage.setItem(key, '1');
          if (!cancelled) router.push('/goal-hit');
          return; // don't stack a second modal on top
        }
      }
      if (adapted && Math.abs(adjustmentDelta) >= 75) {
        const key = `funkfit:v1:adjustShown:${today}`;
        if (!(await AsyncStorage.getItem(key))) {
          await AsyncStorage.setItem(key, '1');
          if (!cancelled) {
            router.push({
              pathname: adjustmentDelta > 0 ? '/adjustment-popup' : '/adjustment-down',
              params: { delta: String(Math.round(adjustmentDelta)), newTarget: String(target) },
            });
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile, target, eaten, adapted, adjustmentDelta, today, router]);

  const protein = Math.round(summary.consumed.protein);
  const carbs = Math.round(summary.consumed.carbs);
  const fat = Math.round(summary.consumed.fat);

  const unit = profile?.weightUnit ?? 'lbs';
  const trend = weights.length ? calculateWeeklyWeightTrend(weights, unit) : 0;
  const latest = getLatestWeightEntry(weights);
  const daysToGoal =
    profile && latest ? estimateGoalDaysRemaining(latest.weightKg, goalWeightKg, profile.goal) : null;

  const circumference = 2 * Math.PI * 80;
  const progress = target > 0 ? Math.min(1, Math.max(0, eaten / target)) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const pct = (kcal: number): DimensionValue =>
    target > 0 ? (`${Math.min(100, (kcal / target) * 100)}%` as DimensionValue) : '0%';

  const dateText = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const firstName = (profile?.name || 'there').split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>{dateText}</Text>
            <Text style={[styles.greeting, { color: colors.text }]}>Hi, {firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push('/streak')}
              style={[styles.streakChip, { backgroundColor: colors.sandBg }]}
              activeOpacity={0.75}
            >
              <Text style={styles.streakFlame}>🔥</Text>
              <Text style={[styles.streakCount, { color: colors.sandText }]}>{streak.current}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={[styles.avatar, { backgroundColor: colors.teal }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calorie Ring */}
        <View style={styles.ringOuter}>
          <View style={styles.ringWrap}>
            <Svg width={240} height={240} viewBox="0 0 200 200">
              <Defs>
                <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={mode === 'dark' ? '#3DCCC3' : '#3DCCC3'} />
                  <Stop offset="1" stopColor={mode === 'dark' ? '#2FD3D8' : '#14A9AE'} />
                </LinearGradient>
              </Defs>
              <Circle cx={100} cy={100} r={80} fill="none" stroke={colors.ringTrack} strokeWidth={15} />
              <Circle
                cx={100} cy={100} r={80} fill="none"
                stroke="url(#ringGrad)" strokeWidth={15} strokeLinecap="round"
                strokeDasharray={`${circumference}`} strokeDashoffset={strokeDashoffset}
                rotation={-90} origin="100, 100"
              />
            </Svg>
            <View style={styles.ringCenter}>
              {adapted && (
                <View style={[styles.adaptBadge, { backgroundColor: colors.tealBg }]}>
                  <View style={styles.adaptArrow}>
                    <View style={[styles.triangle, { borderBottomColor: colors.tealText }]} />
                  </View>
                  <Text style={[styles.adaptText, { color: colors.tealText }]}>Health-adjusted today</Text>
                </View>
              )}
              <Text style={[styles.kcalNumber, { color: colors.text }]}>
                {Math.abs(remaining).toLocaleString()}
              </Text>
              <Text style={[styles.kcalLabel, { color: colors.textMuted }]}>
                {remaining >= 0 ? 'kcal left' : 'kcal over'}
              </Text>
              <Text style={[styles.kcalTarget, { color: colors.textSubtle }]}>
                of {target.toLocaleString()} target
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <View style={[styles.statDot, { backgroundColor: colors.teal }]} />
            <Text style={[styles.statValue, { color: colors.text }]}>{target.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Target</Text>
          </View>
          <View style={styles.statCol}>
            <View style={[styles.statDot, { backgroundColor: colors.coral }]} />
            <Text style={[styles.statValue, { color: colors.text }]}>{eaten.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Eaten</Text>
          </View>
          <View style={styles.statCol}>
            <View style={[styles.statDot, { backgroundColor: colors.sand }]} />
            <Text style={[styles.statValue, { color: colors.text }]}>{activeEnergy.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Active</Text>
          </View>
        </View>

        {/* Log food button */}
        <TouchableOpacity
          style={[styles.logButton, { backgroundColor: colors.teal }]}
          onPress={() => router.push('/food-log')}
          activeOpacity={0.85}
        >
          <Text style={styles.logButtonText}>+ Log food</Text>
        </TouchableOpacity>

        {/* Pepper Coach Card */}
        <TouchableOpacity
          style={[styles.coachCard, { backgroundColor: colors.tealBg }]}
          onPress={() => router.push('/why-changed')}
          activeOpacity={0.7}
        >
          <View style={[styles.coachIcon, { backgroundColor: mode === 'dark' ? '#0E2129' : '#fff' }]}>
            <Image source={require('../../assets/images/pepper.png')} style={styles.coachImg} resizeMode="contain" />
          </View>
          <View style={styles.coachBody}>
            <View style={styles.coachHeader}>
              <Text style={[styles.coachLabel, { color: colors.tealText }]}>PEPPER {'·'} YOUR COACH</Text>
              <Text style={[styles.coachChevron, { color: mode === 'dark' ? '#3C7C80' : '#7FCFCD' }]}>{'›'}</Text>
            </View>
            <Text style={[styles.coachMsg, { color: colors.tealTextDark }]}>
              {coachMessage({
                firstName,
                hasEverLogged,
                remaining,
                streak: streak.current,
                hour: new Date().getHours(),
              })}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Macros Card */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: mode === 'dark' ? '#000' : '#3C321E' }]}>
          <View style={styles.macroHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Macros</Text>
            <Text style={[styles.macroSummary, { color: colors.textMuted }]}>
              {eaten.toLocaleString()} / {target.toLocaleString()} kcal
            </Text>
          </View>
          <View style={[styles.macroBar, { backgroundColor: colors.macroTrack }]}>
            <View style={{ width: pct(protein * 4), height: '100%', backgroundColor: colors.coral }} />
            <View style={{ width: pct(carbs * 4), height: '100%', backgroundColor: '#3DCCC3' }} />
            <View style={{ width: pct(fat * 9), height: '100%', backgroundColor: colors.sand }} />
          </View>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: colors.coral }]} />
              <Text style={[styles.macroValue, { color: colors.text }]}>{protein}g</Text>
              <Text style={[styles.macroLabel, { color: colors.textMuted }]}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: '#3DCCC3' }]} />
              <Text style={[styles.macroValue, { color: colors.text }]}>{carbs}g</Text>
              <Text style={[styles.macroLabel, { color: colors.textMuted }]}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: colors.sand }]} />
              <Text style={[styles.macroValue, { color: colors.text }]}>{fat}g</Text>
              <Text style={[styles.macroLabel, { color: colors.textMuted }]}>Fat</Text>
            </View>
          </View>
        </View>

        {/* This Week */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: mode === 'dark' ? '#000' : '#3C321E' }]}>
          <View style={styles.weekHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>This week</Text>
            <View style={[styles.healthBadge, { backgroundColor: colors.tealBg }]}>
              <Text style={[styles.healthText, { color: colors.tealText }]}>
                {adapted ? 'APPLE HEALTH' : 'ESTIMATE'}
              </Text>
            </View>
          </View>
          <View style={styles.weekRow}>
            <View style={styles.weekItem}>
              <Text style={[styles.weekValue, { color: trend <= 0 ? colors.coral : colors.text }]}>
                {trend > 0 ? '+' : trend < 0 ? '−' : ''}
                {Math.abs(trend).toFixed(1)}
              </Text>
              <Text style={[styles.weekLabel, { color: colors.textMuted }]}>{unit} / week</Text>
            </View>
            <View style={styles.weekItem}>
              <Text style={[styles.weekValue, { color: colors.text }]}>
                {daysToGoal != null ? daysToGoal : '—'}
              </Text>
              <Text style={[styles.weekLabel, { color: colors.textMuted }]}>days to goal</Text>
            </View>
            <View style={styles.weekItem}>
              <Text style={[styles.weekValue, { color: colors.text }]}>
                {steps != null ? steps.toLocaleString() : '—'}
              </Text>
              <Text style={[styles.weekLabel, { color: colors.textMuted }]}>steps today</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingTop: 62, paddingBottom: 4 },
  dateText: { fontSize: 13.5, fontWeight: '700' },
  greeting: { fontSize: 24, fontWeight: '900', lineHeight: 28, marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  streakChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 11, height: 36, borderRadius: 18 },
  streakFlame: { fontSize: 15 },
  streakCount: { fontSize: 16, fontWeight: '900' },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', shadowColor: 'rgba(20,169,174,0.22)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 6 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },

  ringOuter: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 4, alignItems: 'center' },
  ringWrap: { width: 240, height: 240, position: 'relative' },
  ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  adaptBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 4, borderRadius: 999, marginBottom: 9 },
  adaptArrow: { width: 8, height: 6 },
  triangle: { width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  adaptText: { fontSize: 11.5, fontWeight: '800' },
  kcalNumber: { fontSize: 58, fontWeight: '600', lineHeight: 58, letterSpacing: -1.5 },
  kcalLabel: { fontSize: 14.5, fontWeight: '700', marginTop: 3 },
  kcalTarget: { fontSize: 12.5, fontWeight: '700', marginTop: 1 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 18, paddingTop: 4, paddingBottom: 12 },
  statCol: { alignItems: 'center', gap: 5 },
  statDot: { width: 9, height: 9, borderRadius: 4.5 },
  statValue: { fontSize: 18, fontWeight: '600' },
  statLabel: { fontSize: 12, fontWeight: '700' },

  logButton: { marginHorizontal: 22, marginBottom: 14, borderRadius: 15, paddingVertical: 15, alignItems: 'center', shadowColor: 'rgba(20,169,174,0.3)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 18, elevation: 6 },
  logButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  coachCard: { marginHorizontal: 22, marginBottom: 12, borderRadius: 20, padding: 14, paddingLeft: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  coachIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  coachImg: { width: 32, height: 32 },
  coachBody: { flex: 1 },
  coachHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  coachLabel: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.4 },
  coachChevron: { fontSize: 20, fontWeight: '600' },
  coachMsg: { fontSize: 13.5, fontWeight: '700', lineHeight: 19, marginTop: 3 },

  card: { marginHorizontal: 22, marginBottom: 12, borderRadius: 22, padding: 16, paddingHorizontal: 18, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 26, elevation: 8 },
  cardTitle: { fontSize: 15, fontWeight: '800' },

  macroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  macroSummary: { fontSize: 13, fontWeight: '500' },
  macroBar: { height: 12, borderRadius: 999, flexDirection: 'row', overflow: 'hidden', marginBottom: 14 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroItem: { alignItems: 'center', gap: 3 },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroValue: { fontSize: 15, fontWeight: '600' },
  macroLabel: { fontSize: 11.5, fontWeight: '700' },

  weekHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  healthBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  healthText: { fontSize: 11, fontWeight: '800' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekItem: { gap: 2 },
  weekValue: { fontSize: 18, fontWeight: '600' },
  weekLabel: { fontSize: 11.5, fontWeight: '700' },
});
