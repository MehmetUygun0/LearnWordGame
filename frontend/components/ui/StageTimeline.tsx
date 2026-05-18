// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';

type StageTimelineProps = {
  stage: number;
  nextReviewLabel?: string;
};

const repeatSlots = [1, 2, 3, 4, 5, 6];

export function StageTimeline({ stage, nextReviewLabel }: StageTimelineProps) {
  const safeStage = Math.max(0, Math.min(stage, repeatSlots.length));
  const activeSlot = Math.min(safeStage + 1, repeatSlots.length);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 760,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 760,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse, safeStage]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{safeStage}/6 doğru tekrar</Text>
        <Text style={styles.nextText}>
          {safeStage >= 6 ? 'Öğrenildi' : `Sıradaki: ${nextReviewLabel ?? 'tekrar zamanı'}`}
        </Text>
      </View>
      <View style={styles.steps}>
        {repeatSlots.map((slot) => {
          const isDone = slot <= safeStage;
          const isActive = slot === activeSlot && safeStage < 6;

          return (
            <View key={slot} style={styles.stepWrap}>
              <Animated.View
                style={[
                  styles.dot,
                  isDone && styles.dotDone,
                  isActive && styles.dotActive,
                  isActive && {
                    transform: [
                      {
                        scale: pulse.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.12],
                        }),
                      },
                    ],
                  },
                ]}>
                <Text style={[styles.dotText, isDone && styles.dotTextDone]}>
                  {isDone ? '✓' : slot}
                </Text>
              </Animated.View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{slot}. tekrar</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    alignItems: 'center',
  },
  title: {
    ...typography.label,
    color: palette.text,
  },
  nextText: {
    ...typography.caption,
    color: palette.textMuted,
    flexShrink: 1,
    textAlign: 'right',
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  stepWrap: {
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: palette.limeSoft,
    borderColor: palette.lime,
  },
  dotActive: {
    backgroundColor: palette.primary,
  },
  dotText: {
    ...typography.caption,
    color: palette.textFaint,
  },
  dotTextDone: {
    color: palette.text,
  },
  label: {
    ...typography.caption,
    color: palette.textFaint,
    fontSize: 9,
  },
  labelActive: {
    color: palette.text,
  },
});
