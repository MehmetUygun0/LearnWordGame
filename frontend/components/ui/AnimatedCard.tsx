// @ts-nocheck
import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

type AnimatedCardProps = {
  children: ReactNode;
  delay?: number;
  style?: ViewStyle;
};

export function AnimatedCard({ children, delay = 0, style }: AnimatedCardProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: 1,
      delay,
      friction: 8,
      tension: 65,
      useNativeDriver: true,
    }).start();
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.97, 1],
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
    width: '100%',
  },
});
