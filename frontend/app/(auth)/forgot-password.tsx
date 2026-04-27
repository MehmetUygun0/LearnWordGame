// @ts-nocheck
import React, { useState } from 'react';
import * as ExpoRouter from 'expo-router';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { palette, typography } from '@/constants/theme';
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
        description="Bu ekran gerçek forgot-password endpoint'i geldiğinde doğrudan backend'e bağlanacak."
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

      <Pressable onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.link}>Giriş ekranına dön</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  link: {
    ...typography.label,
    color: palette.primary,
    textAlign: 'center',
  },
});
