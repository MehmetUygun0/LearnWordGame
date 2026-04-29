// @ts-nocheck
import React from 'react';
import * as ExpoRouter from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, spacing, typography } from '@/constants/theme';

export default function SettingsScreen() {
  const { router } = ExpoRouter;
  const { logout } = useAuth();

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

      <SurfaceCard>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceTitle}>Günlük yeni kelime</Text>
            <Text style={styles.preferenceText}>Şu an 6 kelime placeholder olarak ayarlı.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
        </View>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceTitle}>Günlük tekrar limiti</Text>
            <Text style={styles.preferenceText}>Bugün için 20 soru planlanıyor.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
        </View>
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.preferenceTitle}>Hesap</Text>
        <Text style={styles.preferenceText}>Çıkış, profil ve bildirim ayarları auth ve profil sprintlerinde netleşecek.</Text>
        <AppButton label="Çıkış" variant="ghost" onPress={handleLogout} />
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
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
