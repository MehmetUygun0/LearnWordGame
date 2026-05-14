import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { palette, radius, spacing, typography } from "../../constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
};

export function AppButton({ label, onPress, disabled, variant = "primary", style }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style
      ]}>
      <Text
        style={[
          styles.label,
          variant === "ghost" ? styles.ghostLabel : styles.solidLabel
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  primary: {
    backgroundColor: palette.primary
  },
  secondary: {
    backgroundColor: palette.cardMuted,
    borderWidth: 1,
    borderColor: palette.border
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.border
  },
  pressed: {
    opacity: 0.88
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    ...typography.button
  },
  solidLabel: {
    color: palette.text
  },
  ghostLabel: {
    color: palette.textMuted
  }
});
