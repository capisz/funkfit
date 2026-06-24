import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface StatRowProps {
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
}

export default function StatRow({ label, value, sublabel, color }: StatRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.labelContainer}>
        {color != null && <View style={[styles.dot, { backgroundColor: color }]} />}
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {sublabel != null && (
          <Text style={[styles.sublabel, { color: colors.textMuted }]}>{sublabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '700',
  },
  sublabel: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '500',
    marginTop: 1,
  },
});
