// @ts-nocheck
import React from 'react';
import * as ExpoRouter from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const { router } = ExpoRouter;

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Erisim yenile</Text>
        <Text style={styles.title}>Sifre sifirlama akisinin placeholder ekrani.</Text>
        <Text style={styles.description}>
          Gercek e-posta veya kullanici adi tabanli reset mantigi auth sprintinde baglanacak.
        </Text>
      </View>

      <View style={[styles.card, shadows.soft]}>
        <AppInput label="E-posta veya kullanici adi" placeholder="mail@ornek.com" />
        <AppButton label="Sifirla linki gonder" />
      </View>

      <Pressable onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.link}>Giris ekranina don</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  hero: {
    gap: spacing.sm,
  },
  kicker: {
    ...typography.label,
    color: palette.secondary,
  },
  title: {
    ...typography.display,
    color: palette.text,
  },
  description: {
    ...typography.body,
    color: palette.textMuted,
  },
  card: {
    backgroundColor: palette.card,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  link: {
    ...typography.label,
    color: palette.primary,
    textAlign: 'center',
  },
});
