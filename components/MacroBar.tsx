import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface MacroBarProps {
  protein: number;
  carbs: number;
  fat: number;
  eaten: number;
  target: number;
}

export default function MacroBar({
  protein,
  carbs,
  fat,
  eaten,
  target,
}: MacroBarProps) {
  const { colors } = useTheme();

  const total = protein + carbs + fat;
  const proteinPct = total > 0 ? (protein / total) * 100 : 0;
  const carbsPct = total > 0 ? (carbs / total) * 100 : 0;
  const fatPct = total > 0 ? (fat / total) * 100 : 0;

  const fillRatio = target > 0 ? Math.min(eaten / target, 1) : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
      <View style={styles.header}>
        <Text style={[styles.eaten, { color: colors.text }]}>
          {eaten}
        </Text>
        <Text style={[styles.target, { color: colors.textMuted }]}>
          {' '}/ {target} kcal
        </Text>
      </View>

      <View style={[styles.barTrack, { backgroundColor: colors.macroTrack }]}>
        <View style={[styles.barFill, { width: `${fillRatio * 100}%` }]}>
          {proteinPct > 0 && (
            <View style={[styles.barSegment, { flex: proteinPct, backgroundColor: '#F1455C' }]} />
          )}
          {carbsPct > 0 && (
            <View style={[styles.barSegment, { flex: carbsPct, backgroundColor: '#3DCCC3' }]} />
          )}
          {fatPct > 0 && (
            <View style={[styles.barSegment, { flex: fatPct, backgroundColor: '#F7C285' }]} />
          )}
        </View>
      </View>

      <View style={styles.macros}>
        <MacroReadout label="Protein" value={protein} unit="g" color="#F1455C" textColor={colors.text} mutedColor={colors.textMuted} />
        <MacroReadout label="Carbs" value={carbs} unit="g" color="#3DCCC3" textColor={colors.text} mutedColor={colors.textMuted} />
        <MacroReadout label="Fat" value={fat} unit="g" color="#F7C285" textColor={colors.text} mutedColor={colors.textMuted} />
      </View>
    </View>
  );
}

interface MacroReadoutProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  textColor: string;
  mutedColor: string;
}

function MacroReadout({ label, value, unit, color, textColor, mutedColor }: MacroReadoutProps) {
  return (
    <View style={styles.macroItem}>
      <View style={[styles.macroDot, { backgroundColor: color }]} />
      <View>
        <Text style={[styles.macroValue, { color: textColor }]}>
          {value}
          <Text style={[styles.macroUnit, { color: mutedColor }]}>{unit}</Text>
        </Text>
        <Text style={[styles.macroLabel, { color: mutedColor }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  eaten: {
    fontSize: 22,
    fontFamily: 'System',
    fontWeight: '800',
  },
  target: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barFill: {
    flexDirection: 'row',
    height: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barSegment: {
    height: '100%',
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '700',
  },
  macroUnit: {
    fontSize: 12,
    fontWeight: '500',
  },
  macroLabel: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '500',
    marginTop: 1,
  },
});
