import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { PepperImages, PepperPose } from '../constants/Images';

interface PepperMascotProps {
  pose: PepperPose;
  size?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export default function PepperMascot({
  pose,
  size = 120,
  animated = false,
  style,
}: PepperMascotProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) {
      translateY.setValue(0);
      scale.setValue(1);
      return;
    }

    const bobAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    bobAnimation.start();
    breatheAnimation.start();

    return () => {
      bobAnimation.stop();
      breatheAnimation.stop();
    };
  }, [animated, translateY, scale]);

  const imageSource = PepperImages[pose] ?? PepperImages.happy;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateY }, { scale }],
        },
        style,
      ]}
    >
      <Image
        source={imageSource}
        style={{ width: size, height: size }}
        contentFit="contain"
        transition={200}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
