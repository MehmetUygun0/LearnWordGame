import config from '@/lib/config';
import { apiRequest, getErrorMessage, readResponsePayload } from '@/lib/api';
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

const DEFAULT_DAILY_NEW_WORDS = 10;

export const getSettingsSummary = async (user: AuthUser | null): Promise<SettingsSummary> => {
  const dailyNewWords = user?.dailyNewWords ?? DEFAULT_DAILY_NEW_WORDS;

  return {
    level: normalizeLevel(user?.level),
    dailyNewWords,
    dailyQuestionCount: Math.max(dailyNewWords + 3, 10),
    difficulty: 'Dengeli',
    totalLearnedWords: user?.totalLearnedWords ?? 0,
    canEdit: true,
    source: 'profile',
  };
};

export const updateDailyWordsRequest = async ({
  dailyNewWords,
  token,
}: {
  dailyNewWords: number;
  token?: string | null;
}) => {
  if (!token || token === 'demo-session') {
    return { dailyNewWords };
  }

  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.UPDATE_DAILY_WORDS,
    method: 'PUT',
    token,
    body: JSON.stringify({ dailyNewWords }),
  });
  const payload = await readResponsePayload(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Günlük kelime hedefi güncellenemedi.'));
  }

  return {
    dailyNewWords: Number(payload?.dailyNewWords ?? dailyNewWords),
  };
};

export const updateLevelRequest = async ({
  level,
  token,
}: {
  level: WordLevel;
  token?: string | null;
}) => {
  if (!token || token === 'demo-session') {
    return { level };
  }

  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.UPDATE_LEVEL,
    method: 'PUT',
    token,
    body: JSON.stringify({ level }),
  });
  const payload = await readResponsePayload(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Seviye güncellenemedi.'));
  }

  return { level };
};

const normalizeLevel = (level?: string): WordLevel => {
  if (['A1', 'A2', 'B1', 'B2', 'C1'].includes(level ?? '')) {
    return level as WordLevel;
  }

  return 'A1';
};
