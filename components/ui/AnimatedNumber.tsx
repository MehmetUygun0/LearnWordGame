// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { Animated, TextStyle } from 'react-native';

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  style?: TextStyle | TextStyle[];
  maxScale?: number;
};

export function AnimatedNumber({ value, prefix = '', suffix = '', style, maxScale = 1.12 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setDisplayValue(value);
    Animated.sequence([
      Animated.spring(scale, {
        toValue: maxScale,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [maxScale, scale, value]);

  return (
    <Animated.Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.82}
      style={[style, { transform: [{ scale }] }]}>
      {prefix}{displayValue}{suffix}
    </Animated.Text>
  );
}
