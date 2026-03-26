// @ts-nocheck
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';

type AppInputProps = {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
};

// Form alanları ileride state/validation ile genişleyecek; görsel temel burada sabitleniyor.
export function AppInput({
  label,
  placeholder,
  secureTextEntry = false,
}: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={palette.textMuted}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: palette.text,
  },
  input: {
    ...typography.body,
    minHeight: 54,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: palette.text,
    backgroundColor: palette.cardMuted,
    borderWidth: 1,
    borderColor: palette.border,
  },
});
