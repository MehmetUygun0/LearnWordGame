// @ts-nocheck
import React, { useState } from 'react';
import * as ExpoRouter from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { palette, spacing, typography } from '@/constants/theme';
import { forgotPasswordRequest } from '@/services/auth';

export default function ForgotPasswordScreen() {
  const { router } = ExpoRouter;
  const [identity, setIdentity] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async () => {
    const trimmedIdentity = identity.trim();

    if (!trimmedIdentity) {
      setError('E-posta veya kullanıcı adı zorunlu.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const result = await forgotPasswordRequest({ identity: trimmedIdentity });
      Alert.alert('Bilgi', result.message);
      setIdentity('');
    } catch (requestError) {
      Alert.alert(
        'İstek başarısız',
        requestError instanceof Error
          ? requestError.message
          : 'Şifre sıfırlama isteği gönderilemedi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <SectionHeader
        eyebrow="Erişimi yenile"
        title="Şifre sıfırlama akışını burada başlat."
        description="Kullanıcı adı veya e-posta ile sıfırlama kodu iste, ardından yeni şifre ekranında kodunu doğrula."
      />

      <SurfaceCard>
        <AppInput
          label="E-posta veya kullanıcı adı"
          placeholder="mail@ornek.com"
          value={identity}
          onChangeText={setIdentity}
          error={error}
        />
        <AppButton
          label="Sıfırlama bağlantısı gönder"
          onPress={handleForgotPassword}
          loading={isSubmitting}
        />
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.noteTitle}>Akış özeti</Text>
        <Text style={styles.noteText}>1. Kullanıcı adı veya e-posta girilir.</Text>
        <Text style={styles.noteText}>2. Backend sıfırlama kodunu e-posta ile yollar.</Text>
        <Text style={styles.noteText}>3. Kullanıcı bir sonraki ekranda kod ve yeni şifreyi gönderir.</Text>
      </SurfaceCard>

      <View style={styles.links}>
        <Pressable onPress={() => router.push('/(auth)/reset-password')}>
          <Text style={styles.link}>Kodum var, şifremi yenile</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.linkMuted}>Giriş ekranına dön</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  noteTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  noteText: {
    ...typography.body,
    color: palette.textMuted,
  },
  links: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  link: {
    ...typography.label,
    color: palette.primary,
    textAlign: 'center',
  },
  linkMuted: {
    ...typography.label,
    color: palette.textFaint,
    textAlign: 'center',
  },
});
