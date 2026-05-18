// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { palette, radius } from '@/constants/theme';

type AnimatedProgressBarProps = {
  progress: number;
  color?: string;
};

export function AnimatedProgressBar({ progress, color = palette.lime }: AnimatedProgressBarProps) {
  const width = useRef(new Animated.Value(0)).current;
  const safeProgress = Math.max(0, Math.min(progress, 1));

  useEffect(() => {
    Animated.timing(width, {
      toValue: safeProgress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [safeProgress, width]);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: palette.backgroundElevated,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
