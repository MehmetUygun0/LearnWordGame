// @ts-nocheck
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoRouter from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';

export default function HomeScreen() {
  const { router } = ExpoRouter;
  const { user } = useAuth();
  const initials = user?.userName?.slice(0, 2).toUpperCase() || 'OU';

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <SectionHeader
          eyebrow="Ana ekran"
          title={`Hoş geldin${user?.userName ? `, ${user.userName}` : ''}.`}
          description="Günlük tekrar, yeni kart ve çalışma akışı bu merkezden başlayacak."
        />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard eyebrow="Bugünkü tekrar" value="18 kelime" />
        <StatCard eyebrow="Yeni kart" value="6 kelime" accent="secondary" />
      </View>

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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı özet</Text>
        <SurfaceCard style={styles.summaryCard} muted>
          <Text style={styles.summaryLabel}>Başarı oranı</Text>
          <Text style={styles.summaryValue}>%72</Text>
          <Text style={styles.summaryText}>Gerçek veriler rapor sprintinde backend tarafından doldurulacak.</Text>
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
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: palette.secondarySoft,
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
