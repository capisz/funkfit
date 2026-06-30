import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import {
  ACTIVITY_LEVEL_OPTIONS,
  Goal,
  WeightUnit,
  cleanDecimalInput,
  formatWeight,
  parsePositiveNumber,
  weightToKg,
} from '../../lib/core';
import EditProfileModal from '../../components/EditProfileModal';

const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose weight',
  maintain: 'Maintain',
  gain: 'Gain weight',
};

function SettingRow({
  label,
  value,
  colors,
  isLast = false,
  onPress,
}: {
  label: string;
  value: string | React.ReactNode;
  colors: any;
  isLast?: boolean;
  onPress?: () => void;
}) {
  const Wrapper: any = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={[styles.settingRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={[styles.settingValue, { color: colors.textMuted }]}>{value}</Text>
      ) : (
        value
      )}
    </Wrapper>
  );
}

export default function ProfileScreen() {
  const { mode, colors, toggleTheme } = useTheme();
  const router = useRouter();
  const { profile, goalWeightKg, saveGoalWeightKg, updateProfile, resetAll } = useData();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [goalModal, setGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [editVisible, setEditVisible] = useState(false);

  const unit: WeightUnit = profile?.weightUnit ?? 'lbs';
  const initial = (profile?.name || 'Y').charAt(0).toUpperCase();

  function openGoalModal() {
    setGoalInput(goalWeightKg != null ? formatWeight(goalWeightKg, unit) : '');
    setGoalModal(true);
  }

  function saveGoal() {
    const parsed = parsePositiveNumber(goalInput);
    if (parsed) saveGoalWeightKg(weightToKg(parsed, unit));
    setGoalModal(false);
  }

  function toggleUnit() {
    updateProfile({ weightUnit: unit === 'lbs' ? 'kg' : 'lbs' });
  }

  function confirmReset() {
    Alert.alert(
      'Reset all data?',
      'This clears your profile, food logs, weigh-ins and activity on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAll();
            router.replace('/login');
          },
        },
      ]
    );
  }

  const metaLine = profile
    ? `${GOAL_LABELS[profile.goal]} · ${ACTIVITY_LEVEL_OPTIONS[profile.activityLevel].label} · ${profile.age}`
    : '';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>You</Text>

      {/* Profile Card — tap to edit */}
      <TouchableOpacity
        style={[styles.profileCard, { backgroundColor: colors.card }]}
        onPress={() => profile && setEditVisible(true)}
        activeOpacity={0.8}
        disabled={!profile}
      >
        <View style={[styles.profileAvatar, { backgroundColor: colors.teal }]}>
          <Text style={styles.profileAvatarText}>{initial}</Text>
        </View>
        <Text style={[styles.profileName, { color: colors.text }]}>{profile?.name || 'You'}</Text>
        <Text style={[styles.profileMeta, { color: colors.textMuted }]}>{metaLine}</Text>
        {profile && (
          <Text style={[styles.editHint, { color: colors.teal }]}>Edit profile</Text>
        )}
      </TouchableOpacity>

      {/* Plan Section */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>PLAN</Text>
      <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
        <SettingRow
          label="Goal weight"
          value={goalWeightKg != null ? `${formatWeight(goalWeightKg, unit)} ${unit}` : 'Set'}
          colors={colors}
          onPress={openGoalModal}
        />
        <SettingRow label="Units" value={unit} colors={colors} onPress={toggleUnit} />
        <SettingRow
          label="Goal"
          value={profile ? GOAL_LABELS[profile.goal] : '—'}
          colors={colors}
          onPress={() => profile && setEditVisible(true)}
        />
        <SettingRow
          label="Activity"
          value={profile ? ACTIVITY_LEVEL_OPTIONS[profile.activityLevel].label : '—'}
          colors={colors}
          onPress={() => profile && setEditVisible(true)}
          isLast
        />
      </View>

      {/* App Section */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APP</Text>
      <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
        <SettingRow
          label="Notifications from Pepper"
          colors={colors}
          value={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.teal }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <SettingRow
          label="Preview Pepper's reminders"
          value={'›'}
          colors={colors}
          onPress={() => router.push('/notifications')}
        />
        <SettingRow
          label="Dark mode"
          colors={colors}
          isLast
          value={
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.teal }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </View>

      <TouchableOpacity style={[styles.resetButton, { borderColor: colors.coral }]} onPress={confirmReset}>
        <Text style={[styles.resetText, { color: colors.coral }]}>Reset all data</Text>
      </TouchableOpacity>

      {/* Goal weight modal */}
      <Modal visible={goalModal} transparent animationType="fade" onRequestClose={() => setGoalModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Goal weight</Text>
            <View style={styles.modalInputRow}>
              <TextInput
                style={[styles.modalInput, { color: colors.text, borderColor: colors.borderLight }]}
                value={goalInput}
                onChangeText={(t) => setGoalInput(cleanDecimalInput(t))}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
              <Text style={[styles.modalUnit, { color: colors.textMuted }]}>{unit}</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setGoalModal(false)}>
                <Text style={[styles.modalCancelText, { color: colors.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSave, { backgroundColor: colors.teal }]} onPress={saveGoal}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit profile modal */}
      {profile && (
        <EditProfileModal
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          profile={profile}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30 },
  title: { fontSize: 25, fontWeight: '700', marginBottom: 20 },

  profileCard: { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileAvatarText: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
  profileName: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  profileMeta: { fontSize: 14 },
  editHint: { fontSize: 13, fontWeight: '800', marginTop: 10 },

  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  settingsCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLabel: { fontSize: 15, fontWeight: '500' },
  settingValue: { fontSize: 15 },

  resetButton: { borderWidth: 1.5, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  resetText: { fontSize: 15, fontWeight: '700' },

  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  modalCard: { width: '100%', borderRadius: 20, padding: 22 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  modalInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  modalInput: { flex: 1, fontSize: 26, fontWeight: '700', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  modalUnit: { fontSize: 16, fontWeight: '700' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  modalCancel: { paddingVertical: 12, paddingHorizontal: 18 },
  modalCancelText: { fontSize: 15, fontWeight: '700' },
  modalSave: { paddingVertical: 12, paddingHorizontal: 26, borderRadius: 12 },
  modalSaveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
