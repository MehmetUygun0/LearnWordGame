// @ts-nocheck
import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

type FlipTileProps = {
  children: ReactNode;
  trigger?: unknown;
  delay?: number;
  style?: ViewStyle;
};

export function FlipTile({ children, trigger, delay = 0, style }: FlipTileProps) {
  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    flip.setValue(0);
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(flip, {
        toValue: 1,
        friction: 7,
        tension: 68,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, flip, trigger]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        style,
        {
          opacity: flip,
          transform: [
            {
              rotateX: flip.interpolate({
                inputRange: [0, 1],
                outputRange: ['80deg', '0deg'],
              }),
            },
            {
              scale: flip.interpolate({
                inputRange: [0, 1],
                outputRange: [0.88, 1],
              }),
            },
          ],
        },
      ]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backfaceVisibility: 'hidden',
  },
});
