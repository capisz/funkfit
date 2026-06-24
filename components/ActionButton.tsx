import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'dark' | 'outline';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export default function ActionButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
}: ActionButtonProps) {
  const variantStyles = getVariantStyles(variant);

  return (
    <TouchableOpacity
      style={[styles.base, variantStyles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon != null && icon}
      <Text style={[styles.text, variantStyles.text]}>{title}</Text>
    </TouchableOpacity>
  );
}

function getVariantStyles(variant: ButtonVariant): {
  button: ViewStyle;
  text: TextStyle;
} {
  switch (variant) {
    case 'primary':
      return {
        button: {
          backgroundColor: '#14A9AE',
          shadowColor: 'rgba(20,169,174,0.35)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 4,
        },
        text: {
          color: '#FFFFFF',
        },
      };
    case 'dark':
      return {
        button: {
          backgroundColor: '#111111',
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 4,
        },
        text: {
          color: '#FFFFFF',
        },
      };
    case 'outline':
      return {
        button: {
          backgroundColor: '#FFFFFF',
          borderWidth: 1.5,
          borderColor: '#E2DAC9',
        },
        text: {
          color: '#2A2F3A',
        },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 15,
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '700',
  },
});
