type GuessState = "correct" | "present" | "absent";

export type GuessEvaluation = {
  letters: { char: string; state: GuessState }[];
  isWin: boolean;
};

const answer = "BRAIN";

export function getWordleWord() {
  return answer;
}

export function evaluateGuess(guess: string): GuessEvaluation {
  const normalized = guess.toUpperCase();
  const letters = normalized.split("").map((char, index) => {
    if (answer[index] === char) {
      return { char, state: "correct" as GuessState };
    }

    if (answer.includes(char)) {
      return { char, state: "present" as GuessState };
    }

    return { char, state: "absent" as GuessState };
  });

  return {
    letters,
    isWin: normalized === answer
  };
}
