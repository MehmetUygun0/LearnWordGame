import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { palette, radius, spacing, shadows } from "../../constants/theme";

export function SurfaceCard({
  children,
  muted = false,
  style
}: {
  children: ReactNode;
  muted?: boolean;
  style?: ViewStyle;
}) {
  return <View style={[styles.base, muted ? styles.muted : styles.normal, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
    ...shadows.soft
  },
  normal: {
    backgroundColor: palette.card,
    borderColor: palette.border
  },
  muted: {
    backgroundColor: palette.backgroundSoft,
    borderColor: palette.border
  }
});
