import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type TailSide = 'left' | 'top' | 'none';

interface SpeechBubbleProps {
  /** Convenience for plain string content. */
  message?: string;
  children?: React.ReactNode;
  tail?: TailSide;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pepper's rounded speech bubble. Theme-aware; tail can point toward a mascot
 * placed to the left (`left`) or above (`top`).
 */
export default function SpeechBubble({
  message,
  children,
  tail = 'left',
  style,
}: SpeechBubbleProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.bubble,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {tail === 'left' && (
        <View style={[styles.tailLeft, { borderRightColor: colors.card }]} />
      )}
      {tail === 'top' && (
        <View style={[styles.tailTop, { borderBottomColor: colors.card }]} />
      )}
      {message != null ? (
        <Text style={[styles.text, { color: colors.text }]}>{message}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
  tailLeft: {
    position: 'absolute',
    left: -9,
    bottom: 14,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
  },
  tailTop: {
    position: 'absolute',
    top: -9,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
  },
});
