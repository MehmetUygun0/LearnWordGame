// @ts-nocheck
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoRouter from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatCard } from '@/components/ui/StatCard';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

export default function HomeScreen() {
  const { router } = ExpoRouter;

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Dashboard</Text>
          <Text style={styles.title}>Bugunku tempoyu buradan yonet.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>OU</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard eyebrow="Bugunku tekrar" value="18 kelime" />
        <StatCard eyebrow="Yeni kart" value="6 kelime" accent="secondary" />
      </View>

      <View style={[styles.featureCard, shadows.soft]}>
        <View style={styles.featureIcon}>
          <Ionicons name="sparkles-outline" size={22} color={palette.secondary} />
        </View>
        <Text style={styles.featureTitle}>Sprint 1 hedefi</Text>
        <Text style={styles.featureText}>
          Bu ekran artik karanlik tema, rounded kartlar ve tek tasarim diliyle home hissi veriyor.
        </Text>
        <AppButton label="Study ekranina gec" onPress={() => router.push('/(app)/study')} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hizli ozet</Text>
        <View style={[styles.summaryCard, shadows.soft]}>
          <Text style={styles.summaryLabel}>Basari orani</Text>
          <Text style={styles.summaryValue}>%72</Text>
          <Text style={styles.summaryText}>Gercek veriler report sprintinde backend tarafindan doldurulacak.</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  eyebrow: {
    ...typography.label,
    color: palette.secondary,
  },
  title: {
    ...typography.display,
    color: palette.text,
    marginTop: spacing.xs,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: palette.cardMuted,
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
  featureCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(94, 234, 212, 0.14)',
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
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
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
