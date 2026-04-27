// @ts-nocheck
import React, { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing } from '@/constants/theme';

type ScreenContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  withBackgroundDecor?: boolean;
};

// Tüm ekranların aynı arka plan, güvenli alan ve iç boşluk yapısını kullanması için ortak container.
export function ScreenContainer({
  children,
  scrollable = false,
  contentStyle,
  withBackgroundDecor = false,
}: ScreenContainerProps) {
  void withBackgroundDecor;
  const inner = <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
