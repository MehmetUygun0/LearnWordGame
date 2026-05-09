// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { getReportSummary, ReportSummary } from '@/services/report';

export default function ReportScreen() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const nextSummary = await getReportSummary(user);
        setSummary(nextSummary);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [user]);

  const levelStats = summary?.levelStats ?? [];
  const maxWords = Math.max(...levelStats.map((item) => item.words), 1);

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Rapor"
        title="İlerlemenin genel görünümüne göz at."
        description="Bu ekran doğrudan profil verisinden besleniyor. Seviye kırılımı backend tarafından dönüyor."
      />

      <View style={styles.statsRow}>
        <StatCard eyebrow="Öğrenilen" value={`${summary?.totalLearnedWords ?? 0} kelime`} />
        <StatCard eyebrow="Seviye" value={summary?.level ?? 'A1'} accent="secondary" />
      </View>

      {isLoading ? (
        <SurfaceCard muted style={styles.loadingCard}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.caption}>Rapor verisi hazırlanıyor...</Text>
        </SurfaceCard>
      ) : (
        <SurfaceCard style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Seviye dağılımı</Text>
          <View style={styles.barsRow}>
            {levelStats.map((item) => (
              <View key={item.level} style={styles.barColumn}>
                <View style={[styles.bar, { height: Math.max((item.words / maxWords) * 112, 18) }]} />
                <Text style={styles.barLabel}>{item.level}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.caption}>Sütunlar, her seviyede öğrenilmiş kelime sayısını gösterir.</Text>
        </SurfaceCard>
      )}

      <SurfaceCard muted>
        <Text style={styles.sectionTitle}>Profil özeti</Text>
        <Text style={styles.profileLine}>Kullanıcı: {summary?.userName ?? '-'}</Text>
        <Text style={styles.profileLine}>Kayıt tarihi: {summary?.createdAt ? new Date(summary.createdAt).toLocaleDateString('tr-TR') : '-'}</Text>
        <Text style={styles.profileLine}>Günlük hedef: {summary?.dailyNewWords ?? 0} kelime</Text>
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.sectionTitle}>Rapor notu</Text>
        <Text style={styles.caption}>
          Bu ekran şu an yalnızca profil endpointinden dönen verileri kullanıyor. Doğruluk oranı, bekleyen tekrar sayısı ve oturum geçmişi için ayrı rapor endpointleri gerektiğinde bu kart genişletilecek.
        </Text>
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
  loadingCard: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
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
    gap: spacing.xs,
  },
  bar: {
    width: '100%',
    borderRadius: radius.sm,
    backgroundColor: palette.primary,
  },
  barLabel: {
    ...typography.caption,
    color: palette.textMuted,
    textAlign: 'center',
  },
  caption: {
    ...typography.caption,
    color: palette.textMuted,
  },
  profileLine: {
    ...typography.body,
    color: palette.textMuted,
  },
});
