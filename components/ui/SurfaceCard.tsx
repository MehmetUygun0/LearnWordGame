// @ts-nocheck
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { palette, radius, shadows, spacing } from '@/constants/theme';

type SurfaceCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  muted?: boolean;
  accent?: 'none' | 'primary' | 'secondary' | 'success';
};

export function SurfaceCard({
  children,
  style,
  muted = false,
  accent = 'none',
}: SurfaceCardProps) {
  return (
    <View
      style={[
        styles.card,
        muted && styles.cardMuted,
        accent !== 'none' && styles.withAccent,
        accentStyles[accent],
        shadows.soft,
        style,
      ]}>
      <View pointerEvents="none" style={styles.cornerGlow} />
      <View pointerEvents="none" style={[styles.lightRail, railStyles[accent]]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
  },
  cornerGlow: {
    position: 'absolute',
    top: -44,
    right: -34,
    width: 108,
    height: 108,
    borderRadius: 36,
    backgroundColor: palette.electricSoft,
    opacity: 0.8,
    transform: [{ rotate: '24deg' }],
  },
  cardMuted: {
    backgroundColor: palette.cardMuted,
  },
  withAccent: {
    borderLeftWidth: 0,
  },
  lightRail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.95,
  },
});

const accentStyles = StyleSheet.create({
  none: {},
  primary: {
    borderColor: 'rgba(255, 77, 141, 0.36)',
  },
  secondary: {
    borderColor: 'rgba(255, 184, 107, 0.30)',
  },
  success: {
    borderColor: 'rgba(85, 226, 140, 0.28)',
  },
});

const railStyles = StyleSheet.create({
  none: {
    backgroundColor: 'transparent',
  },
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.secondary,
  },
  success: {
    backgroundColor: palette.success,
  },
});
