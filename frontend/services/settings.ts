// @ts-nocheck
import { AuthUser } from '@/services/auth';

export type SettingsSummary = {
  level: string;
  dailyNewWords: number;
  totalLearnedWords: number;
  canEdit: boolean;
  source: 'profile';
};

export const getSettingsSummary = async (user: AuthUser | null): Promise<SettingsSummary> => {
  return {
    level: user?.level ?? 'A1',
    dailyNewWords: user?.dailyNewWords ?? 0,
    totalLearnedWords: user?.totalLearnedWords ?? 0,
    canEdit: false,
    source: 'profile',
  };
};
