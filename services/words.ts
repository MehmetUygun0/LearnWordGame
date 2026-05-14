import { apiRequest, readJson } from "../lib/api";
import { config } from "../lib/config";

export type WordLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type WordListItem = {
  id: number;
  engWordName: string;
  turWordName: string;
  level: WordLevel;
  pictureUrl?: string | null;
  audioUrl?: string | null;
  samples: string[];
};

const localWords: WordListItem[] = [
  { id: 1, engWordName: "route", turWordName: "rota", level: "A1", samples: ["This route is shorter."], pictureUrl: null, audioUrl: null },
  { id: 2, engWordName: "journey", turWordName: "yolculuk", level: "A2", samples: ["The journey took hours."], pictureUrl: null, audioUrl: null },
  { id: 3, engWordName: "resilient", turWordName: "dayanikli", level: "B2", samples: ["She stayed resilient under pressure."], pictureUrl: null, audioUrl: null },
  { id: 4, engWordName: "noble", turWordName: "asil", level: "A1", samples: ["It was a noble act."], pictureUrl: null, audioUrl: null },
  { id: 5, engWordName: "brain", turWordName: "beyin", level: "A1", samples: ["The brain learns with repetition."], pictureUrl: null, audioUrl: null },
  { id: 6, engWordName: "tiger", turWordName: "kaplan", level: "A1", samples: ["The tiger moved quietly."], pictureUrl: null, audioUrl: null }
];

export async function getWords() {
  return [...localWords];
}

export async function addWord(input: {
  engWordName: string;
  turWordName: string;
  level: WordLevel;
  picture?: string;
  samples: string[];
}) {
  try {
    await apiRequest(config.endpoints.word.add, {
      method: "POST",
      body: JSON.stringify({
        engWordName: input.engWordName,
        turWordName: input.turWordName,
        level: input.level,
        picture: input.picture ?? null,
        samples: input.samples
      })
    });
  } catch {
    // Local fallback keeps the frontend usable even when backend coverage is incomplete.
  }

  const nextWord: WordListItem = {
    id: Date.now(),
    engWordName: input.engWordName,
    turWordName: input.turWordName,
    level: input.level,
    pictureUrl: input.picture ?? null,
    audioUrl: null,
    samples: input.samples
  };

  localWords.unshift(nextWord);
  return nextWord;
}
