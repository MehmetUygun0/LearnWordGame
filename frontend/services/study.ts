// @ts-nocheck
import { WordListItem, getWordsForLevel } from '@/services/words';

export type StudyOverview = {
  level: string;
  newWordCount: number;
  reviewWordCount: number;
  estimatedTotal: number;
  streakDays: number;
  xp: number;
  challengeTitle: string;
  source: 'mock';
};

export type StudyQuestion = WordListItem & {
  questionType: 'write' | 'multiple-choice';
  options: string[];
};

export type StudySession = {
  sessionId: string;
  items: StudyQuestion[];
  source: 'mock';
};

export type StudyAnswerResult = {
  isCorrect: boolean;
  correctAnswer: string;
  nextReviewLabel: string;
  currentStep: number;
  currentStepLabel: string;
  xpEarned: number;
  badgeLabel?: string;
  source: 'mock';
};

type StudyInput = {
  level?: string;
  dailyNewWords?: number;
};

const reviewSteps = ['Yeni', '1 gün', '1 hafta', '1 ay', '3 ay', '6 ay', '1 yıl'];

export const getReviewSteps = () => reviewSteps;

export const getStudyOverview = async ({
  level,
  dailyNewWords,
}: StudyInput): Promise<StudyOverview> => {
  const words = await getWordsForLevel(level);
  const safeDailyLimit = Math.max(Math.min(dailyNewWords ?? 6, words.length || 6), 0);
  const newWordCount = Math.min(safeDailyLimit || words.length, words.length);
  const reviewWordCount = Math.min(Math.max(words.length - newWordCount, 0), 3);

  return {
    level: level ?? 'A1',
    newWordCount,
    reviewWordCount,
    estimatedTotal: newWordCount + reviewWordCount,
    streakDays: 5,
    xp: 1240,
    challengeTitle: '5 kartlık hızlı seri',
    source: 'mock',
  };
};

export const startStudySession = async ({
  level,
  dailyNewWords,
}: StudyInput): Promise<StudySession> => {
  const words = await getWordsForLevel(level);
  const allWords = await getWordsForLevel();
  const safeDailyLimit = Math.max(Math.min(dailyNewWords ?? 6, words.length || 6), 1);

  return {
    sessionId: `session-${level ?? 'A1'}-${safeDailyLimit}`,
    items: words.slice(0, safeDailyLimit).map((word, index) => ({
      ...word,
      questionType: index % 2 === 0 ? 'multiple-choice' : 'write',
      options: buildOptions(word, allWords),
    })),
    source: 'mock',
  };
};

export const submitStudyAnswer = ({
  answer,
  word,
  index,
}: {
  answer: string;
  word: WordListItem;
  index: number;
}): StudyAnswerResult => {
  const normalizedAnswer = answer.trim().toLocaleLowerCase('tr-TR');
  const normalizedCorrect = word.turWordName.trim().toLocaleLowerCase('tr-TR');
  const isCorrect = normalizedAnswer === normalizedCorrect;
  const currentStep = isCorrect ? Math.min((word.stage ?? index) + 1, 6) : 0;

  return {
    isCorrect,
    correctAnswer: word.turWordName,
    nextReviewLabel: isCorrect ? (reviewSteps[currentStep + 1] ?? 'Tamamlandı') : 'Bugün tekrar',
    currentStep,
    currentStepLabel: isCorrect ? `${currentStep}/6 doğru tekrar` : 'Tekrar listesine döndü',
    xpEarned: isCorrect ? 20 + currentStep * 5 : 5,
    badgeLabel: isCorrect && currentStep >= 3 ? 'Seri devam ediyor' : undefined,
    source: 'mock',
  };
};

const buildOptions = (word: WordListItem, allWords: WordListItem[]) => {
  const distractors = allWords
    .filter((item) => item.id !== word.id)
    .map((item) => item.turWordName)
    .slice(0, 3);

  return [word.turWordName, ...distractors].sort((left, right) => left.localeCompare(right, 'tr'));
};
