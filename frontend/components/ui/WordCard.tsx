// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';
import { WordListItem } from '@/services/words';

type WordCardProps = {
  word: WordListItem;
  onPress?: () => void;
};

export function WordCard({ word, onPress }: WordCardProps) {
  const sample = word.samples[0] || 'Bu kelime için örnek cümle eklenebilir.';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View pointerEvents="none" style={styles.topLine} />
      {word.pictureUrl ? (
        <Image source={{ uri: word.pictureUrl }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={styles.iconBox}>
          <Ionicons name="sparkles-outline" size={19} color={palette.text} />
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.wordBlock}>
            <Text style={styles.english} numberOfLines={1}>{word.engWordName}</Text>
            <Text style={styles.turkish} numberOfLines={1}>{word.turWordName}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{word.level}</Text>
          </View>
        </View>
        <Text style={styles.sample} numberOfLines={2}>{sample}</Text>
        <View style={styles.footerRow}>
          <View style={styles.infoChip}>
            <Ionicons name="image-outline" size={13} color={palette.textFaint} />
            <Text style={styles.infoText}>{word.pictureUrl ? 'Görsel' : 'Görsel yok'}</Text>
          </View>
          <View style={styles.infoChip}>
            <Ionicons name="volume-medium-outline" size={13} color={palette.textFaint} />
            <Text style={styles.infoText}>{word.audioUrl ? 'Ses' : 'Ses yok'}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.md,
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: palette.electric,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.electric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.backgroundElevated,
  },
  body: {
    flex: 1,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  wordBlock: {
    flex: 1,
  },
  english: {
    ...typography.cardTitle,
    color: palette.text,
  },
  turkish: {
    ...typography.body,
    color: palette.textMuted,
  },
  levelBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    backgroundColor: palette.secondarySoft,
  },
  levelText: {
    ...typography.caption,
    color: palette.secondary,
  },
  sample: {
    ...typography.caption,
    color: palette.textFaint,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    backgroundColor: palette.backgroundElevated,
  },
  infoText: {
    ...typography.caption,
    color: palette.textFaint,
  },
});
