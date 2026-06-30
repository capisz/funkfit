import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { PepperPose } from '../constants/Images';
import PepperMascot from './PepperMascot';
import SpeechBubble from './SpeechBubble';
import DuoButton from './DuoButton';

interface PepperPromptProps {
  /** 1-based step for the progress bar; omit to hide it. */
  step?: number;
  totalSteps?: number;
  pose?: PepperPose;
  message: string;
  children?: React.ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  /** Optional extra control under the primary button (e.g. a text link). */
  footerExtra?: React.ReactNode;
}

/**
 * Shared Duolingo-style onboarding scaffold: progress bar, a large animated
 * Pepper with a speech bubble, a content slot, and a chunky footer button.
 */
export default function PepperPrompt({
  step,
  totalSteps,
  pose = 'happy',
  message,
  children,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  footerExtra,
}: PepperPromptProps) {
  const { colors } = useTheme();
  const showProgress = step != null && totalSteps != null;
  const progress = showProgress ? Math.min(1, step / totalSteps) : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header: back + progress bar */}
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
            onPress={onBack}
            hitSlop={8}
          >
            <Text style={[styles.backChevron, { color: colors.text }]}>{'‹'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        {showProgress && (
          <View style={[styles.progressTrack, { backgroundColor: colors.progressStep }]}>
            <View
              style={[styles.progressFill, { backgroundColor: colors.teal, width: `${progress * 100}%` }]}
            />
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Pepper + speech bubble */}
          <View style={styles.pepperRow}>
            <PepperMascot pose={pose} size={96} animated />
            <SpeechBubble message={message} tail="left" style={styles.bubble} />
          </View>

          <View style={styles.content}>{children}</View>
        </ScrollView>

        {/* Footer */}
        {(onContinue || footerExtra) && (
          <View style={styles.footer}>
            {onContinue && (
              <DuoButton
                title={continueLabel}
                onPress={onContinue}
                disabled={continueDisabled}
              />
            )}
            {footerExtra}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: { fontSize: 22, marginTop: -2, marginLeft: -1 },
  progressTrack: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 6 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 16 },
  pepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  bubble: { flex: 1, marginLeft: 10, marginBottom: 8 },
  content: { flex: 1 },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 12,
    gap: 10,
  },
});
