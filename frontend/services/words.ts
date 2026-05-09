// @ts-nocheck
import config from '@/lib/config';
import { apiRequest, getErrorMessage, readResponsePayload } from '@/lib/api';
export type WordLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type WordListItem = {
  id: number;
  engWordName: string;
  turWordName: string;
  level: WordLevel;
  pictureUrl?: string | null;
  audioUrl?: string | null;
  samples: string[];
};

const mockWords: WordListItem[] = [
  {
    id: 1,
    engWordName: 'abandon',
    turWordName: 'terk etmek',
    level: 'B1',
    pictureUrl: null,
    audioUrl: null,
    samples: ['He had to abandon the car in the snow.'],
  },
  {
    id: 2,
    engWordName: 'journey',
    turWordName: 'yolculuk',
    level: 'A2',
    pictureUrl: null,
    audioUrl: null,
    samples: ['The journey took three hours.'],
  },
  {
    id: 3,
    engWordName: 'route',
    turWordName: 'rota',
    level: 'A1',
    pictureUrl: null,
    audioUrl: null,
    samples: ['This route is shorter than the old one.'],
  },
  {
    id: 4,
    engWordName: 'resilient',
    turWordName: 'dayanıklı',
    level: 'B2',
    pictureUrl: null,
    audioUrl: null,
    samples: ['Children are often more resilient than adults expect.'],
  },
  {
    id: 5,
    engWordName: 'articulate',
    turWordName: 'ifade etmek',
    level: 'C1',
    pictureUrl: null,
    audioUrl: null,
    samples: ['She can articulate her ideas clearly.'],
  },
];

const levelOrder: WordLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const userAddedWords: WordListItem[] = [];

export const getWords = async () => {
  // Backend tarafında henüz liste endpoint'i olmadığı için ekran fallback kelime havuzu ile çalışıyor.
  return [...userAddedWords, ...mockWords].map(normalizeWord).sort(sortByLevel);
};

export const addWord = async ({
  engWordName,
  turWordName,
  picture,
  level,
  samples,
  token,
}: {
  engWordName: string;
  turWordName: string;
  picture?: string;
  level: WordLevel;
  samples: string[];
  token?: string | null;
}) => {
  const nextWord = normalizeWord({
    id: Date.now(),
    engWordName: engWordName.trim(),
    turWordName: turWordName.trim(),
    pictureUrl: picture?.trim() || null,
    level,
    samples: samples.map((sample) => sample.trim()).filter(Boolean),
  });

  if (token && token !== 'demo-session') {
    const response = await apiRequest({
      endpoint: config.ENDPOINTS.WORDS.ADD,
      method: 'POST',
      token,
      body: JSON.stringify({
        engWordName: nextWord.engWordName,
        turWordName: nextWord.turWordName,
        picture: nextWord.pictureUrl,
        level: nextWord.level,
        samples: nextWord.samples,
      }),
    });

    const payload = await readResponsePayload(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(payload, 'Kelime eklenemedi.'));
    }

    if (payload && typeof payload === 'object' && typeof payload.id === 'number') {
      nextWord.id = payload.id;
    }
  }

  userAddedWords.unshift(nextWord);
  return nextWord;
};

const normalizeWord = (item: any): WordListItem => ({
  id: Number(item.id),
  engWordName: String(item.engWordName ?? item.englishWord ?? ''),
  turWordName: String(item.turWordName ?? item.turkishWord ?? ''),
  level: normalizeLevel(item.level),
  pictureUrl: item.pictureUrl ?? item.picture ?? null,
  audioUrl: item.audioUrl ?? null,
  samples: Array.isArray(item.samples)
    ? item.samples.map((sample: unknown) => String(sample))
    : Array.isArray(item.wordSamples)
      ? item.wordSamples.map((sample: any) => String(sample.samples ?? sample))
      : [],
});

const normalizeLevel = (level: unknown): WordLevel => {
  if (typeof level === 'string' && levelOrder.includes(level as WordLevel)) {
    return level as WordLevel;
  }

  return 'A1';
};

const sortByLevel = (left: WordListItem, right: WordListItem) =>
  levelOrder.indexOf(left.level) - levelOrder.indexOf(right.level);

export const getWordsForLevel = async (level?: string) => {
  const words = await getWords();

  if (!level || !levelOrder.includes(level as WordLevel)) {
    return words;
  }

  return words.filter((word) => word.level === level);
};

export const getDefaultWordByLevel = async (level?: string) => {
  const filteredWords = await getWordsForLevel(level);
  return filteredWords[0] ?? mockWords[0];
};
