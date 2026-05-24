// @ts-nocheck
import config from '@/lib/config';
import { apiRequest, readResponsePayload } from '@/lib/api';
import { getWords } from '@/services/words';

export type WordleLetter = {
  letter: string;
  state: 'correct' | 'present' | 'missing';
};

export type WordleGuess = {
  guess: string;
  letters: WordleLetter[];
};

export const getWordleToday = async (token?: string | null) => {
  if (token && token !== 'demo-session') {
    const response = await apiRequest({
      endpoint: config.ENDPOINTS.WORDLE.NEW_GAME,
      method: 'GET',
      token,
    });
    const payload = await readResponsePayload(response);

    if (response.ok && payload?.engWordName && payload.engWordName !== 'error') {
      const answer = String(payload.engWordName).toLowerCase();

      return {
        wordId: payload.wordId ?? 0,
        answer,
        hint: 'Öğrenilen kelimelerden',
        maxAttempts: 6,
        guesses: [],
      };
    }
  }

  const words = await getWords(token);
  const word = words.find((item) => item.engWordName.length >= 5) ?? words[0];

  return {
    wordId: word.id,
    answer: word.engWordName.toLowerCase(),
    hint: word.turWordName,
    maxAttempts: 6,
    guesses: [],
  };
};

export const evaluateGuess = (guess: string, answer: string): WordleGuess => {
  const safeGuess = guess.toLowerCase().slice(0, answer.length);

  return {
    guess: safeGuess,
    letters: answer.split('').map((answerLetter, index) => {
      const letter = safeGuess[index] ?? '';

      return {
        letter: letter || ' ',
        state: letter === answerLetter ? 'correct' : answer.includes(letter) ? 'present' : 'missing',
      };
    }),
  };
};

export const getStoryLab = async (token?: string | null) => {
  if (token && token !== 'demo-session') {
    const response = await apiRequest({
      endpoint: config.ENDPOINTS.WORD_CHAIN.GET,
      method: 'GET',
      token,
    });
    const payload = await readResponsePayload(response);

    if (response.ok && payload?.story) {
      return {
        selectedWords: [],
        story: String(payload.story),
        imagePrompt: 'Backend LLM ve görsel çıktısı',
        imageUri: payload.image ? `data:image/png;base64,${payload.image}` : null,
      };
    }
  }

  const words = await getWords(token);
  const selectedWords = words.slice(0, 4);

  return {
    selectedWords,
    story:
      'The journey started with a shorter route, but each new word made the learner more resilient.',
    imagePrompt:
      'A bright mobile game scene with floating vocabulary cards, neon trails, and a confident student learning English.',
  };
};
