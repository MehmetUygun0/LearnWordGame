// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as ExpoRouter from 'expo-router';

import { palette, radius, spacing, typography } from '@/constants/theme';

type BackHeaderProps = {
  title?: string;
};

export function BackHeader({ title = 'Geri' }: BackHeaderProps) {
  const router = ExpoRouter.useRouter();

  return (
    <View style={styles.row}>
      <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Ionicons name="chevron-back" size={20} color={palette.text} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }],
  },
  title: {
    ...typography.label,
    color: palette.textMuted,
  },
});
