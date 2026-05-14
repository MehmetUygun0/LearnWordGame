import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, spacing } from "../../constants/theme";

export function ScreenContainer({
  children,
  scrollable = false
}: {
  children?: ReactNode;
  scrollable?: boolean;
}) {
  const content = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  scroll: {
    padding: spacing.lg
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.lg
  }
});
