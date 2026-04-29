// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/theme';
import { WordListItem } from '@/services/words';

type WordCardProps = {
  word: WordListItem;
};

// Kelime kartı backend görsel/ses alanları boş gelse bile tutarlı bir görünüm koruyor.
export function WordCard({ word }: WordCardProps) {
  const sample = word.samples[0] || 'Örnek cümle backend akışından geldiğinde burada görünecek.';

  return (
    <View style={styles.card}>
      <View style={styles.preview}>
        <Ionicons name="book-outline" size={22} color={palette.text} />
        <Text style={styles.previewText}>
          {word.pictureUrl ? 'Görsel hazır' : 'Varsayılan görsel'}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.english}>{word.engWordName}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{word.level}</Text>
          </View>
        </View>
        <Text style={styles.turkish}>{word.turWordName}</Text>
        <Text style={styles.sample}>{sample}</Text>

        <View style={styles.footerRow}>
          <View style={styles.infoChip}>
            <Ionicons name="volume-medium-outline" size={14} color={palette.textMuted} />
            <Text style={styles.infoText}>
              {word.audioUrl ? 'Ses hazır' : 'Varsayılan ses'}
            </Text>
          </View>
          <View style={styles.infoChip}>
            <Ionicons name="document-text-outline" size={14} color={palette.textMuted} />
            <Text style={styles.infoText}>{word.samples.length || 1} cümle</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: palette.cardMuted,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  preview: {
    minHeight: 110,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  previewText: {
    ...typography.caption,
    color: palette.textMuted,
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  english: {
    ...typography.title,
    color: palette.text,
    flex: 1,
  },
  levelBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: palette.secondarySoft,
  },
  levelText: {
    ...typography.caption,
    color: palette.text,
  },
  turkish: {
    ...typography.cardTitle,
    color: palette.textMuted,
  },
  sample: {
    ...typography.body,
    color: palette.textFaint,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: palette.backgroundElevated,
  },
  infoText: {
    ...typography.caption,
    color: palette.textMuted,
  },
});
