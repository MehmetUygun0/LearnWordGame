// @ts-nocheck
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatCard } from '@/components/ui/StatCard';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

export default function ReportScreen() {
  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Report</Text>
        <Text style={styles.title}>İlerlemenene göz at.</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard eyebrow="Ogrenilen" value="42 kelime" />
        <StatCard eyebrow="Tamamlanan seri" value="6 tekrar" accent="secondary" />
      </View>

      <View style={[styles.chartCard, shadows.soft]}>
        <Text style={styles.sectionTitle}>Haftalık trend</Text>
        <View style={styles.barsRow}>
          {[44, 68, 52, 80, 64, 92, 70].map((height, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={[styles.bar, { height }]} />
            </View>
          ))}
        </View>
        <Text style={styles.caption}>Gerçek istatistikler backend rapor endpoint&apos;lerinden beslenecek.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...typography.label,
    color: palette.secondary,
  },
  title: {
    ...typography.display,
    color: palette.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  chartCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  barsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
    height: 112,
  },
  barColumn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: radius.sm,
    backgroundColor: palette.primary,
  },
  caption: {
    ...typography.caption,
    color: palette.textMuted,
  },
});
