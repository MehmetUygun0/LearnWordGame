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
  multiline?: boolean;
  editable?: boolean;
};

export function AppInput({
  label,
  value = '',
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  helperText,
  multiline = false,
  editable = true,
}: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textFaint}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        selectionColor={palette.primary}
        editable={editable}
        style={[styles.input, multiline && styles.inputMultiline, !editable && styles.inputDisabled, error && styles.inputError]}
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
    color: palette.textMuted,
  },
  input: {
    ...typography.body,
    minHeight: 52,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    color: palette.text,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.border,
  },
  inputMultiline: {
    minHeight: 92,
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: palette.danger,
  },
  inputDisabled: {
    opacity: 0.68,
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
