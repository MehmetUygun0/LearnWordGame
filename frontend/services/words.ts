import { getErrorMessage } from '@/lib/api';
import { fetchDailyWords, fetchMyWords, postUserWord, postWordTestResults } from '@/services/api/words-api';

export type WordLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type WordListItem = {
  id: number;
  engWordName: string;
  turWordName: string;
  level: WordLevel;
  pictureUrl?: string | null;
  audioUrl?: string | null;
  samples: string[];
  stage?: number;
  successCount?: number;
  wrongCount?: number;
  lastResult?: 'correct' | 'wrong' | 'new';
  nextReviewLabel?: string;
};

export type WordDraft = {
  engWordName: string;
  turWordName: string;
  level: WordLevel;
  samples: string[];
  generatedImageUrl?: string | null;
  audioUrl?: string | null;
};

const mockWords: WordListItem[] = [
  {
    id: 1,
    engWordName: 'abandon',
    turWordName: 'terk etmek',
    level: 'B1',
    pictureUrl: null,
    audioUrl: null,
    samples: ['He had to abandon the car in the snow.', 'Never abandon your plan too early.'],
    stage: 3,
    successCount: 4,
    wrongCount: 2,
    lastResult: 'wrong',
    nextReviewLabel: 'Bugün',
  },
  {
    id: 2,
    engWordName: 'journey',
    turWordName: 'yolculuk',
    level: 'A2',
    pictureUrl: null,
    audioUrl: null,
    samples: ['The journey took three hours.', 'Learning is a long journey.'],
    stage: 4,
    successCount: 7,
    wrongCount: 1,
    lastResult: 'correct',
    nextReviewLabel: '1 hafta',
  },
  {
    id: 3,
    engWordName: 'route',
    turWordName: 'rota',
    level: 'A1',
    pictureUrl: null,
    audioUrl: null,
    samples: ['This route is shorter than the old one.', 'We changed our route.'],
    stage: 2,
    successCount: 3,
    wrongCount: 0,
    lastResult: 'correct',
    nextReviewLabel: 'Yarın',
  },
  {
    id: 4,
    engWordName: 'resilient',
    turWordName: 'dayanıklı',
    level: 'B2',
    pictureUrl: null,
    audioUrl: null,
    samples: ['Children are often more resilient than adults expect.'],
    stage: 1,
    successCount: 1,
    wrongCount: 3,
    lastResult: 'wrong',
    nextReviewLabel: 'Bugün',
  },
  {
    id: 5,
    engWordName: 'articulate',
    turWordName: 'ifade etmek',
    level: 'C1',
    pictureUrl: null,
    audioUrl: null,
    samples: ['She can articulate her ideas clearly.'],
    stage: 5,
    successCount: 8,
    wrongCount: 1,
    lastResult: 'correct',
    nextReviewLabel: '1 ay',
  },
];

const levelOrder: WordLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const userCreatedWords: WordListItem[] = [];

export const getWords = async (token?: string | null) => {
  if (token && token !== 'demo-session') {
    try {
      const { response, payload } = await fetchMyWords(token);

      if (response.ok && Array.isArray(payload) && payload.length) {
        return payload.map(normalizeWord).sort(sortByLevel);
      }
    } catch {
      // Backend erişilemezse ekranlar demo havuzuyla kullanılabilir kalır.
    }
  }

  return [...userCreatedWords, ...mockWords.map(normalizeWord)].sort(sortByLevel);
};

export const getDailyWords = async (token?: string | null) => {
  if (token && token !== 'demo-session') {
    try {
      const { response, payload } = await fetchDailyWords(token);

      if (!response.ok) {
        throw new Error(getErrorMessage(payload, 'Günlük kelimeler alınamadı.'));
      }

      if (Array.isArray(payload) && payload.length) {
        return payload.map(normalizeWord).sort(sortByLevel);
      }
    } catch {
      return getWords(token);
    }
  }

  return getWords(token);
};

export const saveWordTestResults = async ({
  token,
  results,
}: {
  token?: string | null;
  results: { wordId: number; isCorrect: boolean }[];
}) => {
  if (!token || token === 'demo-session' || !results.length) {
    return;
  }

  const { response, payload } = await postWordTestResults(token, results);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Test sonucu kaydedilemedi.'));
  }
};

export const getWordById = async (id: number | string, token?: string | null) => {
  const words = await getWords(token);
  return words.find((word) => String(word.id) === String(id)) ?? words[0];
};

export const createWordPreview = async (draft: WordDraft): Promise<WordListItem> => {
  const word = normalizeWord({
    id: Date.now(),
    engWordName: draft.engWordName,
    turWordName: draft.turWordName,
    level: draft.level,
    pictureUrl: draft.generatedImageUrl ?? null,
    audioUrl: draft.audioUrl ?? null,
    samples: draft.samples,
    stage: 0,
    successCount: 0,
    wrongCount: 0,
    lastResult: 'new',
    nextReviewLabel: 'Yeni',
  });

  userCreatedWords.unshift(word);

  return word;
};

export const createUserWord = async ({
  draft,
  token,
}: {
  draft: WordDraft;
  token?: string | null;
}): Promise<WordListItem> => {
  if (!token || token === 'demo-session') {
    return createWordPreview(draft);
  }

  const { response, payload } = await postUserWord({
    token,
    body: {
      engWordName: draft.engWordName.trim(),
      turWordName: draft.turWordName.trim(),
      level: draft.level,
      picture: draft.generatedImageUrl ?? null,
      samples: draft.samples,
    },
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Kelime backend tarafına kaydedilemedi.'));
  }

  const word = normalizeWord({
    id: payload?.id ?? Date.now(),
    engWordName: draft.engWordName,
    turWordName: draft.turWordName,
    level: draft.level,
    pictureUrl: draft.generatedImageUrl ?? null,
    audioUrl: draft.audioUrl ?? null,
    samples: draft.samples,
    stage: 0,
    successCount: 0,
    wrongCount: 0,
    lastResult: 'new',
    nextReviewLabel: 'Yeni',
  });

  userCreatedWords.unshift(word);

  return word;
};

const normalizeWord = (item: any): WordListItem => ({
  id: Number(item.id ?? item.wordId),
  engWordName: String(item.engWordName ?? item.englishWord ?? ''),
  turWordName: String(item.turWordName ?? item.turkishWord ?? ''),
  level: normalizeLevel(item.level),
  pictureUrl: item.pictureUrl ?? item.picture ?? item.pictureUri ?? null,
  audioUrl: item.audioUrl ?? item.audioUri ?? null,
  samples: Array.isArray(item.samples)
    ? item.samples.map((sample: unknown) => String(sample)).filter(Boolean)
    : Array.isArray(item.wordSamples)
      ? item.wordSamples
          .map((sample: any) => String(sample.samples ?? sample.engSamples ?? sample.turSamples ?? sample))
          .filter(Boolean)
      : [],
  stage: Math.max(0, Math.min(Number(item.stage ?? item.successStage ?? item.currentStep ?? 0), 6)),
  successCount: Number(item.successCount ?? 0),
  wrongCount: Number(item.wrongCount ?? 0),
  lastResult: item.lastResult ?? 'new',
  nextReviewLabel: item.nextReviewLabel ?? 'Yeni',
});

const normalizeLevel = (level: unknown): WordLevel => {
  if (typeof level === 'string' && levelOrder.includes(level as WordLevel)) {
    return level as WordLevel;
  }

  return 'A1';
};

const sortByLevel = (left: WordListItem, right: WordListItem) =>
  levelOrder.indexOf(left.level) - levelOrder.indexOf(right.level);

export const getWordsForLevel = async (level?: string, token?: string | null) => {
  const words = await getWords(token);

  if (!level || !levelOrder.includes(level as WordLevel)) {
    return words;
  }

  return words.filter((word) => word.level === level);
};

export const getDefaultWordByLevel = async (level?: string) => {
  const filteredWords = await getWordsForLevel(level);
  return filteredWords[0] ?? mockWords[0];
};
