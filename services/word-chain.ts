import { getWords } from "./words";

export async function buildWordChainStory() {
  const words = await getWords();
  const selected = words.slice(0, 5);
  const labels = selected.map((word) => word.engWordName);

  return {
    words: selected,
    story: `${labels[0]} starts the scene, then ${labels[1]} carries the memory forward, ${labels[2]} sharpens the image, ${labels[3]} ties the scene together, and ${labels[4]} closes it with a strong final cue.`,
    imagePrompt: `Create a bright study-card illustration that connects ${labels.join(", ")} in one memorable story.`
  };
}
