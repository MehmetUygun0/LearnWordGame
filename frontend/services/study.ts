// @ts-nocheck
import { WordListItem, getWordsForLevel } from '@/services/words';

export type StudyOverview = {
  level: string;
  newWordCount: number;
  reviewWordCount: number;
  estimatedTotal: number;
  source: 'mock';
};

export type StudySession = {
  sessionId: string;
  items: WordListItem[];
  source: 'mock';
};

export type StudyAnswerResult = {
  isCorrect: boolean;
  correctAnswer: string;
  nextReviewLabel: string;
  currentStepLabel: string;
  source: 'mock';
};

type StudyInput = {
  level?: string;
  dailyNewWords?: number;
};

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
    source: 'mock',
  };
};

export const startStudySession = async ({
  level,
  dailyNewWords,
}: StudyInput): Promise<StudySession> => {
  const words = await getWordsForLevel(level);
  const safeDailyLimit = Math.max(Math.min(dailyNewWords ?? 6, words.length || 6), 1);

  return {
    sessionId: `mock-session-${level ?? 'A1'}-${safeDailyLimit}`,
    items: words.slice(0, safeDailyLimit),
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

  return {
    isCorrect,
    correctAnswer: word.turWordName,
    nextReviewLabel: isCorrect ? 'Yarın tekrar' : 'Bugün tekrar',
    currentStepLabel: isCorrect ? `Adım ${Math.min(index + 2, 6)}` : 'Adım 1',
    source: 'mock',
  };
};
