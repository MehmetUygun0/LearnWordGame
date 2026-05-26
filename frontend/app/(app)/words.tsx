// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoRouter from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { WordCard } from '@/components/ui/WordCard';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { createUserWord, getWords, WordListItem, WordLevel } from '@/services/words';

const levels: WordLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const allLevels: (WordLevel | 'ALL')[] = ['ALL', ...levels];

export default function WordsScreen() {
  const { router } = ExpoRouter;
  const { token } = useAuth();
  const [words, setWords] = useState<WordListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<WordLevel | 'ALL'>('ALL');
  const [englishWord, setEnglishWord] = useState('');
  const [turkishWord, setTurkishWord] = useState('');
  const [sampleSentence, setSampleSentence] = useState('');
  const [samples, setSamples] = useState<string[]>([]);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [formLevel, setFormLevel] = useState<WordLevel>('A1');
  const [formNotice, setFormNotice] = useState('');

  useEffect(() => {
    const loadWords = async () => {
      try {
        const nextWords = await getWords(token);
        setWords(nextWords);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, [token]);

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

  const handleAddSample = async () => {
    const trimmedSample = sampleSentence.trim();

    if (!trimmedSample) {
      setFormNotice('Örnek cümle alanı boş.');
      return;
    }

    await Haptics.selectionAsync();
    setSamples((currentSamples) => [...currentSamples, trimmedSample]);
    setSampleSentence('');
    setFormNotice('Örnek cümle eklendi.');
  };

  const handleAddWord = async () => {
    const trimmedEnglish = englishWord.trim();
    const trimmedTurkish = turkishWord.trim();

    if (!trimmedEnglish || !trimmedTurkish) {
      setFormNotice('İngilizce kelime ve Türkçe karşılık zorunlu.');
      return;
    }

    setIsSubmitting(true);
    setFormNotice('');

    try {
      const nextWord = await createUserWord({
        token,
        draft: {
          engWordName: trimmedEnglish,
          turWordName: trimmedTurkish,
          level: formLevel,
          generatedImageUrl: selectedImageUri,
          audioUrl: null,
          samples: samples.length ? samples : sampleSentence.trim() ? [sampleSentence.trim()] : [],
        },
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setWords((currentWords) => [nextWord, ...currentWords]);
      setEnglishWord('');
      setTurkishWord('');
      setSampleSentence('');
      setSamples([]);
      setSelectedImageUri(null);
      setFormNotice(token === 'demo-session' ? 'Demo kelime listeye eklendi.' : 'Kelime backend tarafına kaydedildi.');
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setFormNotice(error instanceof Error ? error.message : 'Kelime eklenemedi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setFormNotice('Görsel seçmek için galeri izni gerekli.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.82,
    });

    if (result.canceled || !result.assets?.[0]?.uri) {
      return;
    }

    await Haptics.selectionAsync();
    setSelectedImageUri(result.assets[0].uri);
    setFormNotice('Görsel seçildi. Backend medya alanını desteklediğinde kalıcı kaydedilecek.');
  };

  const handleRemoveSample = async (index: number) => {
    await Haptics.selectionAsync();
    setSamples((currentSamples) => currentSamples.filter((_, sampleIndex) => sampleIndex !== index));
    setFormNotice('Örnek cümle kaldırıldı.');
  };

  return (
    <ScreenContainer scrollable withBackgroundDecor>
      <SectionHeader
        eyebrow="Kelime yönetimi"
        title="Çalışma havuzunu düzenle"
        description="Yeni kelime ekle, seviyeye göre filtrele ve örnek cümleleri kontrol et."
      />

      <View style={styles.statsRow}>
        <StatCard eyebrow="Toplam" value={`${words.length}`} detail="kelime" />
        <StatCard
          eyebrow="Gösterilen"
          value={`${filteredWords.length}`}
          detail="sonuç"
          accent="secondary"
        />
      </View>

      <SurfaceCard accent="primary">
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.sectionTitle}>Yeni kelime</Text>
            <Text style={styles.sectionText}>Kelimeyi ve ilk örnek cümleyi ekle.</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="add-outline" size={22} color={palette.text} />
          </View>
        </View>

        <View style={styles.formGrid}>
          <AppInput
            label="İngilizce"
            placeholder="route"
            value={englishWord}
            onChangeText={setEnglishWord}
          />
          <AppInput
            label="Türkçe"
            placeholder="rota"
            value={turkishWord}
            onChangeText={setTurkishWord}
          />
        </View>

        <Text style={styles.fieldLabel}>Seviye</Text>
        <View style={styles.filterRow}>
          {levels.map((level) => {
            const isActive = formLevel === level;

            return (
              <Pressable
                key={level}
                onPress={() => setFormLevel(level)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <AppInput
          label="Örnek cümle"
          placeholder="This route is shorter."
          value={sampleSentence}
          onChangeText={setSampleSentence}
          multiline
        />
        <AppButton
          label="Örnek cümle ekle"
          variant="secondary"
          icon="add-circle-outline"
          onPress={handleAddSample}
        />
        {samples.length ? (
          <View style={styles.sampleList}>
            {samples.map((sample, index) => (
              <Pressable key={`${sample}-${index}`} onPress={() => handleRemoveSample(index)} style={styles.sampleChip}>
                <Text style={styles.sampleText}>{index + 1}. {sample}</Text>
                <Ionicons name="close-circle-outline" size={18} color={palette.textFaint} />
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={styles.fieldLabel}>Medya</Text>
        <View style={styles.mediaRow}>
          <Pressable onPress={handlePickImage} style={styles.mediaBox}>
            {selectedImageUri ? (
              <>
                <Image source={{ uri: selectedImageUri }} style={styles.selectedImage} />
                <Pressable onPress={() => setSelectedImageUri(null)} style={styles.removeImageButton}>
                  <Ionicons name="close-outline" size={18} color={palette.text} />
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.mediaIcon}>
                  <Ionicons name="image-outline" size={22} color={palette.accent} />
                </View>
                <Text style={styles.mediaText}>Görsel seç</Text>
                <Text style={styles.mediaHint}>Kelimeye özel resmi galeriden ekle.</Text>
              </>
            )}
          </Pressable>

          <View style={styles.mediaBox}>
            <View style={styles.mediaIcon}>
              <Ionicons name="volume-medium-outline" size={22} color={palette.accent} />
            </View>
            <Text style={styles.mediaText}>Telaffuz sesi</Text>
            <Text style={styles.mediaHint}>Hazır olduğunda dinleme aktif olur.</Text>
          </View>
        </View>

        {formNotice ? <Text style={styles.noticeText}>{formNotice}</Text> : null}
        <AppButton
          label="Listeye ekle"
          icon="add-outline"
          onPress={handleAddWord}
          loading={isSubmitting}
        />
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.sectionTitle}>Kelime listesi</Text>
        <AppInput
          label="Ara"
          placeholder="İngilizce veya Türkçe kelime"
          value={searchQuery}
          onChangeText={setSearchQuery}
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
        <FeedbackState title="Kelimeler hazırlanıyor" description="Kelime havuzu backendden yükleniyor." loading />
      ) : filteredWords.length ? (
        <View style={styles.cardsColumn}>
          {filteredWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onPress={() => router.push({ pathname: '/(app)/word/[id]', params: { id: String(word.id) } })}
            />
          ))}
        </View>
      ) : (
        <FeedbackState
          title="Bu havuzda yok"
          description="Aramayı sadeleştir veya farklı bir seviye seç."
          icon="search-outline"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  sectionText: {
    ...typography.body,
    color: palette.textMuted,
  },
  formGrid: {
    gap: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    color: palette.textMuted,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    minHeight: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryStrong,
  },
  filterChipText: {
    ...typography.label,
    color: palette.textMuted,
  },
  filterChipTextActive: {
    color: palette.text,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  mediaBox: {
    flex: 1,
    minHeight: 132,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: palette.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 116,
    borderRadius: radius.md,
    backgroundColor: palette.cardMuted,
  },
  removeImageButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(17, 24, 39, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaText: {
    ...typography.label,
    color: palette.text,
    textAlign: 'center',
  },
  mediaHint: {
    ...typography.caption,
    color: palette.accent,
    fontSize: 10,
    textAlign: 'center',
    maxWidth: 136,
  },
  sampleList: {
    gap: spacing.xs,
  },
  sampleChip: {
    borderRadius: radius.md,
    backgroundColor: palette.backgroundElevated,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sampleText: {
    ...typography.caption,
    color: palette.textMuted,
    flex: 1,
  },
  noticeText: {
    ...typography.caption,
    color: palette.secondary,
  },
  loadingState: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    minHeight: 150,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsColumn: {
    gap: spacing.md,
  },
});
