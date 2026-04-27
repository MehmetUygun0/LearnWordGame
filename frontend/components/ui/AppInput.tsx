// @ts-nocheck
import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';

type AppInputProps = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  helperText?: string;
};

// Form alanları ileride state/validation ile genişleyecek; görsel temel burada sabitleniyor.
export function AppInput({
  label,
  value = '',
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  helperText,
}: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.input, error && styles.inputError]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!error && helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
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
  inputError: {
    borderColor: palette.danger,
  },
  helperText: {
    ...typography.caption,
    color: palette.textFaint,
  },
  errorText: {
    ...typography.caption,
    color: palette.danger,
  },
});
