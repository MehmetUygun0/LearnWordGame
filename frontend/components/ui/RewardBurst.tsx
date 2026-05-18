// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';

type RewardBurstProps = {
  visible: boolean;
  label: string;
};

export function RewardBurst({ visible, label }: RewardBurstProps) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: visible ? 1 : 0,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.delay(650),
      Animated.timing(scale, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, visible, label]);

  return (
    <Animated.View pointerEvents="none" style={[styles.burst, { transform: [{ scale }] }]}>
      <View style={styles.sparkOne} />
      <View style={styles.sparkTwo} />
      <View style={styles.sparkThree} />
      <View style={styles.sparkFour} />
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  burst: {
    position: 'absolute',
    top: 18,
    right: 18,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: palette.accent,
    borderWidth: 2,
    borderColor: palette.text,
    zIndex: 20,
  },
  label: {
    ...typography.label,
    color: palette.background,
  },
  sparkOne: {
    position: 'absolute',
    top: -8,
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.secondary,
  },
  sparkTwo: {
    position: 'absolute',
    bottom: -6,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.primary,
  },
  sparkThree: {
    position: 'absolute',
    top: 4,
    right: -9,
    width: 9,
    height: 9,
    borderRadius: 3,
    backgroundColor: palette.electric,
    transform: [{ rotate: '28deg' }],
  },
  sparkFour: {
    position: 'absolute',
    bottom: 4,
    left: -8,
    width: 10,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.lime,
    transform: [{ rotate: '-18deg' }],
  },
});
