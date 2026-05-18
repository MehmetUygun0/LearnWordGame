// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ hovered, pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variantStyles[variant],
        variant === 'primary' && shadows.glow,
        (disabled || loading) && styles.disabled,
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={labelStyles[variant].color} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={18} color={labelStyles[variant].color} /> : null}
          <Text style={[styles.label, labelStyles[variant]]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  hovered: {
    transform: [{ translateY: -2 }],
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.48,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryStrong,
  },
  secondary: {
    backgroundColor: palette.electricSoft,
    borderColor: 'rgba(124, 108, 255, 0.34)',
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
