// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { WordCard } from '@/components/ui/WordCard';
import { WordsScreen } from '@/components/ui/WordsScreen'
import { palette, radius, spacing, typography } from '@/constants/theme';
import { getWords, WordListItem, WordLevel } from '@/services/words';

const levels: WordLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function WordsScreen() {
  const [words, setWords] = useState<WordListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Kelime havuzu"
        title="Seviyelere göre kelime listesini incele."
        description="Kelime ekleme yok. Bu ekran veritabanındaki kelimeleri backend akışından çekip seviyelere göre gösterecek."
      />
        <SurfaceCard>
          <Text style={styles.infoTitle}>Yeni Kelime Ekle</Text>
            <AppInput 
              label="İngilizce" 
              placeholder="Örn: Relentless" 
              value={newWord.ing} 
              onChangeText={(t) => setNewWord({...newWord, ing: t})} 
        />
        <AppInput 
              label="Türkçe" 
              placeholder="Örn: Amansız" 
              value={newWord.tr} 
              onChangeText={(t) => setNewWord({...newWord, tr: t})} 
        />
        <AppButton label="Veritabanına Kaydet" onPress={handleSaveWord} />
      </SurfaceCard>
      <SurfaceCard muted>
        <Text style={styles.infoTitle}>Liste davranışı</Text>
        <Text style={styles.infoText}>
          Görsel ve ses alanları backend hazır olana kadar varsayılan görünümle gösterilir. Kelimeler seviye bazlı gruplandırılır.
        </Text>
      </SurfaceCard>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.loadingText}>Kelime listesi hazırlanıyor...</Text>
        </View>
      ) : (
        levels.map((level) => {
          const levelWords = words.filter((word) => word.level === level);

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  infoTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  infoText: {
    ...typography.body,
    color: palette.textMuted,
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
