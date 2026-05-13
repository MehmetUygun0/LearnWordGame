// @ts-nocheck
import React, { useState } from 'react';
import * as ExpoRouter from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

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
    <ScreenContainer scrollable withBackgroundDecor contentStyle={styles.content}>
      <SectionHeader
        eyebrow="LearnWordGame"
        title="Kelimeleri düzenli tekrarlarla öğren."
        description="Günlük çalışma planına gir, kartlarını çöz ve ilerlemeni takip et."
      />

      <SurfaceCard accent="secondary">
        <Text style={styles.noteTitle}>Nasıl çalışır?</Text>
        <View style={styles.onboardingRow}>
          <OnboardingStep icon="repeat-outline" title="6 tekrar" text="Doğru bildikçe kelime yeni aralığa taşınır." />
          <OnboardingStep icon="flame-outline" title="Streak" text="Günlük hedefini bitir, serini büyüt." />
          <OnboardingStep icon="sparkles-outline" title="Oyun" text="Wordle ve Word Chain ile pekiştir." />
        </View>
      </SurfaceCard>

      <SurfaceCard accent="primary">
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
        <AppButton label="Giriş yap" icon="log-in-outline" onPress={handleLogin} loading={isSubmitting} />
        <AppButton
          label="Hızlıca göz at"
          variant="secondary"
          icon="sparkles-outline"
          onPress={async () => {
            await enterDemo();
            router.replace('/(app)/home');
          }}
        />
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.noteTitle}>Bugün seni bekleyenler</Text>
        <Text style={styles.noteText}>Kısa çalışma oturumu, kelime havuzu ve ilerleme raporu tek yerde.</Text>
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

function OnboardingStep({ icon, title, text }) {
  return (
    <View style={styles.onboardingStep}>
      <View style={styles.onboardingIcon}>
        <Ionicons name={icon} size={18} color={palette.text} />
      </View>
      <Text style={styles.onboardingTitle}>{title}</Text>
      <Text style={styles.onboardingText}>{text}</Text>
    </View>
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
  noteTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  noteText: {
    ...typography.body,
    color: palette.textMuted,
  },
  onboardingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  onboardingStep: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  onboardingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingTitle: {
    ...typography.label,
    color: palette.text,
  },
  onboardingText: {
    ...typography.caption,
    color: palette.textMuted,
    fontSize: 10,
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
