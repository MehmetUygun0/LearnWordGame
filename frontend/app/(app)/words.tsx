// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { WordCard } from '@/components/ui/WordCard';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { getWords, WordListItem, WordLevel } from '@/services/words';

const levels: WordLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const allLevels: (WordLevel | 'ALL')[] = ['ALL', ...levels];

export default function WordsScreen() {
  const [words, setWords] = useState<WordListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<WordLevel | 'ALL'>('ALL');

  useEffect(() => {
    const loadWords = async () => {
      try {
        const nextWords = await getWords();
        setWords(nextWords);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, []);

  const filteredWords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr-TR');

    return words.filter((word) => {
      const matchesLevel = selectedLevel === 'ALL' || word.level === selectedLevel;
      const matchesQuery =
        !normalizedQuery ||
        word.engWordName.toLocaleLowerCase('tr-TR').includes(normalizedQuery) ||
        word.turWordName.toLocaleLowerCase('tr-TR').includes(normalizedQuery);

      return matchesLevel && matchesQuery;
    });
  }, [searchQuery, selectedLevel, words]);

  const totalSampleCount = filteredWords.reduce((total, word) => total + word.samples.length, 0);

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Kelime havuzu"
        title="Seviyelere göre kelime listesini incele."
        description="Kelime ekleme yok. Backend liste endpoint'i gelene kadar ekran, story akışını durdurmamak için örnek havuzla çalışır."
      />

      <View style={styles.statsRow}>
        <StatCard eyebrow="Toplam kelime" value={`${filteredWords.length} kayıt`} />
        <StatCard eyebrow="Örnek cümle" value={`${totalSampleCount} içerik`} accent="secondary" />
      </View>

      <SurfaceCard muted style={styles.filterCard}>
        <Text style={styles.infoTitle}>Liste davranışı</Text>
        <Text style={styles.infoText}>
          Görsel ve ses alanları backend hazır olana kadar varsayılan görünümle gösterilir. Seviye ve arama filtresi sadece frontend tarafında çalışır.
        </Text>
        <AppInput
          label="Kelime ara"
          placeholder="İngilizce veya Türkçe kelime yaz"
          value={searchQuery}
          onChangeText={setSearchQuery}
          helperText="Örnek: route, rota, journey"
        />
        <View style={styles.filterRow}>
          {allLevels.map((level) => {
            const isActive = selectedLevel === level;

            return (
              <Pressable
                key={level}
                onPress={() => setSelectedLevel(level)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {level === 'ALL' ? 'Tümü' : level}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SurfaceCard>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.loadingText}>Kelime listesi hazırlanıyor...</Text>
        </View>
      ) : (
        levels.map((level) => {
          const levelWords = filteredWords.filter((word) => word.level === level);

          if (!levelWords.length) {
            return null;
          }

          return (
            <View key={level} style={styles.levelSection}>
              <View style={styles.levelHeader}>
                <Text style={styles.levelTitle}>{level} seviyesi</Text>
                <View style={styles.levelCount}>
                  <Text style={styles.levelCountText}>{levelWords.length} kelime</Text>
                </View>
              </View>

              <View style={styles.cardsColumn}>
                {levelWords.map((word) => (
                  <WordCard key={word.id} word={word} />
                ))}
              </View>
            </View>
          );
        })
      )}

      {!isLoading && !filteredWords.length ? (
        <SurfaceCard muted>
          <Text style={styles.infoTitle}>Sonuç bulunamadı</Text>
          <Text style={styles.infoText}>
            Arama metnini temizleyip tekrar deneyebilirsin. Backend liste endpointi geldiğinde bu ekran gerçek veriyi aynı filtrelerle gösterecek.
          </Text>
        </SurfaceCard>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  filterCard: {
    gap: spacing.md,
  },
  infoTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  infoText: {
    ...typography.body,
    color: palette.textMuted,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.backgroundElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryStrong,
  },
  filterChipText: {
    ...typography.caption,
    color: palette.textMuted,
  },
  filterChipTextActive: {
    color: palette.text,
  },
  loadingState: {
    minHeight: 180,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.body,
    color: palette.textMuted,
  },
  levelSection: {
    gap: spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelTitle: {
    ...typography.title,
    color: palette.text,
  },
  levelCount: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: palette.primarySoft,
  },
  levelCountText: {
    ...typography.caption,
    color: palette.text,
  },
  cardsColumn: {
    gap: spacing.md,
  },
});
