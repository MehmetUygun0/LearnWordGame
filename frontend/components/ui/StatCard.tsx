// @ts-nocheck
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';

type StatCardProps = {
  eyebrow: string;
  value: string;
  detail?: string;
  accent?: 'primary' | 'secondary' | 'accent' | 'success' | 'electric';
};

export function StatCard({
  eyebrow,
  value,
  detail,
  accent = 'primary',
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.glow, glowStyles[accent]]} />
      <View style={[styles.marker, markerStyles[accent]]} />
      <Text style={styles.eyebrow} numberOfLines={1}>{eyebrow}</Text>
      <Text style={styles.value} numberOfLines={2}>{value}</Text>
      {detail ? <Text style={styles.detail} numberOfLines={2}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 108,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    gap: spacing.xs,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -20,
    right: -18,
    width: 72,
    height: 72,
    borderRadius: 24,
    opacity: 0.18,
    transform: [{ rotate: '18deg' }],
  },
  marker: {
    width: 34,
    height: 5,
    borderRadius: radius.pill,
    marginBottom: 2,
  },
  eyebrow: {
    ...typography.caption,
    color: palette.textFaint,
  },
  value: {
    ...typography.cardTitle,
    color: palette.text,
  },
  detail: {
    ...typography.caption,
    color: palette.textMuted,
  },
});

const markerStyles = StyleSheet.create({
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.secondary,
  },
  accent: {
    backgroundColor: palette.accent,
  },
  success: {
    backgroundColor: palette.success,
  },
  electric: {
    backgroundColor: palette.electric,
  },
});

const glowStyles = StyleSheet.create({
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.secondary,
  },
  accent: {
    backgroundColor: palette.accent,
  },
  success: {
    backgroundColor: palette.success,
  },
  electric: {
    backgroundColor: palette.electric,
  },
});
