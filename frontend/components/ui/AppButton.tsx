// @ts-nocheck
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
};

// Projedeki tüm ana aksiyonlar aynı buton bileşeni üzerinden geçsin diye ortaklaştırıldı.
export function AppButton({
  label,
  onPress,
  variant = 'primary',
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.base,
        variantStyles[variant],
        hovered && styles.hovered,
        pressed && styles.pressed,
        variant === 'primary' && shadows.glow,
      ]}>
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
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
});

// Variant bazlı görünüm ayrımı burada; ekranlar içinde renk/stil tekrarı yapmıyoruz.
const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: palette.primary,
    borderColor: '#8AB7FF',
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
    color: '#08111F',
  },
  secondary: {
    color: palette.text,
  },
  ghost: {
    color: palette.textMuted,
  },
});
