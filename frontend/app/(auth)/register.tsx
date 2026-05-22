// @ts-nocheck
import React, { useState } from 'react';
import * as ExpoRouter from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, spacing, typography } from '@/constants/theme';

export default function RegisterScreen() {
  const { router } = ExpoRouter;
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const nextErrors = {
      username: username.trim() ? '' : 'Kullanıcı adı zorunlu.',
      email: /\S+@\S+\.\S+/.test(trimmedEmail) ? '' : 'Geçerli bir e-posta gir.',
      password:
        password.length >= 6 ? '' : 'Şifre en az 6 karakter olmalı.',
    };

    setErrors(nextErrors);

    if (nextErrors.username || nextErrors.email || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        userName: username,
        password,
        email: trimmedEmail || undefined,
      });
      router.replace('/(app)/home');
    } catch (error) {
      Alert.alert(
        'Kayıt başarısız',
        error instanceof Error ? error.message : 'Kayıt sırasında bir sorun oluştu.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable withBackgroundDecor contentStyle={styles.content}>
      <SectionHeader
        eyebrow="Yeni üye"
        title="Kendi çalışma alanını oluştur."
        description="Hedeflerini takip etmek ve kelime havuzunu yönetmek için hesabını aç."
      />

      <SurfaceCard accent="primary">
        <AppInput
          label="Kullanıcı adı"
          placeholder="bir kullanıcı adı seç"
          value={username}
          onChangeText={setUsername}
          error={errors.username}
        />
        <AppInput
          label="E-posta"
          placeholder="mail@ornek.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <AppInput
          label="Şifre"
          placeholder="güçlü bir şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <AppButton label="Kayıt ol" icon="person-add-outline" onPress={handleRegister} loading={isSubmitting} />
      </SurfaceCard>

      <View style={styles.footerLinks}>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.link}>Zaten hesabın var mı? Giriş yap</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  footerLinks: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  },
});
