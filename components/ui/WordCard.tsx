import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { WordListItem } from "../../services/words";
import { palette, radius, spacing, typography } from "../../constants/theme";

export function WordCard({ word }: { word: WordListItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.word}>{word.engWordName}</Text>
        <Text style={styles.level}>{word.level}</Text>
      </View>
      <Text style={styles.meaning}>{word.turWordName}</Text>
      {word.samples.length ? <Text style={styles.sample}>{word.samples[0]}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.cardMuted,
    padding: spacing.md,
    gap: spacing.xs
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  word: {
    ...typography.cardTitle,
    color: palette.text
  },
  level: {
    ...typography.caption,
    color: palette.secondary
  },
  meaning: {
    ...typography.body,
    color: palette.textMuted
  },
  sample: {
    ...typography.caption,
    color: palette.textFaint
  }
});
