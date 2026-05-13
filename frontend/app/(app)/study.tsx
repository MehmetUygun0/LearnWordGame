// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { AppButton } from '@/components/ui/AppButton';
import { ConfettiBurst } from '@/components/ui/ConfettiBurst';
import { AppInput } from '@/components/ui/AppInput';
import { ProgressMeter } from '@/components/ui/ProgressMeter';
import { RewardBurst } from '@/components/ui/RewardBurst';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StageTimeline } from '@/components/ui/StageTimeline';
import { StatCard } from '@/components/ui/StatCard';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';
import {
  StudyOverview,
  StudyQuestion,
  StudySession,
  getReviewSteps,
  submitStudyAnswer,
  getStudyOverview,
  startStudySession,
} from '@/services/study';

export default function StudyScreen() {
  const { user } = useAuth();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [studyWords, setStudyWords] = useState<StudyQuestion[]>([]);
  const [overview, setOverview] = useState<StudyOverview | null>(null);
  const [session, setSession] = useState<StudySession | null>(null);
  const [reward, setReward] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const cardAnim = useRef(new Animated.Value(1)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const trophyScale = useRef(new Animated.Value(0.82)).current;

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
        setXp(nextOverview.xp);
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
  const isSessionCompleted = currentIndex >= studyWords.length && studyWords.length > 0;
  const progress = isSessionCompleted ? 1 : (currentIndex + 1) / totalWords;

  useEffect(() => {
    if (isSessionCompleted) {
      setConfettiActive((active) => !active);
      Animated.spring(trophyScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      trophyScale.setValue(0.82);
    }
  }, [isSessionCompleted, trophyScale]);

  const animateNext = useCallback(() => {
    Animated.sequence([
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardAnim]);

  const handleNext = useCallback(() => {
    if (!studyWords.length) {
      return;
    }

    animateNext();
    flipAnim.setValue(0);
    setIsCardFlipped(false);
    setAnswer('');
    setFeedback('');
    setReward('');
    setIsAnswered(false);
    setCurrentIndex((prev) => prev + 1);
  }, [animateNext, flipAnim, studyWords.length]);

  const handleSubmit = useCallback(async (nextAnswer = answer) => {
    if (!currentWord || isAnswered) {
      return;
    }

    const result = submitStudyAnswer({
      answer: nextAnswer,
      word: currentWord,
      index: currentIndex,
    });

    setIsAnswered(true);
    setXp((currentXp) => currentXp + result.xpEarned);

    if (result.isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setReward(`+${result.xpEarned} XP`);
      setConfettiActive((active) => !active);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setReward('+5 XP');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    setFeedback(
      result.isCorrect
        ? `${result.currentStepLabel}. Sonraki tekrar: ${result.nextReviewLabel}.`
        : `Doğru cevap: ${result.correctAnswer}. Bu kelime tekrar listesine döndü.`
    );

    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      if (currentIndex + 1 < studyWords.length) {
        handleNext();
      }
    }, 1050);
  }, [answer, currentIndex, currentWord, flipAnim, handleNext, isAnswered, studyWords.length]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
        onPanResponderRelease: async (_, gesture) => {
          if (!currentWord || isAnswered) {
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
            return;
          }

          if (gesture.dx > 96) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Animated.timing(pan, {
              toValue: { x: 420, y: 0 },
              duration: 220,
              useNativeDriver: true,
            }).start(() => {
              pan.setValue({ x: 0, y: 0 });
              handleSubmit(currentWord.turWordName);
            });
            return;
          }

          if (gesture.dx < -96) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.timing(pan, {
              toValue: { x: -420, y: 0 },
              duration: 220,
              useNativeDriver: true,
            }).start(() => {
              pan.setValue({ x: 0, y: 0 });
              handleSubmit('__repeat__');
            });
            return;
          }

          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        },
      }),
    [currentWord, handleSubmit, isAnswered, pan]
  );

  return (
    <ScreenContainer scrollable withBackgroundDecor>
      <ConfettiBurst active={confettiActive} />
      <RewardBurst visible={Boolean(reward)} label={reward || '+XP'} />
      <SectionHeader
        eyebrow="Çalış"
        title="Streak’i yak"
        description={`${user?.level ?? 'A1'} seviyesi için hızlı, kısa ve ödüllü kartlar.`}
      />

      <AnimatedCard>
        <View style={styles.statsRow}>
          <StatCard eyebrow="Seri" value={`${overview?.streakDays ?? 0}`} detail="gün" accent="electric" />
          <StatCard eyebrow="XP" value={`${xp}`} detail="toplam" accent="accent" />
        </View>
      </AnimatedCard>

      {isLoading ? (
        <SurfaceCard muted style={styles.loadingState}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.loadingText}>Oturum hazırlanıyor...</Text>
        </SurfaceCard>
      ) : isSessionCompleted ? (
        <Animated.View style={{ transform: [{ scale: trophyScale }] }}>
          <SurfaceCard accent="success">
            <View style={styles.completeIcon}>
              <Ionicons name="trophy-outline" size={28} color={palette.background} />
            </View>
            <Text style={styles.progressTitle}>Seri tamamlandı</Text>
            <Text style={styles.progressText}>
              {studyWords.length} kart bitti. {correctCount} doğru cevapla ödül topladın.
            </Text>
            <View style={styles.bigXpBox}>
              <Text style={styles.resultLabel}>Kazanılan XP</Text>
              <AnimatedNumber value={correctCount * 20} prefix="+" style={styles.bigXp} />
            </View>
            <View style={styles.shareCard}>
              <View style={styles.shareIcon}>
                <Ionicons name="sparkles-outline" size={18} color={palette.background} />
              </View>
              <View style={styles.shareBody}>
                <Text style={styles.shareTitle}>Bugünün başarı kartı</Text>
                <Text style={styles.progressText}>
                  {correctCount}/{studyWords.length} doğru • {overview?.streakDays ?? 0} günlük seri • +{correctCount * 20} XP
                </Text>
              </View>
            </View>
            <View style={styles.resultRow}>
              <View style={styles.resultBox}>
                <Text style={styles.resultValue}>{correctCount}</Text>
                <Text style={styles.resultLabel}>Doğru</Text>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultValue}>{studyWords.length - correctCount}</Text>
                <Text style={styles.resultLabel}>Tekrar</Text>
              </View>
            </View>
            <AppButton
              label="Yeni seri başlat"
              icon="refresh-outline"
              onPress={() => {
                setCurrentIndex(0);
                setCorrectCount(0);
                setAnswer('');
                setFeedback('');
                setReward('');
                setIsAnswered(false);
              }}
            />
          </SurfaceCard>
        </Animated.View>
      ) : !currentWord ? (
        <SurfaceCard muted style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons name="sparkles-outline" size={22} color={palette.accent} />
          </View>
          <Text style={styles.progressTitle}>Bugünlük temiz</Text>
          <Text style={styles.progressText}>Yeni tekrar zamanı geldiğinde kartların burada parlayacak.</Text>
        </SurfaceCard>
      ) : (
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            opacity: cardAnim,
            transform: [
              { translateX: pan.x },
              {
                translateX: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-28, 0],
                }),
              },
              {
                rotate: pan.x.interpolate({
                  inputRange: [-160, 0, 160],
                  outputRange: ['-7deg', '0deg', '7deg'],
                  extrapolate: 'clamp',
                }),
              },
              {
                rotate: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-2deg', '0deg'],
                }),
              },
            ],
          }}>
          <SurfaceCard style={styles.studyCard} accent="primary">
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{currentIndex + 1} / {totalWords}</Text>
              </View>
              <View style={styles.modeBadge}>
                <Text style={styles.modeText}>
                  {currentWord.questionType === 'multiple-choice' ? 'Seçmeli' : 'Yazmalı'}
                </Text>
              </View>
            </View>

            <ProgressMeter progress={progress} />
            <StageTimeline
              stage={currentWord.stage ?? 0}
              nextReviewLabel={getReviewSteps()[Math.min((currentWord.stage ?? 0) + 1, 6)]}
            />

            <Animated.View
              style={[
                styles.wordPanel,
                {
                  transform: [
                    {
                      rotateY: flipAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                },
              ]}>
              <View style={styles.wordGlow} />
              {!feedback && !isCardFlipped ? (
                <>
                  <Pressable
                    onPress={() => {
                      setIsCardFlipped(true);
                      Animated.spring(flipAnim, {
                        toValue: 1,
                        friction: 8,
                        tension: 70,
                        useNativeDriver: true,
                      }).start();
                    }}>
                  <Text style={styles.word}>{currentWord.engWordName}</Text>
                  <Text style={styles.hint}>{currentWord.samples[0] || 'Bu kelime için örnek cümle eklenebilir.'}</Text>
                  <Text style={styles.tapHint}>Dokun: çevir • Sağa: biliyorum • Sola: tekrar</Text>
                  </Pressable>
                </>
              ) : (
                <View style={styles.backFace}>
                  <Text style={styles.backLabel}>Karşılık</Text>
                  <Text style={styles.word}>{currentWord.turWordName}</Text>
                  <Text style={styles.hint}>{feedback || currentWord.samples[0] || 'Örnek cümle eklenebilir.'}</Text>
                </View>
              )}
            </Animated.View>

            {currentWord.questionType === 'multiple-choice' ? (
              <View style={styles.optionGrid}>
                {currentWord.options.map((option) => {
                  const isSelected = answer === option;

                  return (
                    <Pressable
                      key={option}
                      disabled={isAnswered}
                      onPress={() => {
                        setAnswer(option);
                        handleSubmit(option);
                      }}
                      style={[styles.optionChip, isSelected && styles.optionChipActive]}>
                      <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <>
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
                />
                <AppButton
                  label="Cevabı kontrol et"
                  icon="checkmark-circle-outline"
                  onPress={() => handleSubmit()}
                  disabled={!answer.trim() || isAnswered}
                />
              </>
            )}

            {feedback ? (
              <Text style={[styles.feedbackText, feedback.includes('doğru tekrar') && styles.feedbackSuccess]}>
                {feedback}
              </Text>
            ) : null}
          </SurfaceCard>
        </Animated.View>
      )}

      {session ? (
        <SurfaceCard muted style={styles.progressCard}>
          <Text style={styles.progressTitle}>Oturum özeti</Text>
          <Text style={styles.progressMeta}>Toplam kart: {overview?.estimatedTotal ?? studyWords.length}</Text>
          <Text style={styles.progressMeta}>Anlık doğru: {correctCount}</Text>
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
  loadingState: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.body,
    color: palette.textMuted,
  },
  studyCard: {
    gap: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: radius.pill,
    backgroundColor: palette.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  badgeText: {
    ...typography.label,
    color: palette.primary,
  },
  modeBadge: {
    borderRadius: radius.pill,
    backgroundColor: palette.electricSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  modeText: {
    ...typography.label,
    color: palette.electric,
  },
  wordPanel: {
    borderRadius: radius.xl,
    backgroundColor: palette.backgroundElevated,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  wordGlow: {
    position: 'absolute',
    top: -36,
    right: -30,
    width: 98,
    height: 98,
    borderRadius: 32,
    backgroundColor: palette.primarySoft,
    transform: [{ rotate: '18deg' }],
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
  revealAnswer: {
    ...typography.label,
    color: palette.lime,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: palette.limeSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
  },
  tapHint: {
    ...typography.caption,
    color: palette.textFaint,
  },
  backFace: {
    transform: [{ rotateY: '180deg' }],
    gap: spacing.sm,
  },
  backLabel: {
    ...typography.label,
    color: palette.lime,
    textTransform: 'uppercase',
  },
  optionGrid: {
    gap: spacing.sm,
  },
  optionChip: {
    minHeight: 52,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  optionChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryStrong,
  },
  optionText: {
    ...typography.label,
    color: palette.textMuted,
  },
  optionTextActive: {
    color: palette.text,
  },
  feedbackText: {
    ...typography.body,
    color: palette.text,
    borderRadius: radius.md,
    backgroundColor: palette.backgroundElevated,
    padding: spacing.md,
  },
  feedbackSuccess: {
    color: palette.success,
  },
  completeIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: palette.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigXpBox: {
    borderRadius: radius.xl,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  bigXp: {
    ...typography.display,
    color: palette.lime,
  },
  shareCard: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: palette.limeSoft,
    borderWidth: 1,
    borderColor: palette.lime,
    padding: spacing.md,
  },
  shareIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: palette.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBody: {
    flex: 1,
  },
  shareTitle: {
    ...typography.label,
    color: palette.text,
  },
  emptyCard: {
    alignItems: 'center',
    minHeight: 180,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  resultBox: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    padding: spacing.md,
  },
  resultValue: {
    ...typography.title,
    color: palette.text,
  },
  resultLabel: {
    ...typography.caption,
    color: palette.textMuted,
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
  progressMeta: {
    ...typography.body,
    color: palette.textMuted,
  },
});
