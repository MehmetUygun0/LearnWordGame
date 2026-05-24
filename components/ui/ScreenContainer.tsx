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
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

type ScreenContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  withBackgroundDecor?: boolean;
};

export function ScreenContainer({
  children,
  scrollable = false,
  contentStyle,
  withBackgroundDecor = false,
}: ScreenContainerProps) {
  const inner = (
    <View style={[styles.content, contentStyle]}>
      {withBackgroundDecor ? (
        <>
          <AnimatedBackground />
          <View pointerEvents="none" style={styles.topBeam} />
          <View pointerEvents="none" style={styles.sideBeam} />
          <View pointerEvents="none" style={styles.floatDotOne} />
          <View pointerEvents="none" style={styles.floatDotTwo} />
        </>
      ) : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
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
    paddingTop: spacing.lg,
    paddingBottom: 116,
    gap: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 116,
  },
  topBeam: {
    position: 'absolute',
    top: 8,
    left: spacing.lg,
    right: spacing.lg,
    height: 2,
    backgroundColor: palette.primarySoft,
  },
  sideBeam: {
    position: 'absolute',
    top: 80,
    right: -30,
    width: 84,
    height: 190,
    borderRadius: 28,
    backgroundColor: palette.electricSoft,
    transform: [{ rotate: '-18deg' }],
  },
  floatDotOne: {
    position: 'absolute',
    top: 42,
    right: 34,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.accent,
    opacity: 0.85,
  },
  floatDotTwo: {
    position: 'absolute',
    top: 210,
    left: 22,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.secondary,
    opacity: 0.8,
  },
});
