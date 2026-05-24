// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Alert, Animated, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AnimatedProgressBar } from '@/components/ui/AnimatedProgressBar';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { exportReportAsPdf } from '@/services/report-export';
import { getReportSummary, ReportSummary } from '@/services/report';

export default function ReportScreen() {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const nextSummary = await getReportSummary(user, token);
        setSummary(nextSummary);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [token, user]);

  const levelStats = summary?.levelStats ?? [];
  const maxWords = Math.max(...levelStats.map((item) => item.words), 1);
  const maxStageWords = Math.max(...(summary?.stageStats ?? []).map((item) => item.words), 1);
  const progress = (summary?.progressPercent ?? 0) / 100;
  const correctRate = summary?.correctRate ?? 0;

  const handleExport = async () => {
    if (!summary || isExporting) {
      return;
    }

    setIsExporting(true);
    setExportNotice('');

    try {
      const uri = await exportReportAsPdf(summary);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setExportNotice(`PDF hazırlandı: ${uri.split('/').pop() ?? 'rapor.pdf'}`);
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Rapor oluşturulamadı', 'PDF çıktısı hazırlanırken bir sorun oluştu. Lütfen tekrar dene.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScreenContainer scrollable withBackgroundDecor>
      <SectionHeader
        eyebrow="Rapor"
        title="İlerlemeni takip et"
        description="Stage dağılımı, haftalık trend ve zorlandığın kelimeler."
      />

      <View style={styles.statsRow}>
        <StatCard eyebrow="Öğrenilen" value={`${summary?.totalLearnedWords ?? 0}`} detail="kelime" accent="success" />
        <StatCard eyebrow="Başarı" value={`%${correctRate}`} detail="oran" accent="accent" />
      </View>

      {isLoading ? (
        <SurfaceCard muted style={styles.loadingCard}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.caption}>Rapor hazırlanıyor...</Text>
        </SurfaceCard>
      ) : (
        <>
          <SurfaceCard accent="primary" style={styles.progressCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Genel ilerleme</Text>
                <Text style={styles.caption}>Aktif seviye: {summary?.level ?? 'A1'}</Text>
              </View>
              <Text style={styles.percentText}>%{summary?.progressPercent ?? 0}</Text>
            </View>
            <AnimatedProgressBar progress={progress} color={palette.primary} />
          </SurfaceCard>

          <SurfaceCard>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>6 tekrar durumu</Text>
              <Text style={styles.caption}>Kelime sayısı</Text>
            </View>
            <Text style={styles.helperText}>Her sütun, kelimelerin 6 doğru tekrar yolunda kaçıncı aşamada olduğunu gösterir.</Text>
            <View style={styles.stageBars}>
              {(summary?.stageStats ?? []).map((item) => (
                <View key={item.stage} style={styles.stageColumn}>
                  <View style={styles.stageTrack}>
                    <AnimatedVerticalBar
                      progress={Math.max(item.words / maxStageWords, item.words ? 0.16 : 0.04)}
                      color={item.stage >= 6 ? palette.lime : item.stage >= 3 ? palette.accent : palette.primary}
                    />
                  </View>
                  <Text style={styles.stageLabel}>{item.stage}/6</Text>
                  <Text style={styles.stageValue}>{item.words}</Text>
                </View>
              ))}
            </View>
          </SurfaceCard>

          <SurfaceCard>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Son 7 gün</Text>
              <Text style={styles.caption}>Başarı trendi</Text>
            </View>
            <View style={styles.trendRow}>
              {(summary?.weeklyTrend ?? []).map((item) => (
                <View key={item.day} style={styles.trendColumn}>
                  <View style={styles.trendTrack}>
                    <AnimatedVerticalBar progress={item.correctRate / 100} color={palette.electric} rounded="md" />
                  </View>
                  <Text style={styles.trendLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </SurfaceCard>

          <SurfaceCard>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Seviye dağılımı</Text>
              <Text style={styles.caption}>Kelime sayısı</Text>
            </View>
            <View style={styles.chart}>
              {levelStats.map((item, index) => {
                const width = Math.max((item.words / maxWords) * 100, item.words ? 14 : 0);
                const barColor = index % 2 === 0 ? palette.primary : palette.electric;

                return (
                  <View key={`${item.level}-${index}`} style={styles.chartRow}>
                    <Text style={styles.chartLabel}>{item.level}</Text>
                    <View style={styles.chartTrack}>
                      <AnimatedHorizontalBar progress={width / 100} color={barColor} />
                    </View>
                    <Text style={styles.chartValue}>{item.words}</Text>
                  </View>
                );
              })}
            </View>
          </SurfaceCard>

          <SurfaceCard accent="secondary">
            <Text style={styles.sectionTitle}>Rozetler</Text>
            <View style={styles.badgeGrid}>
              <Badge icon="flame-outline" title="Seri Ustası" detail={`${summary?.reviewDueCount ?? 0} tekrar hazır`} />
              <Badge icon="trophy-outline" title="İlk 50" detail={`${summary?.totalLearnedWords ?? 0}/50 kelime`} />
              <Badge icon="grid-outline" title="Wordle Avcısı" detail="Günün kelimesini yakala" />
            </View>
          </SurfaceCard>

          <SurfaceCard muted>
            <Text style={styles.sectionTitle}>Zorlanılan kelimeler</Text>
            {(summary?.difficultWords ?? []).map((word) => (
              <View key={word.id} style={styles.difficultRow}>
                <Text style={styles.difficultWord}>{word.word}</Text>
                <Text style={styles.caption}>{word.wrongCount} yanlış • {word.stage}/6 tekrar</Text>
              </View>
            ))}
          </SurfaceCard>

          <SurfaceCard accent="secondary">
            <Text style={styles.sectionTitle}>Rapor çıktısı</Text>
            <Text style={styles.caption}>PDF formatında paylaşılabilir ve yazdırılabilir ilerleme özeti.</Text>
            {exportNotice ? <Text style={styles.noticeText}>{exportNotice}</Text> : null}
            <AppButton
              label={isExporting ? 'PDF hazırlanıyor' : 'PDF çıktısı hazırla'}
              icon="download-outline"
              loading={isExporting}
              disabled={!summary}
              onPress={handleExport}
            />
          </SurfaceCard>
        </>
      )}
    </ScreenContainer>
  );
}

function Badge({ icon, title, detail }) {
  return (
    <View style={styles.badgeItem}>
      <View style={styles.badgeIcon}>
        <Ionicons name={icon} size={18} color={palette.text} />
      </View>
      <Text style={styles.badgeTitle}>{title}</Text>
      <Text style={styles.badgeDetail}>{detail}</Text>
    </View>
  );
}

function AnimatedVerticalBar({ progress, color, rounded = 'pill' }) {
  const height = useRef(new Animated.Value(0)).current;
  const safeProgress = Math.max(0, Math.min(progress, 1));

  useEffect(() => {
    Animated.spring(height, {
      toValue: safeProgress,
      friction: 8,
      tension: 55,
      useNativeDriver: false,
    }).start();
  }, [height, safeProgress]);

  return (
    <Animated.View
      style={[
        styles.stageFill,
        rounded === 'md' && styles.stageFillMd,
        {
          backgroundColor: color,
          height: height.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        },
      ]}
    />
  );
}

function AnimatedHorizontalBar({ progress, color }) {
  const width = useRef(new Animated.Value(0)).current;
  const safeProgress = Math.max(0, Math.min(progress, 1));

  useEffect(() => {
    Animated.spring(width, {
      toValue: safeProgress,
      friction: 8,
      tension: 55,
      useNativeDriver: false,
    }).start();
  }, [safeProgress, width]);

  return (
    <Animated.View
      style={[
        styles.chartFill,
        {
          backgroundColor: color,
          width: width.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  loadingCard: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  progressCard: {
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  percentText: {
    ...typography.title,
    color: palette.primary,
  },
  stageBars: {
    height: 164,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  stageColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  stageTrack: {
    height: 112,
    width: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.backgroundElevated,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  stageFill: {
    width: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.accent,
  },
  stageFillMd: {
    borderRadius: radius.md,
  },
  stageLabel: {
    ...typography.caption,
    color: palette.textMuted,
    fontSize: 10,
  },
  stageValue: {
    ...typography.label,
    color: palette.text,
  },
  helperText: {
    ...typography.caption,
    color: palette.textFaint,
  },
  trendRow: {
    height: 138,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  trendColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  trendTrack: {
    height: 106,
    width: '100%',
    borderRadius: radius.md,
    backgroundColor: palette.backgroundElevated,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  trendFill: {
    width: '100%',
    borderRadius: radius.md,
    backgroundColor: palette.primary,
  },
  trendLabel: {
    ...typography.caption,
    color: palette.textMuted,
    fontSize: 10,
  },
  chart: {
    gap: spacing.md,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chartLabel: {
    ...typography.label,
    width: 34,
    color: palette.text,
  },
  chartTrack: {
    flex: 1,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: palette.backgroundElevated,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  chartFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  chartValue: {
    ...typography.caption,
    width: 34,
    color: palette.textMuted,
    textAlign: 'right',
  },
  difficultRow: {
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    padding: spacing.md,
    gap: 2,
  },
  badgeGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badgeItem: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  badgeIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    ...typography.label,
    color: palette.text,
  },
  badgeDetail: {
    ...typography.caption,
    color: palette.textMuted,
    fontSize: 10,
  },
  difficultWord: {
    ...typography.label,
    color: palette.text,
  },
  caption: {
    ...typography.caption,
    color: palette.textMuted,
  },
  noticeText: {
    ...typography.caption,
    color: palette.accent,
  },
});
