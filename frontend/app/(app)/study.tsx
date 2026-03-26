// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

export default function StudyScreen() {
  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Study Session</Text>
        <Text style={styles.title}>Soru karti placeholder</Text>
      </View>

      <View style={[styles.card, shadows.soft]}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sira 4 / 20</Text>
          </View>
          <Ionicons name="volume-high-outline" size={20} color={palette.textMuted} />
        </View>
        <Text style={styles.word}>abandon</Text>
        <Text style={styles.hint}>Bu alanda gorsel, ornek cumle ve tekrar asamasi bilgisi gosterilecek.</Text>
        <AppInput label="Cevabin" placeholder="Turkce karsiligini yaz" />
        <AppButton label="Cevabi Gonder" />
      </View>

      <View style={[styles.progressCard, shadows.soft]}>
        <Text style={styles.progressTitle}>Oturum akisi</Text>
        <Text style={styles.progressText}>Yeni kelime, tekrar kelimesi ve dogru-yanlis feedback bloklari Sprint 2&apos;de bu ekranin icine gelecek.</Text>
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
  card: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(110, 168, 254, 0.16)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  badgeText: {
    ...typography.caption,
    color: palette.primary,
  },
  word: {
    ...typography.display,
    color: palette.text,
    textTransform: 'lowercase',
  },
  hint: {
    ...typography.body,
    color: palette.textMuted,
  },
  progressCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.cardMuted,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  progressTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  progressText: {
    ...typography.body,
    color: palette.textMuted,
  },
});
