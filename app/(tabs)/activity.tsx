import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { DailyHealthMetrics, cleanDecimalInput, toLocalDateKey } from '../../lib/core';

const ACTIVE_GOAL = 600; // kcal
const EXERCISE_GOAL = 30; // minutes
const STEPS_GOAL = 10000;

function ActivityRings({
  active,
  exercise,
  steps,
  colors,
}: {
  active: number;
  exercise: number;
  steps: number;
  colors: any;
}) {
  const outerC = 2 * Math.PI * 30;
  const midC = 2 * Math.PI * 21;
  const innerC = 2 * Math.PI * 12;

  const outerProgress = Math.min(1, active / ACTIVE_GOAL);
  const midProgress = Math.min(1, exercise / EXERCISE_GOAL);
  const innerProgress = Math.min(1, steps / STEPS_GOAL);

  return (
    <View style={[styles.ringsCard, { backgroundColor: colors.card }]}>
      <View style={styles.ringsRow}>
        <Svg width={120} height={120} viewBox="0 0 80 80">
          <Defs>
            <LinearGradient id="outerGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.coral} />
              <Stop offset="1" stopColor="#FF9FB0" />
            </LinearGradient>
            <LinearGradient id="midGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.teal} />
              <Stop offset="1" stopColor="#5FE0E4" />
            </LinearGradient>
            <LinearGradient id="innerGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.sand} />
              <Stop offset="1" stopColor="#FFD9A0" />
            </LinearGradient>
          </Defs>

          <Circle cx={40} cy={40} r={30} stroke={colors.ringTrack} strokeWidth={7} fill="none" />
          <Circle
            cx={40} cy={40} r={30} stroke="url(#outerGrad)" strokeWidth={7} fill="none" strokeLinecap="round"
            strokeDasharray={outerC} strokeDashoffset={outerC * (1 - outerProgress)} rotation={-90} origin="40, 40"
          />
          <Circle cx={40} cy={40} r={21} stroke={colors.ringTrack} strokeWidth={7} fill="none" />
          <Circle
            cx={40} cy={40} r={21} stroke="url(#midGrad)" strokeWidth={7} fill="none" strokeLinecap="round"
            strokeDasharray={midC} strokeDashoffset={midC * (1 - midProgress)} rotation={-90} origin="40, 40"
          />
          <Circle cx={40} cy={40} r={12} stroke={colors.ringTrack} strokeWidth={7} fill="none" />
          <Circle
            cx={40} cy={40} r={12} stroke="url(#innerGrad)" strokeWidth={7} fill="none" strokeLinecap="round"
            strokeDasharray={innerC} strokeDashoffset={innerC * (1 - innerProgress)} rotation={-90} origin="40, 40"
          />
        </Svg>

        <View style={styles.ringsStats}>
          <View style={styles.ringStatItem}>
            <View style={[styles.ringStatDot, { backgroundColor: colors.coral }]} />
            <View>
              <Text style={[styles.ringStatValue, { color: colors.text }]}>{Math.round(active)}</Text>
              <Text style={[styles.ringStatLabel, { color: colors.textMuted }]}>kcal active</Text>
            </View>
          </View>
          <View style={styles.ringStatItem}>
            <View style={[styles.ringStatDot, { backgroundColor: colors.teal }]} />
            <View>
              <Text style={[styles.ringStatValue, { color: colors.text }]}>{Math.round(exercise)}</Text>
              <Text style={[styles.ringStatLabel, { color: colors.textMuted }]}>min exercise</Text>
            </View>
          </View>
          <View style={styles.ringStatItem}>
            <View style={[styles.ringStatDot, { backgroundColor: colors.sand }]} />
            <View>
              <Text style={[styles.ringStatValue, { color: colors.text }]}>{steps.toLocaleString()}</Text>
              <Text style={[styles.ringStatLabel, { color: colors.textMuted }]}>steps</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ActivityScreen() {
  const { colors } = useTheme();
  const { getActivity, saveActivity } = useData();
  const today = toLocalDateKey();
  const metrics = getActivity(today);

  const active = metrics?.activeEnergyKcal ?? 0;
  const exercise = metrics?.exerciseMinutes ?? 0;
  const steps = metrics?.steps ?? 0;
  const distance = metrics?.distanceWalkingRunningKm ?? 0;

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ active: '', exercise: '', steps: '', distance: '' });

  function openModal() {
    setForm({
      active: active ? String(active) : '',
      exercise: exercise ? String(exercise) : '',
      steps: steps ? String(steps) : '',
      distance: distance ? String(distance) : '',
    });
    setModalVisible(true);
  }

  function handleSave() {
    const next: DailyHealthMetrics = {
      date: today,
      source: 'manual',
      activeEnergyKcal: Number.parseFloat(form.active) || 0,
      exerciseMinutes: Number.parseFloat(form.exercise) || 0,
      steps: Math.round(Number.parseFloat(form.steps) || 0),
      distanceWalkingRunningKm: Number.parseFloat(form.distance) || 0,
      syncedAt: new Date().toISOString(),
    };
    saveActivity(next);
    setModalVisible(false);
  }

  const dateText = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const fields: { key: keyof typeof form; label: string; kb: 'decimal-pad' | 'number-pad' }[] = [
    { key: 'active', label: 'Active energy (kcal)', kb: 'number-pad' },
    { key: 'exercise', label: 'Exercise minutes', kb: 'number-pad' },
    { key: 'steps', label: 'Steps', kb: 'number-pad' },
    { key: 'distance', label: 'Distance (km)', kb: 'decimal-pad' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {dateText}
        {metrics ? ' · Manual entry' : ' · No data yet'}
      </Text>

      <ActivityRings active={active} exercise={exercise} steps={steps} colors={colors} />

      <View style={[styles.distanceCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.distanceValue, { color: colors.text }]}>{distance.toFixed(1)} km</Text>
        <Text style={[styles.distanceLabel, { color: colors.textMuted }]}>distance today</Text>
      </View>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: colors.teal }]}
        activeOpacity={0.85}
        onPress={openModal}
      >
        <Text style={styles.editButtonText}>
          {metrics ? "Edit today's activity" : "Log today's activity"}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.note, { color: colors.textMuted }]}>
        Logging active energy lets Pepper adapt your calorie target for the day.
      </Text>

      {/* Edit modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Today's activity</Text>
            {fields.map((f) => (
              <View key={f.key} style={styles.fieldRow}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{f.label}</Text>
                <TextInput
                  style={[styles.fieldInput, { color: colors.text, borderColor: colors.borderLight }]}
                  value={form[f.key]}
                  onChangeText={(t) =>
                    setForm({ ...form, [f.key]: f.kb === 'decimal-pad' ? cleanDecimalInput(t) : t.replace(/[^\d]/g, '') })
                  }
                  keyboardType={f.kb}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalCancelText, { color: colors.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSave, { backgroundColor: colors.teal }]} onPress={handleSave}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30 },
  title: { fontSize: 25, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },

  ringsCard: { borderRadius: 16, padding: 20, marginBottom: 14 },
  ringsRow: { flexDirection: 'row', alignItems: 'center' },
  ringsStats: { flex: 1, marginLeft: 20, gap: 14 },
  ringStatItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ringStatDot: { width: 10, height: 10, borderRadius: 5 },
  ringStatValue: { fontSize: 18, fontWeight: '700' },
  ringStatLabel: { fontSize: 12 },

  distanceCard: { borderRadius: 16, padding: 18, marginBottom: 20, alignItems: 'center' },
  distanceValue: { fontSize: 26, fontWeight: '700' },
  distanceLabel: { fontSize: 13, marginTop: 2 },

  editButton: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 14 },
  editButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  note: { fontSize: 13, fontWeight: '500', textAlign: 'center', lineHeight: 18, paddingHorizontal: 12 },

  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  modalCard: { width: '100%', borderRadius: 20, padding: 22 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  fieldRow: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  fieldInput: { fontSize: 16, fontWeight: '600', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 6 },
  modalCancel: { paddingVertical: 12, paddingHorizontal: 18 },
  modalCancelText: { fontSize: 15, fontWeight: '700' },
  modalSave: { paddingVertical: 12, paddingHorizontal: 26, borderRadius: 12 },
  modalSaveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
