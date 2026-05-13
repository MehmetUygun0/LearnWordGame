// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ProgressMeter } from '@/components/ui/ProgressMeter';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';
import {
  StudyOverview,
  StudySession,
  submitStudyAnswer,
  getStudyOverview,
  startStudySession,
} from '@/services/study';
import { WordListItem } from '@/services/words';

export default function StudyScreen() {
  const { user } = useAuth();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [studyWords, setStudyWords] = useState<WordListItem[]>([]);
  const [overview, setOverview] = useState<StudyOverview | null>(null);
  const [session, setSession] = useState<StudySession | null>(null);

  useEffect(() => {
    const loadStudyWords = async () => {
      try {
        const [nextOverview, nextSession] = await Promise.all([
          getStudyOverview({
            level: user?.level,
            dailyNewWords: user?.dailyNewWords,
          }),
          startStudySession({
            level: user?.level,
            dailyNewWords: user?.dailyNewWords,
          }),
        ]);

        setOverview(nextOverview);
        setSession(nextSession);
        setStudyWords(nextSession.items);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudyWords();
  }, [user?.dailyNewWords, user?.level]);

  const currentWord = useMemo(
    () => studyWords[currentIndex] ?? null,
    [currentIndex, studyWords]
  );

  const totalWords = studyWords.length || 1;

  const handleSubmit = () => {
    if (!currentWord || isAnswered) {
      return;
    }

    const result = submitStudyAnswer({
      answer,
      word: currentWord,
      index: currentIndex,
    });
    setIsAnswered(true);

    if (result.isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    setFeedback(
      result.isCorrect
        ? `Doğru cevap. ${result.currentStepLabel} seviyesine ilerledi.`
        : `Doğru cevap: ${result.correctAnswer} • ${result.nextReviewLabel}`
    );
  };

  const handleNext = () => {
    if (!studyWords.length) {
      return;
    }

    setAnswer('');
    setFeedback('');
    setIsAnswered(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const isSessionCompleted = currentIndex >= studyWords.length && studyWords.length > 0;

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Çalışma oturumu"
        title="Soru kartı akışını burada işle."
        description={`Profil seviyen ${user?.level ?? 'A1'} olduğu için bu seviyeye uygun kelimeler gösteriliyor.`}
      />

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.loadingText}>Çalışma oturumu hazırlanıyor...</Text>
        </View>
      ) : isSessionCompleted ? (
        <SurfaceCard>
          <Text style={styles.progressTitle}>Oturum tamamlandı</Text>
          <Text style={styles.progressText}>
            Bu demo akışta {studyWords.length} kelime gösterildi. Doğru sayın {correctCount} olarak tutuldu.
          </Text>
          <View style={styles.assetRow}>
            <View style={styles.assetChip}>
              <Text style={styles.assetText}>Doğru: {correctCount}</Text>
            </View>
            <View style={styles.assetChip}>
              <Text style={styles.assetText}>Yanlış: {studyWords.length - correctCount}</Text>
            </View>
          </View>
          <AppButton
            label="Oturumu yeniden başlat"
            onPress={() => {
              setCurrentIndex(0);
              setCorrectCount(0);
              setAnswer('');
              setFeedback('');
              setIsAnswered(false);
            }}
          />
        </SurfaceCard>
      ) : !currentWord ? (
        <SurfaceCard muted>
          <Text style={styles.progressTitle}>Hazır kelime yok</Text>
          <Text style={styles.progressText}>Bu seviye için henüz kelime gelmedi. Backend kelime havuzu dolduğunda bu ekran otomatik çalışacak.</Text>
        </SurfaceCard>
      ) : (
        <SurfaceCard>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Sıra {currentIndex + 1} / {totalWords}</Text>
            </View>
            <Ionicons name="volume-high-outline" size={20} color={palette.textMuted} />
          </View>
          <ProgressMeter progress={(currentIndex + 1) / totalWords} />
          <Text style={styles.word}>{currentWord.engWordName}</Text>
          <Text style={styles.hint}>
            {currentWord.samples[0] || 'Örnek cümle backend akışından geldiğinde burada gösterilecek.'}
          </Text>
          <View style={styles.assetRow}>
            <View style={styles.assetChip}>
              <Text style={styles.assetText}>
                {currentWord.pictureUrl ? 'Görsel hazır' : 'Varsayılan görsel'}
              </Text>
            </View>
            <View style={styles.assetChip}>
              <Text style={styles.assetText}>
                {currentWord.audioUrl ? 'Ses hazır' : 'Varsayılan ses'}
              </Text>
            </View>
          </View>
          <AppInput
            label="Cevabın"
            placeholder="Türkçe karşılığını yaz"
            value={answer}
            onChangeText={(text) => {
              setAnswer(text);
              if (feedback) {
                setFeedback('');
              }
            }}
            helperText="Story 3 geldiğinde bu alan gerçek answer-submit endpoint'ine bağlanacak."
          />
          {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
          <View style={styles.actionsRow}>
            <AppButton
              label="Cevabı Gönder"
              onPress={handleSubmit}
              disabled={!answer.trim() || isAnswered}
            />
            <AppButton
              label={currentIndex + 1 === studyWords.length ? 'Oturumu Bitir' : 'Sonraki Kelime'}
              variant="secondary"
              onPress={handleNext}
              disabled={!isAnswered}
            />
          </View>
        </SurfaceCard>
      )}

      <SurfaceCard muted style={styles.progressCard}>
        <Text style={styles.progressTitle}>Oturum akışı</Text>
        <Text style={styles.progressText}>Backend’de ayrı study endpoint’i henüz yok. Bu yüzden ekran şu an kullanıcı seviyesi + kelime havuzu verisini kullanarak çalışma akışını simüle ediyor.</Text>
        <Text style={styles.progressMeta}>
          Hedef: {(overview?.newWordCount ?? user?.dailyNewWords ?? studyWords.length) || 0} yeni kelime
        </Text>
        <Text style={styles.progressMeta}>Tahmini toplam kart: {overview?.estimatedTotal ?? studyWords.length}</Text>
        <Text style={styles.progressMeta}>Anlık doğru sayısı: {correctCount}</Text>
        {session ? (
          <Text style={styles.progressMeta}>Oturum kimliği: {session.sessionId}</Text>
        ) : null}
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: radius.pill,
    backgroundColor: palette.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  badgeText: {
    ...typography.caption,
    color: palette.primary,
  },
  word: {
    ...typography.display,
    color: palette.text,
    textTransform: 'lowercase',
  },
  hint: {
    ...typography.body,
    color: palette.textMuted,
  },
  assetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  assetChip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: palette.backgroundElevated,
  },
  assetText: {
    ...typography.caption,
    color: palette.textMuted,
  },
  feedbackText: {
    ...typography.body,
    color: palette.text,
  },
  actionsRow: {
    gap: spacing.sm,
  },
  progressMeta: {
    ...typography.caption,
    color: palette.textFaint,
  },
  progressCard: {
    gap: spacing.sm,
  },
  progressTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  progressText: {
    ...typography.body,
    color: palette.textMuted,
  },
});
