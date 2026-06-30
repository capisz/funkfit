import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ChoiceCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

/** Selectable option row used across the choice-based onboarding steps. */
export default function ChoiceCard({ label, description, selected, onPress }: ChoiceCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        selected && { backgroundColor: colors.tealBg, borderColor: colors.teal },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.text}>
        <Text style={[styles.label, { color: selected ? colors.tealTextDark : colors.text }]}>
          {label}
        </Text>
        {description != null && (
          <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
        )}
      </View>
      <View
        style={[
          styles.check,
          { borderColor: colors.borderLight },
          selected && { backgroundColor: colors.teal, borderColor: colors.teal },
        ]}
      >
        {selected && <Text style={styles.checkMark}>{'✓'}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: { flex: 1 },
  label: { fontSize: 17, fontWeight: '800', marginBottom: 2 },
  description: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkMark: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
