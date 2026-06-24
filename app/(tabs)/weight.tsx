import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import {
  WeightEntry,
  calculateWeeklyWeightTrend,
  cleanDecimalInput,
  formatWeight,
  getLatestWeightEntry,
  parsePositiveNumber,
  weightFromKg,
  weightToKg,
} from '../../lib/core';

const TEAL_SHADES = [
  '#A5E0E1', '#8DD8D9', '#75D0D1', '#5DC8C9',
  '#45C0C1', '#2DB8B9', '#1AADAE', '#14A9AE',
];

function WeightChart({ entries, unit, colors }: { entries: WeightEntry[]; unit: 'lbs' | 'kg'; colors: any }) {
  const recent = entries.slice(-8);
  const values = recent.map((e) => weightFromKg(e.weightKg, unit));
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const span = max - min || 1;

  return (
    <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {recent.length === 0 ? (
            <Text style={[styles.chartEmpty, { color: colors.textMuted }]}>
              Log your weight to see your trend.
            </Text>
          ) : (
            recent.map((entry, index) => {
              const v = weightFromKg(entry.weightKg, unit);
              const heightPct = 35 + ((v - min) / span) * 55;
              return (
                <View key={entry.date} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${heightPct}%`,
                        backgroundColor: TEAL_SHADES[index % TEAL_SHADES.length],
                      },
                    ]}
                  />
                </View>
              );
            })
          )}
        </View>
        {recent.length > 0 && (
          <View style={styles.chartLabels}>
            <Text style={[styles.chartLabel, { color: colors.textMuted }]}>{recent[0].date.slice(5)}</Text>
            <Text style={[styles.chartLabel, { color: colors.textMuted }]}>
              {recent[recent.length - 1].date.slice(5)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function relativeLabel(dateKey: string): string {
  const today = new Date();
  const d = new Date(`${dateKey}T00:00:00`);
  const diffDays = Math.round((today.setHours(0, 0, 0, 0) - d.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long' });
}

export default function WeightScreen() {
  const { colors } = useTheme();
  const { profile, weights, saveWeight } = useData();
  const unit = profile?.weightUnit ?? 'lbs';

  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('');

  const sorted = useMemo(() => [...weights].sort((a, b) => b.date.localeCompare(a.date)), [weights]);
  const latest = getLatestWeightEntry(weights);
  const trend = weights.length ? calculateWeeklyWeightTrend(weights, unit) : 0;

  function openModal() {
    setInput(latest ? formatWeight(latest.weightKg, unit) : '');
    setModalVisible(true);
  }

  function handleSave() {
    const parsed = parsePositiveNumber(input);
    if (!parsed) return;
    saveWeight(weightToKg(parsed, unit));
    setModalVisible(false);
    setInput('');
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Weight</Text>

      {/* Current Weight Card */}
      <View style={[styles.weightCard, { backgroundColor: colors.card }]}>
        <View style={styles.weightRow}>
          <View>
            <Text style={[styles.weightNumber, { color: colors.text }]}>
              {latest ? formatWeight(latest.weightKg, unit) : '—'}
            </Text>
            <Text style={[styles.weightUnit, { color: colors.textMuted }]}>
              {unit} · {latest ? relativeLabel(latest.date).toLowerCase() : 'no entries'}
            </Text>
          </View>
          {weights.length >= 2 && (
            <View style={styles.trendBadge}>
              <Text style={[styles.trendText, { color: trend <= 0 ? colors.coral : colors.teal }]}>
                {trend > 0 ? '+' : trend < 0 ? '−' : ''}
                {Math.abs(trend).toFixed(1)} {unit}/week
              </Text>
            </View>
          )}
        </View>
      </View>

      <WeightChart entries={weights} unit={unit} colors={colors} />

      <TouchableOpacity
        style={[styles.logButton, { backgroundColor: colors.teal }]}
        activeOpacity={0.8}
        onPress={openModal}
      >
        <Text style={styles.logButtonText}>Log today's weight</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>RECENT</Text>
      {sorted.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No weigh-ins yet.</Text>
      ) : (
        sorted.slice(0, 14).map((entry) => (
          <View key={entry.date} style={[styles.recentItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.recentLabel, { color: colors.textMuted }]}>{relativeLabel(entry.date)}</Text>
            <Text style={[styles.recentValue, { color: colors.text }]}>
              {formatWeight(entry.weightKg, unit)} {unit}
            </Text>
          </View>
        ))
      )}

      {/* Log weight modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Log weight</Text>
            <View style={styles.modalInputRow}>
              <TextInput
                style={[styles.modalInput, { color: colors.text, borderColor: colors.borderLight }]}
                value={input}
                onChangeText={(t) => setInput(cleanDecimalInput(t))}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
              <Text style={[styles.modalUnit, { color: colors.textMuted }]}>{unit}</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalCancelText, { color: colors.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, { backgroundColor: colors.teal }]}
                onPress={handleSave}
              >
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
  title: { fontSize: 25, fontWeight: '700', marginBottom: 16 },

  weightCard: { borderRadius: 16, padding: 18, marginBottom: 14 },
  weightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weightNumber: { fontSize: 38, fontWeight: '700' },
  weightUnit: { fontSize: 14, marginTop: 2 },
  trendBadge: { alignSelf: 'flex-start', marginTop: 6 },
  trendText: { fontSize: 15, fontWeight: '600' },

  chartCard: { borderRadius: 16, padding: 18, marginBottom: 14 },
  chartContainer: { height: 160 },
  barsContainer: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingBottom: 24 },
  barWrapper: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { borderRadius: 6, minHeight: 12 },
  chartEmpty: { flex: 1, textAlign: 'center', textAlignVertical: 'center', fontSize: 13, alignSelf: 'center', marginTop: 56 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  chartLabel: { fontSize: 11 },

  logButton: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 24 },
  logButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
  emptyText: { fontSize: 14, fontWeight: '500' },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  recentLabel: { fontSize: 15 },
  recentValue: { fontSize: 15, fontWeight: '600' },

  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  modalCard: { width: '100%', borderRadius: 20, padding: 22 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  modalInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  modalInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalUnit: { fontSize: 16, fontWeight: '700' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  modalCancel: { paddingVertical: 12, paddingHorizontal: 18 },
  modalCancelText: { fontSize: 15, fontWeight: '700' },
  modalSave: { paddingVertical: 12, paddingHorizontal: 26, borderRadius: 12 },
  modalSaveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
