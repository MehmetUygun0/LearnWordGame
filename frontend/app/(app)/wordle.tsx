// @ts-nocheck
import React, { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import * as ExpoRouter from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { BackHeader } from '@/components/ui/BackHeader';
import { ConfettiBurst } from '@/components/ui/ConfettiBurst';
import { FlipTile } from '@/components/ui/FlipTile';
import { RewardBurst } from '@/components/ui/RewardBurst';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { palette, radius, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { evaluateGuess, getWordleToday, WordleGuess } from '@/services/play';

export default function WordleScreen() {
  const router = ExpoRouter.useRouter();
  const { token } = useAuth();
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(6);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<WordleGuess[]>([]);
  const [notice, setNotice] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [rewardVisible, setRewardVisible] = useState(false);

  useEffect(() => {
    const loadWordle = async () => {
      const today = await getWordleToday(token);
      setAnswer(today.answer);
      setHint(today.hint);
      setMaxAttempts(today.maxAttempts ?? 6);
      setGuesses(today.guesses);
    };

    loadWordle();
  }, [token]);

  const handleGuess = async () => {
    const cleanGuess = guess.trim().toLowerCase();

    if (isSolved) {
      return;
    }

    if (!answer || cleanGuess.length !== answer.length) {
      setNotice(`${answer.length || 5} harfli bir kelime yaz.`);
      return;
    }

    const nextGuess = evaluateGuess(cleanGuess, answer);
    setGuesses((current) => [...current, nextGuess]);
    setGuess('');

    if (nextGuess.guess === answer) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSolved(true);
      setConfettiActive((active) => !active);
      setRewardVisible(true);
      setNotice('Harika! Günün kelimesi çözüldü.');
    } else {
      await Haptics.selectionAsync();
      setNotice(guesses.length + 1 >= maxAttempts ? `Cevap: ${answer}` : 'Yaklaştın. Renkleri takip et.');
    }
  };

  return (
    <ScreenContainer scrollable withBackgroundDecor>
      <BackHeader title="Mini oyunlar" />
      <ConfettiBurst active={confettiActive} />
      <RewardBurst visible={rewardVisible} label="+Wordle" />
      <SectionHeader
        eyebrow="Wordle"
        title="Günün kelimesi"
        description={`İpucu: ${hint || 'yükleniyor'}`}
      />

      <SurfaceCard accent="primary">
        <View style={styles.attemptRow}>
          <Text style={styles.title}>Deneme</Text>
          <Text style={styles.attemptText}>{Math.min(guesses.length + (isSolved ? 0 : 1), maxAttempts)} / {maxAttempts}</Text>
        </View>
        {isSolved ? (
          <View style={styles.winCard}>
            <Text style={styles.winEmoji}>✓</Text>
            <View style={styles.winTextBlock}>
              <Text style={styles.winTitle}>Günün kelimesi çözüldü</Text>
              <Text style={styles.notice}>{guesses.length}. denemede buldun. Kelime: {answer}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.board}>
          {guesses.map((item, rowIndex) => (
            <View key={`${item.guess}-${rowIndex}`} style={styles.letterRow}>
              {item.letters.map((letter, index) => (
                <FlipTile
                  key={`${letter.letter}-${index}`}
                  trigger={`${guesses.length}-${item.guess}`}
                  delay={index * 90}>
                  <View style={[styles.letterBox, letterStyles[letter.state]]}>
                    <Text style={styles.letterText}>{letter.letter.toUpperCase()}</Text>
                  </View>
                </FlipTile>
              ))}
            </View>
          ))}
        </View>

        <AppInput
          label="Tahminin"
          placeholder={answer ? `${answer.length} harf` : 'kelime'}
          value={guess}
          onChangeText={setGuess}
          editable={!isSolved}
        />
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        <AppButton
          label={isSolved ? 'Çözüldü' : 'Tahmin et'}
          icon={isSolved ? 'checkmark-circle-outline' : 'send-outline'}
          onPress={handleGuess}
          disabled={isSolved}
        />
      </SurfaceCard>

      <SurfaceCard muted>
        <Text style={styles.title}>Renk rehberi</Text>
        <View style={styles.legendRow}>
          <Legend color={palette.success} label="Doğru yer" />
          <Legend color={palette.warning} label="Kelime içinde" />
          <Legend color={palette.border} label="Yok" />
        </View>
      </SurfaceCard>
      <AppButton label="Ana sayfaya dön" variant="secondary" icon="arrow-back-outline" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

function Legend({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.notice}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    gap: spacing.sm,
  },
  attemptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.pill,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  attemptText: {
    ...typography.label,
    color: palette.accent,
  },
  winCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.limeSoft,
    borderWidth: 1,
    borderColor: palette.lime,
    padding: spacing.md,
  },
  winEmoji: {
    ...typography.title,
    color: palette.lime,
  },
  winTextBlock: {
    flex: 1,
  },
  winTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  letterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  letterBox: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: palette.surface,
  },
  letterText: {
    ...typography.cardTitle,
    color: palette.text,
  },
  notice: {
    ...typography.caption,
    color: palette.textMuted,
  },
  title: {
    ...typography.cardTitle,
    color: palette.text,
  },
  legendRow: {
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});

const letterStyles = StyleSheet.create({
  correct: {
    backgroundColor: palette.success,
  },
  present: {
    backgroundColor: palette.warning,
  },
  missing: {
    backgroundColor: palette.border,
  },
});
