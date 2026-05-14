import { getWords, WordListItem } from "./words";

export type StudyOverview = {
  todayNewWords: number;
  todayReviewWords: number;
  totalQuestions: number;
  successRate: number;
};

export type StudyQuestion = WordListItem & {
  stage: number;
  dueLabel: string;
};

const reviewSchedule = ["Bugun", "1 gun", "1 hafta", "1 ay", "3 ay", "6 ay", "1 yil"];

export async function getStudyOverview() {
  return {
    todayNewWords: 10,
    todayReviewWords: 6,
    totalQuestions: 16,
    successRate: 72
  } satisfies StudyOverview;
}

export async function getTodayStudySet() {
  const words = await getWords();
  return words.slice(0, 6).map((word, index) => ({
    ...word,
    stage: index % 6,
    dueLabel: reviewSchedule[index % 6]
  })) satisfies StudyQuestion[];
}

export function evaluateAnswer(question: StudyQuestion, answer: string) {
  const isCorrect =
    answer.trim().toLocaleLowerCase("tr-TR") === question.turWordName.trim().toLocaleLowerCase("tr-TR");

  return {
    isCorrect,
    correctAnswer: question.turWordName,
    nextStage: isCorrect ? Math.min(question.stage + 1, 6) : 0,
    nextDueLabel: isCorrect ? reviewSchedule[Math.min(question.stage + 1, 6)] : "Bugun tekrar"
  };
}
