// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { palette } from '@/constants/theme';

export function AnimatedBackground() {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 4200,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 4200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [drift]);

  const floatA = {
    transform: [
      {
        translateY: drift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 18],
        }),
      },
      {
        translateX: drift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };
  const floatB = {
    transform: [
      {
        translateY: drift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -16],
        }),
      },
      {
        translateX: drift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 12],
        }),
      },
      { rotate: '-18deg' },
    ],
  };

  return (
    <>
      <Animated.View pointerEvents="none" style={[styles.orbitOne, floatA]} />
      <Animated.View pointerEvents="none" style={[styles.orbitTwo, floatB]} />
      <Animated.View pointerEvents="none" style={[styles.orbitThree, floatA]} />
    </>
  );
}

const styles = StyleSheet.create({
  orbitOne: {
    position: 'absolute',
    top: 88,
    left: -22,
    width: 92,
    height: 92,
    borderRadius: 34,
    backgroundColor: palette.primarySoft,
    opacity: 0.62,
    transform: [{ rotate: '16deg' }],
  },
  orbitTwo: {
    position: 'absolute',
    top: 280,
    right: -26,
    width: 120,
    height: 46,
    borderRadius: 24,
    backgroundColor: palette.electricSoft,
    opacity: 0.74,
  },
  orbitThree: {
    position: 'absolute',
    bottom: 90,
    left: 28,
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: palette.limeSoft,
    opacity: 0.58,
    transform: [{ rotate: '-14deg' }],
  },
});
