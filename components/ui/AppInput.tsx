import React from "react";
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";

import { palette, radius, spacing, typography } from "../../constants/theme";

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  helperText?: string;
  error?: string;
  multiline?: boolean;
};

export function AppInput(props: Props) {
  const {
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    helperText,
    error,
    multiline
  } = props;

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
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.multiline, error ? styles.errorBorder : null]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs
  },
  label: {
    ...typography.label,
    color: palette.text
  },
  input: {
    ...typography.body,
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: palette.cardMuted,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text,
    paddingHorizontal: spacing.md
  },
  multiline: {
    minHeight: 96,
    paddingVertical: spacing.sm
  },
  helper: {
    ...typography.caption,
    color: palette.textFaint
  },
  error: {
    ...typography.caption,
    color: palette.danger
  },
  errorBorder: {
    borderColor: palette.danger
  }
});
