// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';
import { AppButton } from '@/components/ui/AppButton';
import { SurfaceCard } from '@/components/ui/SurfaceCard';

type FeedbackStateProps = {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  actionLabel?: string;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onAction?: () => void;
  style?: ViewStyle;
};

export function FeedbackState({
  title,
  description,
  icon = 'sparkles-outline',
  loading = false,
  actionLabel,
  actionIcon,
  onAction,
  style,
}: FeedbackStateProps) {
  return (
    <SurfaceCard muted style={[styles.card, style]}>
      <View style={styles.iconBox}>
        {loading ? (
          <ActivityIndicator color={palette.text} />
        ) : (
          <Ionicons name={icon} size={22} color={palette.accent} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          icon={actionIcon}
          onPress={onAction}
          variant="secondary"
        />
      ) : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 156,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.cardTitle,
    color: palette.text,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: palette.textMuted,
    textAlign: 'center',
  },
});
