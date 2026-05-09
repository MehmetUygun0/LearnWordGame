// @ts-nocheck
import { AuthUser } from '@/services/auth';
import { getStudyOverview } from '@/services/study';
import { getWordsForLevel } from '@/services/words';

export type DashboardSummary = {
  userName: string;
  initials: string;
  level: string;
  learnedWords: number;
  dailyNewWords: number;
  levelLibraryCount: number;
  todayEstimatedCount: number;
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
    dailyNewWords: user?.dailyNewWords ?? 0,
    levelLibraryCount: words.length,
    todayEstimatedCount: overview.estimatedTotal,
    source: 'profile+mock',
  };
};
