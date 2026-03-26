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
};

// Tüm ekranların aynı arka plan, güvenli alan ve iç boşluk yapısını kullanması için ortak container.
export function ScreenContainer({
  children,
  scrollable = false,
  contentStyle,
}: ScreenContainerProps) {
  const inner = <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundOrbPrimary} />
      <View style={styles.backgroundOrbSecondary} />
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
  // Arka plandaki iki yumuşak renk lekesi uygulamaya tekdüze olmayan bir derinlik veriyor.
  backgroundOrbPrimary: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: '#1B3A82',
    opacity: 0.22,
  },
  backgroundOrbSecondary: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: '#0F766E',
    opacity: 0.16,
  },
});
