// @ts-nocheck
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, spacing, typography } from '@/constants/theme';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

// Sayfa başlıklarının aynı hiyerarşiyle görünmesi için ortak başlık bloğu.
export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...typography.label,
    color: palette.secondary,
  },
  title: {
    ...typography.display,
    color: palette.text,
  },
  description: {
    ...typography.body,
    color: palette.textMuted,
  },
});
