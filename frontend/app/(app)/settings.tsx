// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

export default function SettingsScreen() {
  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Settings</Text>
        <Text style={styles.title}>Gunun ritmini ve tercihlerini ayarla.</Text>
      </View>

      <View style={[styles.preferenceCard, shadows.soft]}>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceTitle}>Gunluk yeni kelime</Text>
            <Text style={styles.preferenceText}>Su an 6 kelime placeholder olarak ayarli.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
        </View>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceTitle}>Gunluk tekrar limiti</Text>
            <Text style={styles.preferenceText}>Bugun icin 20 soru planlaniyor.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
        </View>
      </View>

      <View style={[styles.preferenceCard, shadows.soft]}>
        <Text style={styles.preferenceTitle}>Hesap</Text>
        <Text style={styles.preferenceText}>Cikis, profil ve bildirim ayarlari auth/profile sprintlerinde netlesecek.</Text>
        <AppButton label="Cikis" variant="ghost" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...typography.label,
    color: palette.secondary,
  },
  title: {
    ...typography.display,
    color: palette.text,
  },
  preferenceCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.md,
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
