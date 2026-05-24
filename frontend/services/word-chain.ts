// @ts-nocheck
import config from '@/lib/config';
import { apiRequest, readResponsePayload } from '@/lib/api';
import { WordListItem, getWords } from '@/services/words';

export type WordChainResult = {
  words: WordListItem[];
  story: string;
  imagePrompt: string;
  imageUri: string;
  source: 'api' | 'local';
};

const fallbackChain = ['brain', 'night', 'tiger', 'robin', 'noble'];

export const createWordChain = async (token?: string | null): Promise<WordChainResult> => {
  if (token && token !== 'demo-session') {
    const response = await apiRequest({
      endpoint: config.ENDPOINTS.WORD_CHAIN.GET,
      method: 'GET',
      token,
    });
    const payload = await readResponsePayload(response);

    if (response.ok && payload?.story) {
      return {
        words: [],
        story: String(payload.story),
        imagePrompt: 'Backend LLM ve görsel çıktısı',
        imageUri: payload.image ? `data:image/png;base64,${payload.image}` : '',
        source: 'api',
      };
    }
  }

  const words = await getWords(token);
  const chainWords = buildChain(words);
  const labels = chainWords.map((word) => word.engWordName);

  return {
    words: chainWords,
    story: buildStory(labels),
    imagePrompt: `A bright educational illustration showing ${labels.join(', ')} in one connected memory story.`,
    imageUri: `https://placehold.co/900x520/373038/F4EFF2/png?text=${encodeURIComponent('Word Chain Story')}`,
    source: 'local',
  };
};

const buildChain = (words: WordListItem[]) => {
  const available = words.filter((word) => word.engWordName.length >= 3);
  const result: WordListItem[] = [];

  for (const word of available) {
    if (!result.length) {
      result.push(word);
      continue;
    }

    const previous = result[result.length - 1].engWordName.toLocaleLowerCase('en-US');
    const current = word.engWordName.toLocaleLowerCase('en-US');

    if (previous[previous.length - 1] === current[0]) {
      result.push(word);
    }

    if (result.length === 5) {
      return result;
    }
  }

  if (result.length >= 3) {
    return result;
  }

  return fallbackChain.map((word, index) => ({
    id: 9000 + index,
    engWordName: word,
    turWordName: ['beyin', 'gece', 'kaplan', 'kızılgerdan', 'asil'][index],
    level: 'A1',
    pictureUrl: null,
    audioUrl: null,
    samples: [],
  }));
};

const buildStory = (words: string[]) => {
  const readableWords = words.map((word) => word.toUpperCase()).join(' -> ');

  return `${readableWords} zinciriyle kurulan hikayede, kahraman ilk kelimenin son harfinden yeni kelimeye geçerek ilerler. Her sahne bir sonraki kelimeyi hatırlatan küçük bir ipucu taşır ve öğrencinin kelimeleri sırayla bağlamasını kolaylaştırır.`;
};
