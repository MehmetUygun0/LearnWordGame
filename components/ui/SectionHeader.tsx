import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { palette, spacing, typography } from "../../constants/theme";

export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs
  },
  eyebrow: {
    ...typography.label,
    color: palette.secondary,
    textTransform: "uppercase"
  },
  title: {
    ...typography.display,
    color: palette.text
  },
  description: {
    ...typography.body,
    color: palette.textMuted
  }
});
