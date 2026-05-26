// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { createWordChain, saveWordChainImage, WordChainResult } from '@/services/word-chain';

export default function WordChainScreen() {
  const { token } = useAuth();
  const [result, setResult] = useState<WordChainResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadChain = useCallback(async () => {
    setIsLoading(true);
    setSavedMessage('');
    setErrorMessage('');

    try {
      setResult(await createWordChain(token));
    } catch (error) {
      setResult(null);
      setErrorMessage(getWordChainErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadChain();
  }, [loadChain]);

  const handleSaveImage = async () => {
    if (!result?.imageUri || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const uri = await saveWordChainImage(result.imageUri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSavedMessage(`Görsel app içinde kaydedildi: ${uri.split('/').pop()}`);
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSavedMessage('Görsel kaydedilemedi. Lütfen tekrar dene.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Word Chain"
        title="Kelimeleri hikaye zincirine bağla."
        description="Story-7 için öğrenilen kelimelerden zincir, hikaye ve görsel taslak üretir."
      />

      {isLoading ? (
        <FeedbackState title="Word Chain hazırlanıyor" description="Hikaye ve görsel çıktısı üretiliyor." loading />
      ) : result ? (
        <>
          <SurfaceCard style={styles.chainCard}>
            <View style={styles.chainRow}>
              {result.words.map((word, index) => (
                <React.Fragment key={`${word.id}-${index}`}>
                  <View style={styles.wordChip}>
                    <Text style={styles.wordText}>{word.engWordName}</Text>
                    <Text style={styles.meaningText}>{word.turWordName}</Text>
                  </View>
                  {index + 1 < result.words.length ? (
                    <Ionicons name="arrow-forward" size={18} color={palette.textMuted} />
                  ) : null}
                </React.Fragment>
              ))}
            </View>
          </SurfaceCard>

          <SurfaceCard>
            <Text style={styles.sectionTitle}>Hikaye</Text>
            <Text style={styles.bodyText}>{result.story}</Text>
          </SurfaceCard>

          <SurfaceCard>
            <Text style={styles.sectionTitle}>LLM görsel taslağı</Text>
            <Image source={{ uri: result.imageUri }} style={styles.previewImage} />
            <Text style={styles.caption}>{result.imagePrompt}</Text>
            {savedMessage ? <Text style={styles.savedText}>{savedMessage}</Text> : null}
            <View style={styles.actionsRow}>
              <AppButton label="Yeni zincir üret" onPress={loadChain} variant="secondary" />
              <AppButton
                label="App içinde kaydet"
                loading={isSaving}
                disabled={!result.imageUri}
                onPress={handleSaveImage}
              />
            </View>
          </SurfaceCard>
        </>
      ) : (
        <FeedbackState
          title="Zincir oluşturulamadı"
          description={errorMessage || 'Yeterli öğrenilmiş kelime olduğunda bu ekran üretim yapacak.'}
          icon="alert-circle-outline"
          actionLabel="Tekrar dene"
          actionIcon="refresh-outline"
          onAction={loadChain}
        />
      )}

      <SurfaceCard muted>
        <View style={styles.noteHeader}>
          <Ionicons name="sparkles-outline" size={20} color={palette.secondary} />
          <Text style={styles.sectionTitle}>Entegrasyon notu</Text>
        </View>
        <Text style={styles.caption}>
          Backend tarafında LLM hikaye ve görsel endpointi eklendiğinde bu ekran aynı arayüzle gerçek çıktıyı gösterecek.
        </Text>
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chainCard: {
    gap: spacing.md,
  },
  chainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordChip: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.cardMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  wordText: {
    ...typography.label,
    color: palette.text,
    textTransform: 'capitalize',
  },
  meaningText: {
    ...typography.caption,
    color: palette.textMuted,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  bodyText: {
    ...typography.body,
    color: palette.textMuted,
  },
  caption: {
    ...typography.caption,
    color: palette.textMuted,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    backgroundColor: palette.cardMuted,
  },
  savedText: {
    ...typography.caption,
    color: palette.success,
  },
  actionsRow: {
    gap: spacing.sm,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

const getWordChainErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : '';

  if (message.toLocaleLowerCase('tr-TR').includes('5 kelime')) {
    return 'Word Chain için önce en az 5 öğrenilmiş kelime gerekiyor.';
  }

  if (message.toLocaleLowerCase('tr-TR').includes('api anahtarı')) {
    return 'Hikaye üretim servisi için OpenAI anahtarı eksik görünüyor.';
  }

  if (message.toLocaleLowerCase('tr-TR').includes('comfy') || message.toLocaleLowerCase('tr-TR').includes('gorsel')) {
    return 'Hikaye üretildi ancak görsel servisi hazır değil. ComfyUI/workflow ayarı kontrol edilmeli.';
  }

  return message || 'Word Chain servisi şu anda yanıt vermiyor.';
};
