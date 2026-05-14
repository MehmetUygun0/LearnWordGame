import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { palette, radius, spacing, typography } from "../../constants/theme";

export function StatCard({
  eyebrow,
  value,
  accent = "primary"
}: {
  eyebrow: string;
  value: string;
  accent?: "primary" | "secondary";
}) {
  return (
    <View style={[styles.card, accent === "secondary" ? styles.secondary : styles.primary]}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    minHeight: 96,
    gap: spacing.xs
  },
  primary: {
    backgroundColor: palette.card,
    borderColor: palette.border
  },
  secondary: {
    backgroundColor: palette.primarySoft,
    borderColor: palette.primary
  },
  eyebrow: {
    ...typography.caption,
    color: palette.textMuted
  },
  value: {
    ...typography.title,
    color: palette.text
  }
});
