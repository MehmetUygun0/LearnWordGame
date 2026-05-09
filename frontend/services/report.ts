// @ts-nocheck
import { AuthUser } from '@/services/auth';

export type ReportSummary = {
  userName: string;
  level: string;
  totalLearnedWords: number;
  dailyNewWords: number;
  createdAt?: string;
  levelStats: {
    level: string;
    words: number;
  }[];
  source: 'profile';
};

export const getReportSummary = async (user: AuthUser | null): Promise<ReportSummary> => {
  return {
    userName: user?.userName ?? '-',
    level: user?.level ?? 'A1',
    totalLearnedWords: user?.totalLearnedWords ?? 0,
    dailyNewWords: user?.dailyNewWords ?? 0,
    createdAt: user?.createdAt,
    levelStats:
      user?.levelBasedLearnedWords?.length
        ? user.levelBasedLearnedWords
        : [{ level: user?.level ?? 'A1', words: user?.totalLearnedWords ?? 0 }],
    source: 'profile',
  };
};
