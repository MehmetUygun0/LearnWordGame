// @ts-nocheck
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { palette, radius } from '@/constants/theme';

type ProgressMeterProps = {
  progress: number;
};

export function ProgressMeter({ progress }: ProgressMeterProps) {
  const safeProgress = Math.max(0, Math.min(progress, 1));

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${safeProgress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.accent,
  },
});
