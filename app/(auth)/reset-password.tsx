// @ts-nocheck
import React, { useState } from 'react';
import * as ExpoRouter from 'expo-router';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { palette, spacing, typography } from '@/constants/theme';
import { resetPasswordRequest } from '@/services/auth';

export default function ResetPasswordScreen() {
  const { router } = ExpoRouter;
  const [identity, setIdentity] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({
    identity: '',
    code: '',
    newPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async () => {
    const nextErrors = {
      identity: identity.trim() ? '' : 'Kullanıcı adı veya e-posta zorunlu.',
      code: /^\d{6}$/.test(code.trim()) ? '' : '6 haneli kod gir.',
      newPassword:
        newPassword.trim().length >= 6 ? '' : 'Yeni şifre en az 6 karakter olmalı.',
    };

    setErrors(nextErrors);

    if (nextErrors.identity || nextErrors.code || nextErrors.newPassword) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPasswordRequest({
        userNameOrEmail: identity,
        code,
        newPassword,
      });

      Alert.alert('Başarılı', result.message, [
        {
          text: 'Girişe dön',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Şifre güncellenemedi',
        error instanceof Error ? error.message : 'Bir sorun oluştu.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable withBackgroundDecor contentStyle={styles.content}>
      <SectionHeader
        eyebrow="Şifre yenile"
        title="Yeni şifreni oluştur."
        description="Mailine gelen 6 haneli kodu gir ve hesabına tekrar eriş."
      />

      <SurfaceCard accent="primary">
        <AppInput
          label="Kullanıcı adı veya e-posta"
          placeholder="mail@ornek.com"
          value={identity}
          onChangeText={setIdentity}
          error={errors.identity}
        />
        <AppInput
          label="Sıfırlama kodu"
          placeholder="123456"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          error={errors.code}
        />
        <AppInput
          label="Yeni şifre"
          placeholder="Yeni şifreni yaz"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          error={errors.newPassword}
        />
        <AppButton
          label="Şifreyi güncelle"
          icon="key-outline"
          onPress={handleResetPassword}
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
  noteTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  noteText: {
    ...typography.body,
    color: palette.textMuted,
  },
  link: {
    ...typography.label,
    color: palette.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
