// @ts-nocheck
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { palette, radius, spacing, typography } from '@/constants/theme';

export default function ReportScreen() {
  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Rapor"
        title="İlerlemenin genel görünümüne göz at."
        description="Gerçek istatistikler bağlandığında bu ekran öğrenme performansını anlamak için ana merkez olacak."
      />

      <View style={styles.statsRow}>
        <StatCard eyebrow="Öğrenilen" value={`${realStats.learnedCount} kelime`}/>
        <StatCard eyebrow="Tamamlanan seri" value={`${realStats.totalCount} adet`} accent="secondary" />
      </View>

      <SurfaceCard style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Haftalık trend</Text>
        <View style={styles.barsRow}>
          {[44, 68, 52, 80, 64, 92, 70].map((height, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={[styles.bar, { height }]} />
            </View>
          ))}
        </View>
        <Text style={styles.caption}>Gerçek istatistikler backend rapor endpoint&apos;lerinden beslenecek.</Text>
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  chartCard: {
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
