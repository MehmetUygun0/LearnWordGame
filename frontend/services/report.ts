// @ts-nocheck
import { AuthUser } from '@/services/auth';
import { getWords } from '@/services/words';

export type ReportSummary = {
  userName: string;
  level: string;
  totalLearnedWords: number;
  dailyNewWords: number;
  correctRate: number;
  reviewDueCount: number;
  progressPercent: number;
  createdAt?: string;
  levelStats: {
    level: string;
    words: number;
  }[];
  stageStats: {
    stage: number;
    label: string;
    words: number;
  }[];
  weeklyTrend: {
    day: string;
    correctRate: number;
  }[];
  difficultWords: {
    id: number;
    word: string;
    wrongCount: number;
    stage: number;
  }[];
  source: 'profile';
};

export const getReportSummary = async (user: AuthUser | null): Promise<ReportSummary> => {
  const words = await getWords();
  const totalLearnedWords = user?.totalLearnedWords ?? words.filter((word) => (word.stage ?? 0) >= 6).length;
  const dailyNewWords = user?.dailyNewWords ?? 6;
  const levelStats =
    user?.levelBasedLearnedWords?.length
      ? user.levelBasedLearnedWords
      : ['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => ({
          level,
          words: words.filter((word) => word.level === level).length,
        }));
  const levelTotal = Math.max(levelStats.reduce((total, item) => total + item.words, 0), 1);
  const totalCorrect = words.reduce((total, word) => total + (word.successCount ?? 0), 0);
  const totalWrong = words.reduce((total, word) => total + (word.wrongCount ?? 0), 0);

  return {
    userName: user?.userName ?? '-',
    level: user?.level ?? 'A1',
    totalLearnedWords,
    dailyNewWords,
    correctRate: totalCorrect + totalWrong ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0,
    reviewDueCount: words.filter((word) => word.nextReviewLabel === 'Bugün').length,
    progressPercent: Math.min(Math.round((totalLearnedWords / levelTotal) * 100), 100),
    createdAt: user?.createdAt,
    levelStats,
    stageStats: Array.from({ length: 7 }).map((_, stage) => ({
      stage,
      label: stage === 0 ? 'Yeni' : `${stage}. adım`,
      words: words.filter((word) => (word.stage ?? 0) === stage).length,
    })),
    weeklyTrend: [
      { day: 'Pzt', correctRate: 62 },
      { day: 'Sal', correctRate: 70 },
      { day: 'Çar', correctRate: 68 },
      { day: 'Per', correctRate: 76 },
      { day: 'Cum', correctRate: 82 },
      { day: 'Cmt', correctRate: 78 },
      { day: 'Paz', correctRate: 86 },
    ],
    difficultWords: words
      .filter((word) => (word.wrongCount ?? 0) > 0)
      .sort((left, right) => (right.wrongCount ?? 0) - (left.wrongCount ?? 0))
      .slice(0, 4)
      .map((word) => ({
        id: word.id,
        word: word.engWordName,
        wrongCount: word.wrongCount ?? 0,
        stage: word.stage ?? 0,
      })),
    source: 'profile',
  };
};
