import { AuthUser } from '@/services/auth';
import { getStudyOverview } from '@/services/study';
import { getWordsForLevel } from '@/services/words';

export type DashboardSummary = {
  userName: string;
  initials: string;
  level: string;
  learnedWords: number;
  dailyNewWords: number;
  reviewWordCount: number;
  levelLibraryCount: number;
  todayEstimatedCount: number;
  progressPercent: number;
  streakDays: number;
  xp: number;
  challengeTitle: string;
  source: 'profile+mock';
};

export const getDashboardSummary = async (user: AuthUser | null): Promise<DashboardSummary> => {
  const level = user?.level ?? 'A1';
  const words = await getWordsForLevel(level);
  const overview = await getStudyOverview({
    level,
    dailyNewWords: user?.dailyNewWords,
  });

  return {
    userName: user?.userName ?? 'Misafir',
    initials: user?.userName?.slice(0, 2).toUpperCase() || 'OU',
    level,
    learnedWords: user?.totalLearnedWords ?? 0,
    dailyNewWords: user?.dailyNewWords ?? overview.newWordCount,
    reviewWordCount: overview.reviewWordCount,
    levelLibraryCount: words.length,
    todayEstimatedCount: overview.estimatedTotal,
    progressPercent: words.length
      ? Math.min(Math.round(((user?.totalLearnedWords ?? 0) / words.length) * 100), 100)
      : 0,
    streakDays: overview.streakDays,
    xp: overview.xp,
    challengeTitle: overview.challengeTitle,
    source: 'profile+mock',
  };
};
