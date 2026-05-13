// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoRouter from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { BackHeader } from '@/components/ui/BackHeader';
import { RevealStageTimeline } from '@/components/ui/RevealStageTimeline';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { getWordById, WordListItem } from '@/services/words';

export default function WordDetailScreen() {
  const router = ExpoRouter.useRouter();
  const { id } = ExpoRouter.useLocalSearchParams();
  const [word, setWord] = useState<WordListItem | null>(null);

  useEffect(() => {
    const loadWord = async () => {
      const nextWord = await getWordById(String(id));
      setWord(nextWord);
    };

    loadWord();
  }, [id]);

  if (!word) {
    return (
      <ScreenContainer withBackgroundDecor>
        <SurfaceCard muted style={styles.loadingCard}>
          <ActivityIndicator color={palette.text} />
        </SurfaceCard>
      </ScreenContainer>
    );
  }

  const handlePlayAudio = async () => {
    if (!word.audioUrl) {
      return;
    }

    await Haptics.selectionAsync();
    await Linking.openURL(word.audioUrl);
  };

  return (
    <ScreenContainer scrollable withBackgroundDecor>
      <BackHeader title="Kelime listesi" />
      <SectionHeader
        eyebrow="Kelime detayı"
        title={word.engWordName}
        description={`${word.turWordName} • ${word.level}`}
      />

      <SurfaceCard accent="primary">
        <View style={styles.heroIcon}>
          <Ionicons name="sparkles-outline" size={28} color={palette.text} />
        </View>
        <Text style={styles.title}>6 tekrar yolu</Text>
        <RevealStageTimeline stage={word.stage ?? 0} nextReviewLabel={word.nextReviewLabel ?? 'tekrar zamanı'} />
        <Text style={styles.caption}>Kelime 6 doğru tekrarı tamamlayınca öğrenildi olarak işaretlenir.</Text>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.title}>Örnek cümleler</Text>
        {word.samples.length ? (
          word.samples.map((sample, index) => (
            <View key={`${sample}-${index}`} style={styles.sampleRow}>
              <Text style={styles.sampleIndex}>{index + 1}</Text>
              <Text style={styles.sampleText}>{sample}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.caption}>Bu kelime için örnek cümle eklenebilir.</Text>
        )}
      </SurfaceCard>

      <SurfaceCard accent="secondary">
        <View style={styles.memoryRow}>
          <View style={styles.memoryIcon}>
            <Ionicons name="bulb-outline" size={20} color={palette.background} />
          </View>
          <View style={styles.memoryBody}>
            <Text style={styles.title}>Hafıza ipucu</Text>
            <Text style={styles.caption}>
              “{word.engWordName}” kelimesini “{word.turWordName}” anlamıyla küçük bir sahneye bağla; görsel geldiğinde aynı sahneyi tekrar hatırla.
            </Text>
          </View>
        </View>
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.title}>Medya</Text>
        <View style={styles.mediaRow}>
          <View style={[styles.mediaBox, word.pictureUrl && styles.mediaBoxActive]}>
            {word.pictureUrl ? (
              <>
                <Image source={{ uri: word.pictureUrl }} style={styles.mediaImage} resizeMode="cover" />
                <View style={styles.mediaOverlay}>
                  <Ionicons name="image-outline" size={16} color={palette.text} />
                  <Text style={styles.mediaOverlayText}>Kelime görseli</Text>
                </View>
              </>
            ) : (
              <>
                <Ionicons name="sparkles-outline" size={24} color={palette.accent} />
                <Text style={styles.mediaTitle}>AI görsel</Text>
                <Text style={styles.caption}>Görsel hazırlanıyor</Text>
              </>
            )}
          </View>
          <Pressable
            disabled={!word.audioUrl}
            onPress={handlePlayAudio}
            style={[styles.mediaBox, word.audioUrl && styles.mediaBoxActive]}>
            <Ionicons name={word.audioUrl ? 'play-circle-outline' : 'volume-medium-outline'} size={28} color={word.audioUrl ? palette.lime : palette.textFaint} />
            <Text style={styles.mediaTitle}>{word.audioUrl ? 'Sesi dinle' : 'Telaffuz sesi'}</Text>
            <Text style={styles.caption}>{word.audioUrl ? 'Telaffuz hazır' : 'Ses hazırlanıyor'}</Text>
          </Pressable>
        </View>
      </SurfaceCard>

      <AppButton label="Geri dön" variant="secondary" icon="arrow-back-outline" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: palette.electric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.cardTitle,
    color: palette.text,
  },
  caption: {
    ...typography.body,
    color: palette.textMuted,
  },
  sampleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    padding: spacing.md,
  },
  sampleIndex: {
    ...typography.label,
    color: palette.accent,
    width: 24,
  },
  sampleText: {
    ...typography.body,
    color: palette.textMuted,
    flex: 1,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  memoryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  memoryIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: palette.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryBody: {
    flex: 1,
    minWidth: 0,
  },
  mediaBox: {
    flex: 1,
    minHeight: 136,
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
  },
  mediaBoxActive: {
    borderColor: palette.accent,
    backgroundColor: palette.surface,
  },
  mediaImage: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaOverlay: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    minHeight: 34,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(17, 24, 39, 0.78)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  mediaOverlayText: {
    ...typography.caption,
    color: palette.text,
  },
  mediaTitle: {
    ...typography.label,
    color: palette.text,
    textAlign: 'center',
  },
});
