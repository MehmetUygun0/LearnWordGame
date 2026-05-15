import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { AppInput } from "../../components/ui/AppInput";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { palette, radius, spacing, typography } from "../../constants/theme";
import { evaluateAnswer, getStudyOverview, getTodayStudySet, StudyQuestion } from "../../services/study";

export default function StudyScreen() {
  const [questions, setQuestions] = useState<StudyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [overview, setOverview] = useState({ todayNewWords: 0, todayReviewWords: 0, totalQuestions: 0, successRate: 0 });

  useEffect(() => {
    getStudyOverview().then(setOverview);
    getTodayStudySet().then(setQuestions);
  }, []);

  const currentQuestion = questions[currentIndex];
  const isDone = currentIndex >= questions.length && questions.length > 0;

  function handleSubmit() {
    if (!currentQuestion) {
      return;
    }

    const result = evaluateAnswer(currentQuestion, answer);
    if (result.isCorrect) {
      setCorrectCount((value) => value + 1);
      setFeedback(`Dogru. Sonraki tekrar: ${result.nextDueLabel}.`);
    } else {
      setFeedback(`Yanlis. Dogru cevap: ${result.correctAnswer}. Akis basa doner.`);
    }
  }

  function handleNext() {
    setAnswer("");
    setFeedback("");
    setCurrentIndex((value) => value + 1);
  }

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Story 3"
        title="6 tekrar quiz oturumu"
        description="Yanlis cevapta stage sifirlanir, dogru cevapta sonraki review araligina gecilir."
      />
      <SurfaceCard muted>
        <Text style={styles.meta}>
          Yeni: {overview.todayNewWords} - Tekrar: {overview.todayReviewWords} - Toplam: {overview.totalQuestions}
        </Text>
      </SurfaceCard>
      {isDone ? (
        <SurfaceCard>
          <Text style={styles.title}>Oturum tamamlandi</Text>
          <Text style={styles.body}>
            Dogru sayisi: {correctCount} / {questions.length}
          </Text>
        </SurfaceCard>
      ) : currentQuestion ? (
        <SurfaceCard>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                Sira {currentIndex + 1} / {questions.length}
              </Text>
            </View>
            <Text style={styles.stage}>Stage {currentQuestion.stage}</Text>
          </View>
          <Text style={styles.word}>{currentQuestion.engWordName}</Text>
          <Text style={styles.body}>Ornek: {currentQuestion.samples[0] ?? "Ornek cumle yakinda."}</Text>
          <Text style={styles.body}>Siradaki tekrar zamani: {currentQuestion.dueLabel}</Text>
          <AppInput label="Turkce karsiligi" value={answer} onChangeText={setAnswer} />
          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
          <AppButton label="Cevabi gonder" onPress={handleSubmit} />
          <AppButton label="Sonraki soru" variant="secondary" onPress={handleNext} />
        </SurfaceCard>
      ) : (
        <SurfaceCard>
          <Text style={styles.body}>Bugunluk soru havuzu yukleniyor.</Text>
        </SurfaceCard>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  meta: { ...typography.caption, color: palette.textMuted },
  badgeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: { borderRadius: radius.pill, backgroundColor: palette.primarySoft, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  badgeText: { ...typography.caption, color: palette.text },
  stage: { ...typography.caption, color: palette.secondary },
  word: { ...typography.display, color: palette.text },
  title: { ...typography.title, color: palette.text },
  body: { ...typography.body, color: palette.textMuted },
  feedback: { ...typography.body, color: palette.warning }
});
