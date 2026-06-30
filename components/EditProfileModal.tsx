import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import ChoiceCard from './ChoiceCard';
import DuoButton from './DuoButton';
import {
  ActivityLevel,
  Goal,
  Sex,
  UserProfile,
  UserProfileDraft,
  cleanDecimalInput,
  createEmptyProfileDraft,
  draftFromProfile,
  profileFromDraft,
} from '../lib/core';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile;
}

const GOALS: { id: Goal; label: string }[] = [
  { id: 'lose', label: 'Lose weight' },
  { id: 'maintain', label: 'Maintain' },
  { id: 'gain', label: 'Gain weight' },
];

const ACTIVITY: { id: ActivityLevel; label: string }[] = [
  { id: 'sedentary', label: 'Sedentary' },
  { id: 'light', label: 'Light' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'very-active', label: 'Very active' },
];

export default function EditProfileModal({ visible, onClose, profile }: EditProfileModalProps) {
  const { colors } = useTheme();
  const { saveProfile, saveWeight } = useData();
  const [draft, setDraft] = useState<UserProfileDraft>(createEmptyProfileDraft());

  // Re-seed from the live profile each time the modal opens.
  useEffect(() => {
    if (visible) setDraft(draftFromProfile(profile));
  }, [visible, profile]);

  const set = (patch: Partial<UserProfileDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const valid = profileFromDraft(draft) != null;

  async function handleSave() {
    const next = profileFromDraft(draft);
    if (!next) return;
    await saveProfile(next);
    await saveWeight(next.weightKg);
    onClose();
  }

  const fieldStyle = [
    styles.field,
    { backgroundColor: colors.card, borderColor: colors.borderLight },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Text style={[styles.cancel, { color: colors.textMuted }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Edit profile</Text>
          <View style={styles.cancelSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Label colors={colors}>Name</Label>
          <View style={fieldStyle}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={draft.name}
              onChangeText={(t) => set({ name: t })}
              placeholder="Your name"
              placeholderTextColor={colors.textSubtle}
              autoCapitalize="words"
            />
          </View>

          <Label colors={colors}>Goal</Label>
          <View style={styles.options}>
            {GOALS.map((g) => (
              <ChoiceCard
                key={g.id}
                label={g.label}
                selected={draft.goal === g.id}
                onPress={() => set({ goal: g.id })}
              />
            ))}
          </View>

          <Label colors={colors}>Sex</Label>
          <View style={styles.options}>
            {(['male', 'female'] as Sex[]).map((s) => (
              <ChoiceCard
                key={s}
                label={s === 'male' ? 'Male' : 'Female'}
                selected={draft.sex === s}
                onPress={() => set({ sex: s })}
              />
            ))}
          </View>

          <Label colors={colors}>Age</Label>
          <View style={fieldStyle}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={draft.age}
              onChangeText={(t) => set({ age: t.replace(/[^\d]/g, '') })}
              keyboardType="number-pad"
              maxLength={3}
            />
            <Text style={[styles.unit, { color: colors.textMuted }]}>years</Text>
          </View>

          <Label colors={colors}>Height</Label>
          <View style={styles.row}>
            <View style={fieldStyle}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={draft.heightFeet}
                onChangeText={(t) => set({ heightUnit: 'imperial', heightFeet: t.replace(/[^\d]/g, '') })}
                keyboardType="number-pad"
                maxLength={1}
              />
              <Text style={[styles.unit, { color: colors.textMuted }]}>ft</Text>
            </View>
            <View style={fieldStyle}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={draft.heightInches}
                onChangeText={(t) => set({ heightUnit: 'imperial', heightInches: t.replace(/[^\d]/g, '') })}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={[styles.unit, { color: colors.textMuted }]}>in</Text>
            </View>
          </View>

          <Label colors={colors}>Weight</Label>
          <View style={fieldStyle}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={draft.weight}
              onChangeText={(t) => set({ weight: cleanDecimalInput(t) })}
              keyboardType="decimal-pad"
            />
            <Text style={[styles.unit, { color: colors.textMuted }]}>{draft.weightUnit}</Text>
          </View>

          <Label colors={colors}>Activity level</Label>
          <View style={styles.options}>
            {ACTIVITY.map((a) => (
              <ChoiceCard
                key={a.id}
                label={a.label}
                selected={draft.activityLevel === a.id}
                onPress={() => set({ activityLevel: a.id })}
              />
            ))}
          </View>

          <View style={styles.saveWrap}>
            <DuoButton title="Save changes" onPress={handleSave} disabled={!valid} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function Label({ children, colors }: { children: React.ReactNode; colors: any }) {
  return <Text style={[styles.label, { color: colors.textMuted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  cancel: { fontSize: 16, fontWeight: '700' },
  cancelSpacer: { width: 52 },
  title: { fontSize: 18, fontWeight: '900' },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  options: { gap: 10 },
  row: { flexDirection: 'row', gap: 12 },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 18, fontWeight: '700' },
  unit: { fontSize: 15, fontWeight: '700' },
  saveWrap: { marginTop: 28 },
});
