// @ts-nocheck
import { AuthUser } from '@/services/auth';
import { WordLevel } from '@/services/words';

export type SettingsSummary = {
  level: WordLevel;
  dailyNewWords: number;
  dailyQuestionCount: number;
  difficulty: 'Kolay' | 'Dengeli' | 'Zor';
  totalLearnedWords: number;
  canEdit: boolean;
  source: 'profile';
};

export const getSettingsSummary = async (user: AuthUser | null): Promise<SettingsSummary> => {
  return {
    level: normalizeLevel(user?.level),
    dailyNewWords: user?.dailyNewWords ?? 6,
    dailyQuestionCount: Math.max((user?.dailyNewWords ?? 6) + 3, 8),
    difficulty: 'Dengeli',
    totalLearnedWords: user?.totalLearnedWords ?? 0,
    canEdit: true,
    source: 'profile',
  };
};

const normalizeLevel = (level?: string): WordLevel => {
  if (['A1', 'A2', 'B1', 'B2', 'C1'].includes(level ?? '')) {
    return level as WordLevel;
  }

  return 'A1';
};
