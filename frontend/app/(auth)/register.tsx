// @ts-nocheck
import React from 'react';
import * as ExpoRouter from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

export default function RegisterScreen() {
  const { router } = ExpoRouter;

  return (
    <ScreenContainer scrollable contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Yeni uye</Text>
        <Text style={styles.title}>Kelimelerini takip edecek kisisel alanini olustur.</Text>
      </View>

      <View style={[styles.card, shadows.soft]}>
        <AppInput label="Kullanici adi" placeholder="bir kullanici adi sec" />
        <AppInput label="E-posta" placeholder="mail@ornek.com" />
        <AppInput label="Sifre" placeholder="guclu bir sifre" secureTextEntry />
        <AppButton label="Kayit Ol" onPress={() => router.replace('/(app)/home')} />
      </View>

      <View style={styles.footerLinks}>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.link}>Zaten hesabin var mi? Giris yap</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  hero: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  kicker: {
    ...typography.label,
    color: palette.secondary,
  },
  title: {
    ...typography.display,
    color: palette.text,
  },
  card: {
    backgroundColor: palette.card,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  footerLinks: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  link: {
    ...typography.label,
    color: palette.primary,
  },
});
