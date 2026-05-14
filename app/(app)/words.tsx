import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { AppInput } from "../../components/ui/AppInput";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { WordCard } from "../../components/ui/WordCard";
import { addWord, getWords, WordLevel, WordListItem } from "../../services/words";
import { palette, radius, spacing, typography } from "../../constants/theme";

const levels: WordLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export default function WordsScreen() {
  const [words, setWords] = useState<WordListItem[]>([]);
  const [message, setMessage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<WordLevel | "ALL">("ALL");
  const [form, setForm] = useState({
    engWordName: "",
    turWordName: "",
    level: "A1" as WordLevel,
    picture: "",
    samples: ""
  });

  useEffect(() => {
    getWords().then(setWords);
  }, []);

  const filteredWords = useMemo(() => {
    return selectedLevel === "ALL" ? words : words.filter((word) => word.level === selectedLevel);
  }, [selectedLevel, words]);

  async function handleSave() {
    const newItem = await addWord({
      engWordName: form.engWordName,
      turWordName: form.turWordName,
      level: form.level,
      picture: form.picture,
      samples: form.samples.split("\n").filter(Boolean)
    });

    setWords((current) => [newItem, ...current]);
    setMessage("Kelime eklendi.");
    setForm({ engWordName: "", turWordName: "", level: "A1", picture: "", samples: "" });
  }

  return (
    <ScreenContainer scrollable>
      <SectionHeader eyebrow="Story 2" title="Kelime havuzu ve ekleme modulu" description="Kelime, gorsel, ornek cumle ve seviye bilgisiyle havuz yonetimi burada." />
      <SurfaceCard>
        <Text style={styles.title}>Yeni kelime ekle</Text>
        <AppInput label="Ingilizce" value={form.engWordName} onChangeText={(engWordName) => setForm({ ...form, engWordName })} />
        <AppInput label="Turkce" value={form.turWordName} onChangeText={(turWordName) => setForm({ ...form, turWordName })} />
        <AppInput label="Gorsel yolu" value={form.picture} onChangeText={(picture) => setForm({ ...form, picture })} />
        <AppInput label="Ornek cumleler" value={form.samples} onChangeText={(samples) => setForm({ ...form, samples })} multiline />
        <View style={styles.filters}>
          {levels.map((level) => (
            <Pressable key={level} onPress={() => setForm({ ...form, level })} style={[styles.chip, form.level === level ? styles.chipActive : null]}>
              <Text style={styles.chipText}>{level}</Text>
            </Pressable>
          ))}
        </View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <AppButton label="Veritabanina kaydet" onPress={handleSave} />
      </SurfaceCard>
      <SurfaceCard muted>
        <Text style={styles.title}>Liste filtresi</Text>
        <View style={styles.filters}>
          {["ALL", ...levels].map((level) => (
            <Pressable key={level} onPress={() => setSelectedLevel(level as WordLevel | "ALL")} style={[styles.chip, selectedLevel === level ? styles.chipActive : null]}>
              <Text style={styles.chipText}>{level === "ALL" ? "Tumu" : level}</Text>
            </Pressable>
          ))}
        </View>
      </SurfaceCard>
      {filteredWords.map((word) => (
        <WordCard key={word.id} word={word} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.cardTitle, color: palette.text },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderRadius: radius.pill, backgroundColor: palette.cardMuted, borderWidth: 1, borderColor: palette.border, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  chipActive: { backgroundColor: palette.primarySoft, borderColor: palette.primary },
  chipText: { ...typography.caption, color: palette.text },
  message: { ...typography.caption, color: palette.success }
});
