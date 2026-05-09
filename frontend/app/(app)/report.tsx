// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
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
  const [printMessage, setPrintMessage] = useState('');

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
        description="Çözülen kelimeler, seviye dağılımı ve çıktı alma akışı burada toplanır."
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
        <Text style={styles.profileLine}>
          Kayıt tarihi: {summary?.createdAt ? new Date(summary.createdAt).toLocaleDateString('tr-TR') : '-'}
        </Text>
        <Text style={styles.profileLine}>Günlük hedef: {summary?.dailyNewWords ?? 0} kelime</Text>
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.sectionTitle}>Çıktı</Text>
        <Text style={styles.caption}>
          Rapor ekranı kağıt çıktısı senaryosu için hazır. Backend rapor endpointleri eklendiğinde doğruluk oranı ve oturum geçmişi de aynı çıktıya dahil edilebilir.
        </Text>
        {printMessage ? <Text style={styles.successText}>{printMessage}</Text> : null}
        <AppButton
          label="Rapor çıktısı al"
          variant="secondary"
          onPress={() =>
            setPrintMessage(
              Platform.OS === 'web'
                ? 'Tarayıcı yazdırma penceresi açılmaya hazır.'
                : 'Mobil çıktı akışı için rapor hazırlandı.'
            )
          }
        />
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
  successText: {
    ...typography.caption,
    color: palette.success,
  },
  profileLine: {
    ...typography.body,
    color: palette.textMuted,
  },
});
