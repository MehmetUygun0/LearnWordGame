// @ts-nocheck
import React from 'react';
import * as ExpoRouter from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

export default function LoginScreen() {
  const { router } = ExpoRouter;

  return (
    <ScreenContainer scrollable contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>LearnWordGame</Text>
        <Text style={styles.title}>6 tekrar mantigiyla akilli kelime calisma.</Text>
        <Text style={styles.description}>
          Giris akisini bu sprintte oturtuyoruz. Sonraki sprintte bu ekran gercek auth servisine baglanacak.
        </Text>
      </View>

      <View style={[styles.card, shadows.soft]}>
        <AppInput label="Kullanici adi" placeholder="oguzhanuyar" />
        <AppInput label="Sifre" placeholder="••••••••" secureTextEntry />
        <AppButton label="Giris Yap" onPress={() => router.replace('/(app)/home')} />
        <AppButton label="Demo olarak iceri gir" variant="secondary" onPress={() => router.replace('/(app)/home')} />
      </View>

      <View style={styles.footerLinks}>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.link}>Hesabin yok mu? Kayit ol</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.linkMuted}>Sifremi unuttum</Text>
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
  footerLinks: {
    gap: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  link: {
    ...typography.label,
    color: palette.primary,
  },
  linkMuted: {
    ...typography.label,
    color: palette.textMuted,
  },
});
