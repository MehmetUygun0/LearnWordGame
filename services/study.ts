// @ts-nocheck
import { WordListItem, getDailyWords, getWordsForLevel, saveWordTestResults } from '@/services/words';

export type StudyOverview = {
  level: string;
  newWordCount: number;
  reviewWordCount: number;
  estimatedTotal: number;
  streakDays: number;
  xp: number;
  challengeTitle: string;
  source: 'api' | 'mock';
};

export type StudyQuestion = WordListItem & {
  questionType: 'write' | 'multiple-choice';
  options: string[];
};

export type StudySession = {
  sessionId: string;
  items: StudyQuestion[];
  source: 'api' | 'mock';
};

export type StudyAnswerResult = {
  isCorrect: boolean;
  correctAnswer: string;
  nextReviewLabel: string;
  currentStep: number;
  currentStepLabel: string;
  xpEarned: number;
  badgeLabel?: string;
  source: 'api' | 'mock';
};

type StudyInput = {
  level?: string;
  dailyNewWords?: number;
  token?: string | null;
};

const reviewSteps = ['Yeni', '1 gün', '1 hafta', '1 ay', '3 ay', '6 ay', '1 yıl'];
const DEFAULT_DAILY_NEW_WORDS = 10;

export const getReviewSteps = () => reviewSteps;

export const getStudyOverview = async ({
  level,
  dailyNewWords,
}: StudyInput): Promise<StudyOverview> => {
  const words = await getWordsForLevel(level);
  const safeDailyLimit = Math.max(Math.min(dailyNewWords ?? DEFAULT_DAILY_NEW_WORDS, words.length || DEFAULT_DAILY_NEW_WORDS), 0);
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
  token,
}: StudyInput): Promise<StudySession> => {
  const words = token && token !== 'demo-session' ? await getDailyWords(token) : await getWordsForLevel(level);
  const allWords = await getWordsForLevel(undefined, token);
  const safeDailyLimit = Math.max(Math.min(dailyNewWords ?? DEFAULT_DAILY_NEW_WORDS, words.length || DEFAULT_DAILY_NEW_WORDS), 1);

  return {
    sessionId: `session-${level ?? 'A1'}-${safeDailyLimit}`,
    items: words.slice(0, safeDailyLimit).map((word, index) => ({
      ...word,
      questionType: index % 2 === 0 ? 'multiple-choice' : 'write',
      options: buildOptions(word, allWords),
    })),
    source: token && token !== 'demo-session' ? 'api' : 'mock',
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
  const currentStep = isCorrect ? Math.min((word.stage ?? 0) + 1, 6) : 0;
  const nextReviewLabel = currentStep >= 6 ? 'Tamamlandı' : reviewSteps[currentStep];

  return {
    isCorrect,
    correctAnswer: word.turWordName,
    nextReviewLabel: isCorrect ? nextReviewLabel : 'Bugün tekrar',
    currentStep,
    currentStepLabel: isCorrect
      ? currentStep >= 6
        ? 'Öğrenildi'
        : `${currentStep}/6 doğru tekrar`
      : 'Tekrar listesine döndü',
    xpEarned: isCorrect ? 20 + currentStep * 5 : 5,
    badgeLabel: isCorrect && currentStep >= 3 ? 'Seri devam ediyor' : undefined,
    source: 'mock',
  };
};

export const saveStudyAnswerResult = async ({
  token,
  wordId,
  isCorrect,
}: {
  token?: string | null;
  wordId: number;
  isCorrect: boolean;
}) => {
  await saveWordTestResults({
    token,
    results: [{ wordId, isCorrect }],
  });
};

const buildOptions = (word: WordListItem, allWords: WordListItem[]) => {
  const distractors = allWords
    .filter((item) => item.id !== word.id)
    .map((item) => item.turWordName)
    .slice(0, 3);

  return [word.turWordName, ...distractors].sort((left, right) => left.localeCompare(right, 'tr'));
};
