import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type DuoVariant = 'primary' | 'secondary' | 'danger';

interface DuoButtonProps {
  title: string;
  onPress: () => void;
  variant?: DuoVariant;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const EDGE = 4; // resting height of the 3D bottom edge

/**
 * Chunky Duolingo-style button: a colored face sitting on a darker bottom edge
 * that compresses when pressed. Uses the built-in Animated API (no reanimated).
 */
export default function DuoButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  style,
}: DuoButtonProps) {
  const { colors } = useTheme();
  const press = useRef(new Animated.Value(0)).current;

  const v = getVariant(variant, colors);

  const animateTo = (to: number) =>
    Animated.timing(press, {
      toValue: to,
      duration: 60,
      useNativeDriver: true,
    }).start();

  const translateY = press.interpolate({
    inputRange: [0, 1],
    outputRange: [0, EDGE],
  });

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => !disabled && animateTo(1)}
      onPressOut={() => !disabled && animateTo(0)}
      style={[styles.wrapper, style, disabled && styles.disabled]}
    >
      {/* Darker edge fills the wrapper; the face covers all but the bottom strip */}
      <View style={[styles.edge, { backgroundColor: v.edge }]} />
      <Animated.View
        style={[
          styles.face,
          {
            backgroundColor: v.face,
            borderColor: v.border,
            borderWidth: v.border ? 2 : 0,
            transform: [{ translateY }],
            marginBottom: EDGE,
          },
        ]}
      >
        {icon != null && icon}
        <Text style={[styles.text, { color: v.text }]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

function getVariant(
  variant: DuoVariant,
  c: ReturnType<typeof useTheme>['colors']
): { face: string; edge: string; text: string; border?: string } {
  switch (variant) {
    case 'primary':
      return { face: c.teal, edge: c.tealEdge, text: '#FFFFFF' };
    case 'danger':
      return { face: c.coral, edge: c.coralEdge, text: '#FFFFFF' };
    case 'secondary':
      return { face: c.card, edge: c.borderCard, text: c.text, border: c.borderLight };
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  disabled: {
    opacity: 0.45,
  },
  edge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  text: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
