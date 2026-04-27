// @ts-nocheck
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

type StatCardProps = {
  eyebrow: string;
  value: string;
  accent?: 'primary' | 'secondary';
};

export function StatCard({
  eyebrow,
  value,
  accent = 'primary',
}: StatCardProps) {
  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={[styles.badge, accent === 'secondary' && styles.badgeSecondary]}>
        <Text style={styles.badgeText}>{eyebrow}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 116,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: palette.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  badgeSecondary: {
    backgroundColor: palette.secondarySoft,
  },
  badgeText: {
    ...typography.caption,
    color: palette.text,
  },
  value: {
    ...typography.title,
    color: palette.text,
  },
});
