// @ts-nocheck
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { palette, radius, shadows, spacing } from '@/constants/theme';

type SurfaceCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  muted?: boolean;
};

// Sayfalarda tekrar eden yüzey standardını tek yerde topluyoruz.
export function SurfaceCard({
  children,
  style,
  muted = false,
}: SurfaceCardProps) {
  return (
    <View
      style={[
        styles.card,
        muted && styles.cardMuted,
        shadows.soft,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardMuted: {
    backgroundColor: palette.cardMuted,
  },
});
