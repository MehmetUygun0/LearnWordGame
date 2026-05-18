// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';

type RevealStageTimelineProps = {
  stage: number;
  nextReviewLabel?: string;
};

const repeatSlots = [1, 2, 3, 4, 5, 6];

export function RevealStageTimeline({ stage, nextReviewLabel }: RevealStageTimelineProps) {
  const values = useRef(repeatSlots.map(() => new Animated.Value(0))).current;
  const safeStage = Math.max(0, Math.min(stage, repeatSlots.length));

  useEffect(() => {
    values.forEach((value) => value.setValue(0));
    Animated.stagger(
      90,
      values.map((value) =>
        Animated.spring(value, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [safeStage, values]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>{safeStage}/6 doğru tekrar</Text>
        <Text style={styles.nextText}>
          {safeStage >= 6 ? 'Öğrenildi' : `Sıradaki: ${nextReviewLabel ?? 'tekrar zamanı'}`}
        </Text>
      </View>
      <View style={styles.steps}>
      {repeatSlots.map((slot, index) => {
        const isDone = slot <= safeStage;
        const isActive = slot === Math.min(safeStage + 1, 6) && safeStage < 6;

        return (
          <Animated.View
            key={slot}
            style={[
              styles.stepWrap,
              {
                opacity: values[index],
                transform: [
                  {
                    translateY: values[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [14, 0],
                    }),
                  },
                  {
                    scale: values[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}>
            <View style={[styles.dot, isDone && styles.dotDone, isActive && styles.dotActive]}>
              <Text style={[styles.dotText, isDone && styles.dotTextDone]}>{isDone ? '✓' : slot}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{slot}. tekrar</Text>
          </Animated.View>
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  summaryText: {
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
