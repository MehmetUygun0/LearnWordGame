// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoRouter from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { BackHeader } from '@/components/ui/BackHeader';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { getStoryLab } from '@/services/play';

export default function StoryLabScreen() {
  const router = ExpoRouter.useRouter();
  const [lab, setLab] = useState(null);

  useEffect(() => {
    const loadLab = async () => {
      setLab(await getStoryLab());
    };

    loadLab();
  }, []);

  return (
    <ScreenContainer scrollable withBackgroundDecor>
      <BackHeader title="Mini oyunlar" />
      <SectionHeader
        eyebrow="Word Chain"
        title="Kelimeleri hikayeye bağla"
        description="Öğrendiğin kelimelerden kısa hikaye ve AI görsel sahnesi."
      />

      <SurfaceCard accent="primary">
        <View style={styles.visualBox}>
          <Ionicons name="color-wand-outline" size={34} color={palette.text} />
          <Text style={styles.visualText}>AI sahne görseli</Text>
        </View>
        <Text style={styles.title}>Seçilen kelimeler</Text>
        <View style={styles.wordRow}>
          {(lab?.selectedWords ?? []).map((word) => (
            <View key={word.id} style={styles.wordChip}>
              <Text style={styles.wordText}>{word.engWordName}</Text>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.title}>Hikaye</Text>
        <Text style={styles.body}>{lab?.story ?? 'Hikaye hazırlanıyor...'}</Text>
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.title}>Sahne tarifi</Text>
        <Text style={styles.body}>{lab?.imagePrompt ?? 'Sahne hazırlanıyor...'}</Text>
      </SurfaceCard>

      <AppButton label="Ana sayfaya dön" variant="secondary" icon="arrow-back-outline" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  visualBox: {
    minHeight: 160,
    borderRadius: radius.xl,
    backgroundColor: palette.electric,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  visualText: {
    ...typography.label,
    color: palette.text,
  },
  title: {
    ...typography.cardTitle,
    color: palette.text,
  },
  body: {
    ...typography.body,
    color: palette.textMuted,
  },
  wordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  wordChip: {
    borderRadius: radius.pill,
    backgroundColor: palette.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  wordText: {
    ...typography.label,
    color: palette.text,
  },
});
