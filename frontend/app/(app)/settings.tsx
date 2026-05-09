// @ts-nocheck
import React, { useEffect, useState } from 'react';
import * as ExpoRouter from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, spacing, typography } from '@/constants/theme';
import { getSettingsSummary, SettingsSummary } from '@/services/settings';

export default function SettingsScreen() {
  const { router } = ExpoRouter;
  const { logout, user } = useAuth();
  const [summary, setSummary] = useState<SettingsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const nextSummary = await getSettingsSummary(user);
        setSummary(nextSummary);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Ayarlar"
        title="Günün ritmini ve tercihlerini ayarla."
        description="Bu ekran günlük yeni kelime sayısı ve soru limitleri için temel yüzeyi hazırlıyor."
      />

      {isLoading ? (
        <SurfaceCard muted style={styles.loadingCard}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.preferenceText}>Ayar özeti hazırlanıyor...</Text>
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceTitle}>Günlük yeni kelime</Text>
            <Text style={styles.preferenceText}>
              Profil ayarına göre şu an {summary?.dailyNewWords ?? 0} kelime planlanıyor.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
        </View>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceTitle}>Kullanıcı seviyesi</Text>
            <Text style={styles.preferenceText}>{summary?.level ?? 'A1'} seviyesinde içerik gösteriliyor.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
        </View>
        <View style={styles.preferenceRowLast}>
          <View>
            <Text style={styles.preferenceTitle}>Toplam öğrenilen</Text>
            <Text style={styles.preferenceText}>{summary?.totalLearnedWords ?? 0} kelime tamamlandı.</Text>
          </View>
          <Ionicons name="checkmark-circle-outline" size={20} color={palette.textMuted} />
        </View>
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.preferenceTitle}>Hesap</Text>
        <Text style={styles.preferenceText}>
          Bu ekran şu an backend profil verisini yalnızca gösteriyor. Ayar güncelleme endpoint’i geldiğinde düzenleme açılacak.
        </Text>
        <AppButton label="Çıkış" variant="ghost" onPress={handleLogout} />
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.preferenceTitle}>Story durumu</Text>
        <Text style={styles.preferenceText}>
          Story 4 tarafında bu ekranın tasarımı hazır. Backendde ayar güncelleme endpointi gelince günlük yeni kelime ve seviye tercihleri kaydedilebilir hale gelecek.
        </Text>
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  preferenceRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  preferenceTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  preferenceText: {
    ...typography.body,
    color: palette.textMuted,
    marginTop: 4,
  },
});
