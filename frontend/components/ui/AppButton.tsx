// @ts-nocheck
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

// Projedeki tüm ana aksiyonlar aynı buton bileşeni üzerinden geçsin diye ortaklaştırıldı.
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ hovered, pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variantStyles[variant],
        (disabled || loading) && styles.disabled,
        hovered && styles.hovered,
        pressed && styles.pressed,
        variant === 'primary' && shadows.glow,
      ]}>
      {loading ? (
        <ActivityIndicator color={labelStyles[variant].color} />
      ) : (
        <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    ...typography.button,
  },
  hovered: {
    transform: [{ translateY: -1 }],
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.55,
  },
});

// Variant bazlı görünüm ayrımı burada; ekranlar içinde renk/stil tekrarı yapmıyoruz.
const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryStrong,
  },
  secondary: {
    backgroundColor: palette.cardMuted,
    borderColor: palette.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: palette.border,
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: palette.text,
  },
  secondary: {
    color: palette.text,
  },
  ghost: {
    color: palette.textMuted,
  },
});
