// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoRouter from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { AnimatedProgressBar } from '@/components/ui/AnimatedProgressBar';
import { PulseIcon } from '@/components/ui/PulseIcon';
import { ProgressMeter } from '@/components/ui/ProgressMeter';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { DashboardSummary, getDashboardSummary } from '@/services/dashboard';

const pixelAvatar = require('../../assets/images/pixel-profile-avatar.png');

export default function HomeScreen() {
  const { router } = ExpoRouter;
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const nextSummary = await getDashboardSummary(user);
        setSummary(nextSummary);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [user]);

  const firstName = summary?.userName?.split(' ')[0] || summary?.userName || 'Merhaba';
  const progress = (summary?.progressPercent ?? 0) / 100;

  return (
    <ScreenContainer scrollable withBackgroundDecor>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>Daily drop</Text>
          <Text style={styles.greeting}>Hoş geldin, {firstName}</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(app)/settings')}
          style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}>
          <Image source={pixelAvatar} style={styles.avatarImage} resizeMode="cover" />
        </Pressable>
      </View>

      <AnimatedCard>
      <SurfaceCard style={styles.hero} accent="primary">
        {isLoading ? (
          <View style={styles.loadingInline}>
            <ActivityIndicator color={palette.text} />
            <Text style={styles.mutedText}>Günlük plan hazırlanıyor...</Text>
          </View>
        ) : (
          <>
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon}>
                <PulseIcon>
                  <Ionicons name="flame-outline" size={24} color={palette.text} />
                </PulseIcon>
              </View>
              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroTitle}>{summary?.challengeTitle ?? 'Bugünkü hedefin hazır'}</Text>
                <Text style={styles.heroText}>
                  {summary?.streakDays ?? 0} günlük streak yanıyor. {summary?.todayEstimatedCount ?? 0} kartla bugünü kapat.
                </Text>
              </View>
            </View>

            <View style={styles.heroMetrics}>
              <View>
                <AnimatedNumber value={summary?.dailyNewWords ?? 0} style={styles.metricValue} />
                <Text style={styles.metricLabel}>Yeni kelime</Text>
              </View>
              <View style={styles.metricDivider} />
              <View>
                <AnimatedNumber value={summary?.reviewWordCount ?? 0} style={styles.metricValue} />
                <Text style={styles.metricLabel}>Tekrar</Text>
              </View>
              <View style={styles.metricDivider} />
              <View>
                <AnimatedNumber value={summary?.xp ?? 0} style={styles.metricValue} />
                <Text style={styles.metricLabel}>XP</Text>
              </View>
            </View>

            <AppButton
              label="Çalışmaya başla"
              icon="flash-outline"
              onPress={() => router.push('/(app)/study')}
            />
          </>
        )}
      </SurfaceCard>
      </AnimatedCard>

      <AnimatedCard delay={80}>
      <View style={styles.statsRow}>
        <StatCard
          eyebrow="Öğrenilen"
          value={`${summary?.learnedWords ?? 0}`}
          detail="kelime"
          accent="success"
        />
        <StatCard
          eyebrow="Seri"
          value={`${summary?.streakDays ?? 0}`}
          detail="gün"
          accent="electric"
        />
      </View>
      </AnimatedCard>

      <AnimatedCard delay={140}>
      <SurfaceCard muted>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seviye ilerlemesi</Text>
          <Text style={styles.percentText}>%{summary?.progressPercent ?? 0}</Text>
        </View>
        <ProgressMeter progress={progress} />
        <Text style={styles.mutedText}>Düzenli tekrar yaptıkça bu seviye tamamlanmaya yaklaşır.</Text>
      </SurfaceCard>
      </AnimatedCard>

      <AnimatedCard delay={190}>
      <SurfaceCard accent="secondary">
          <View style={styles.badgeRow}>
            <View style={styles.challengeIcon}>
              <Ionicons name="trophy-outline" size={22} color={palette.background} />
            </View>
          <View style={styles.heroTitleBlock}>
            <Text style={styles.actionTitle}>Rozet hedefi</Text>
            <Text style={styles.actionText}>3 doğru cevap daha al, “Seri Ustası” rozetini aç.</Text>
          </View>
        </View>
        <AnimatedProgressBar progress={0.68} />
      </SurfaceCard>
      </AnimatedCard>

      <View style={styles.actionGrid}>
        <SurfaceCard style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Ionicons name="add-circle-outline" size={21} color={palette.secondary} />
          </View>
          <Text style={styles.actionTitle}>Kelime ekle</Text>
          <Text style={styles.actionText}>Kendi çalışma havuzunu büyüt.</Text>
          <AppButton
            label="Kelime yönetimi"
            variant="secondary"
            icon="add-circle-outline"
            onPress={() => router.push('/(app)/words')}
          />
        </SurfaceCard>

        <SurfaceCard style={styles.actionCard}>
          <View style={styles.actionIconElectric}>
            <Ionicons name="game-controller-outline" size={21} color={palette.electric} />
          </View>
          <Text style={styles.actionTitle}>Mini oyunlar</Text>
          <Text style={styles.actionText}>Wordle ve hikaye modu ile kelimeleri canlı tut.</Text>
          <View style={styles.splitActions}>
            <AppButton
              label="Wordle"
              variant="secondary"
              icon="grid-outline"
              onPress={() => router.push('/(app)/wordle')}
            />
            <AppButton
              label="Word Chain"
              variant="ghost"
              icon="sparkles-outline"
              onPress={() => router.push('/(app)/story-lab')}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.actionCard}>
          <View style={styles.actionIconAccent}>
            <Ionicons name="stats-chart-outline" size={21} color={palette.accent} />
          </View>
          <Text style={styles.actionTitle}>İlerlemeyi gör</Text>
          <Text style={styles.actionText}>Seviye dağılımını ve hedeflerini incele.</Text>
          <AppButton
            label="Raporu aç"
            variant="ghost"
            icon="stats-chart-outline"
            onPress={() => router.push('/(app)/report')}
          />
        </SurfaceCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  eyebrow: {
    ...typography.label,
    color: palette.secondary,
    textTransform: 'uppercase',
  },
  greeting: {
    ...typography.display,
    color: palette.text,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.96 }],
  },
  hero: {
    gap: spacing.lg,
  },
  loadingInline: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  heroHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.electric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitleBlock: {
    flex: 1,
  },
  heroTitle: {
    ...typography.title,
    color: palette.text,
  },
  heroText: {
    ...typography.body,
    color: palette.textMuted,
  },
  heroMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.md,
  },
  metricValue: {
    ...typography.title,
    color: palette.text,
  },
  metricLabel: {
    ...typography.caption,
    color: palette.textFaint,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: palette.borderSoft,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  percentText: {
    ...typography.label,
    color: palette.accent,
  },
  mutedText: {
    ...typography.body,
    color: palette.textMuted,
  },
  actionGrid: {
    gap: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.secondary,
    shadowColor: palette.secondary,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCard: {
    gap: spacing.sm,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: palette.secondarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconAccent: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconElectric: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: palette.electricSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitActions: {
    gap: spacing.sm,
  },
  actionTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  actionText: {
    ...typography.body,
    color: palette.textMuted,
  },
});
