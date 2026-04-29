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

export default function LoginScreen() {
  const { router } = ExpoRouter;
  const { enterDemo, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const nextErrors = {
      username: username.trim() ? '' : 'Kullanıcı adı zorunlu.',
      password: password ? '' : 'Şifre zorunlu.',
    };

    setErrors(nextErrors);

    if (nextErrors.username || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        userName: username,
        password,
      });
      router.replace('/(app)/home');
    } catch (error) {
      Alert.alert(
        'Giriş başarısız',
        error instanceof Error ? error.message : 'Giriş sırasında bir sorun oluştu.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable contentStyle={styles.content}>
      <SectionHeader
        eyebrow="LearnWordGame"
        title="6 tekrar mantığıyla akıllı kelime çalış."
        description="Bu ekran artık token tabanlı auth akışına hazır. Backend login kontratı sağlandığında doğrudan çalışacak."
      />

      <SurfaceCard>
        <AppInput
          label="Kullanıcı adı"
          placeholder="oguzhanuyar"
          value={username}
          onChangeText={setUsername}
          error={errors.username}
        />
        <AppInput
          label="Şifre"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <AppButton label="Giriş Yap" onPress={handleLogin} loading={isSubmitting} />
        <AppButton
          label="Demo olarak sayfaları aç"
          variant="secondary"
          onPress={async () => {
            await enterDemo();
            router.replace('/(app)/home');
          }}
        />
      </SurfaceCard>

      <View style={styles.footerLinks}>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.link}>Hesabın yok mu? Kayıt ol</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.linkMuted}>Şifremi unuttum</Text>
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
    color: palette.textFaint,
  },
});
