import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ProgressStepBarProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressStepBar({
  currentStep,
  totalSteps = 4,
}: ProgressStepBarProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepIndex = i + 1;
        const isCompleted = stepIndex <= currentStep;
        return (
          <View
            key={stepIndex}
            style={[
              styles.bar,
              {
                backgroundColor: isCompleted ? colors.teal : colors.progressStep,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 4,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});
