// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoRouter from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { DashboardSummary, getDashboardSummary } from '@/services/dashboard';

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

  const initials = summary?.initials ?? 'OU';

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <SectionHeader
          eyebrow="Ana ekran"
          title={`Hoş geldin${summary?.userName ? `, ${summary.userName}` : ''}.`}
          description="Günlük tekrar, yeni kart ve çalışma akışı bu merkezden başlayacak."
        />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      {isLoading ? (
        <SurfaceCard muted style={styles.loadingCard}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.loadingText}>Ana ekran özeti hazırlanıyor...</Text>
        </SurfaceCard>
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatCard eyebrow="Öğrenilen" value={`${summary?.learnedWords ?? 0} kelime`} />
            <StatCard
              eyebrow="Günlük yeni kelime"
              value={`${summary?.dailyNewWords ?? 0} kelime`}
              accent="secondary"
            />
          </View>

          <SurfaceCard muted>
            <Text style={styles.summaryLabel}>Bugünkü akış</Text>
            <Text style={styles.summaryText}>
              Bu seviyede havuzda {summary?.levelLibraryCount ?? 0} kelime var. Çalışma ekranı bugün yaklaşık {summary?.todayEstimatedCount ?? 0} kart gösterecek şekilde hazırlandı.
            </Text>
          </SurfaceCard>
        </>
      )}

      <SurfaceCard>
        <View style={styles.featureIcon}>
          <Ionicons name="sparkles-outline" size={22} color={palette.secondary} />
        </View>
        <Text style={styles.featureTitle}>Kelime havuzu</Text>
        <Text style={styles.featureText}>
          Veritabanındaki kelimeler seviye bazlı olarak listelenecek. Buradan doğrudan kelime havuzuna geçebilirsin.
        </Text>
        <AppButton label="Kelime havuzunu aç" onPress={() => router.push('/(app)/words')} />
      </SurfaceCard>

      <SurfaceCard muted>
        <View style={styles.featureIconSecondary}>
          <Ionicons name="flash-outline" size={22} color={palette.text} />
        </View>
        <Text style={styles.featureTitle}>Bugünkü çalışma</Text>
        <Text style={styles.featureText}>
          Study endpointi henüz backendde yok. Buna rağmen ekran akışı hazır; mevcut seviyene göre örnek oturumu açabilirsin.
        </Text>
        <AppButton
          label="Çalışma ekranına git"
          variant="secondary"
          onPress={() => router.push('/(app)/study')}
        />
      </SurfaceCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı özet</Text>
        <SurfaceCard style={styles.summaryCard} muted>
          <Text style={styles.summaryLabel}>Mevcut seviye</Text>
          <Text style={styles.summaryValue}>{summary?.level ?? 'A1'}</Text>
          <Text style={styles.summaryText}>Bu veri backend profil endpointinden okunuyor.</Text>
        </SurfaceCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: palette.primarySoft,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.label,
    color: palette.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  loadingCard: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.body,
    color: palette.textMuted,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: palette.secondarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconSecondary: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    ...typography.title,
    color: palette.text,
  },
  featureText: {
    ...typography.body,
    color: palette.textMuted,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  summaryCard: {
    gap: spacing.xs,
  },
  summaryLabel: {
    ...typography.label,
    color: palette.textMuted,
  },
  summaryValue: {
    ...typography.display,
    color: palette.text,
  },
  summaryText: {
    ...typography.body,
    color: palette.textMuted,
  },
});
