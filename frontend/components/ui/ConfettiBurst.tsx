// @ts-nocheck
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { palette } from '@/constants/theme';

type ConfettiBurstProps = {
  active: boolean;
};

const colors = [palette.primary, palette.secondary, palette.accent, palette.electric, palette.lime];

export function ConfettiBurst({ active }: ConfettiBurstProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => ({
        index,
        color: colors[index % colors.length],
        left: 18 + ((index * 37) % 260),
        rotate: `${(index * 23) % 80 - 40}deg`,
        distance: 70 + ((index * 17) % 95),
      })),
    []
  );

  useEffect(() => {
    if (!active) {
      return;
    }

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [active, progress]);

  return (
    <>
      {pieces.map((piece) => (
        <Animated.View
          key={piece.index}
          pointerEvents="none"
          style={[
            styles.piece,
            {
              left: piece.left,
              backgroundColor: piece.color,
              opacity: progress.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, piece.distance],
                  }),
                },
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, piece.index % 2 ? 26 : -22],
                  }),
                },
                { rotate: piece.rotate },
              ],
            },
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 42,
    width: 9,
    height: 14,
    borderRadius: 3,
    zIndex: 30,
  },
});
