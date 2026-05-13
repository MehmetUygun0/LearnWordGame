// @ts-nocheck
import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type PulseIconProps = {
  children: ReactNode;
};

export function PulseIcon({ children }: PulseIconProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 820,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 820,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            scale: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          },
        ],
      }}>
      {children}
    </Animated.View>
  );
}
