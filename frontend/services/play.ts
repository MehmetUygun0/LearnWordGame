// @ts-nocheck
import { getWords } from '@/services/words';

export type WordleLetter = {
  letter: string;
  state: 'correct' | 'present' | 'missing';
};

export type WordleGuess = {
  guess: string;
  letters: WordleLetter[];
};

export const getWordleToday = async () => {
  const words = await getWords();
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

export const getStoryLab = async () => {
  const words = await getWords();
  const selectedWords = words.slice(0, 4);

  return {
    selectedWords,
    story:
      'The journey started with a shorter route, but each new word made the learner more resilient.',
    imagePrompt:
      'A bright mobile game scene with floating vocabulary cards, neon trails, and a confident student learning English.',
  };
};
