import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { buildWordChainStory } from "../../services/word-chain";
import { palette, radius, spacing, typography } from "../../constants/theme";

export default function WordChainScreen() {
  const [result, setResult] = useState<{ words: { id: number; engWordName: string; turWordName: string }[]; story: string; imagePrompt: string } | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    buildWordChainStory().then(setResult);
  }, []);

  return (
    <ScreenContainer scrollable>
      <SectionHeader eyebrow="Story 7" title="Word Chain ve hikaye modulu" description="Secilen kelimelerle hikaye ve gorsel istemi ureten bonus ekran." />
      <SurfaceCard>
        <Text style={styles.title}>Kelime zinciri</Text>
        <View style={styles.chips}>
          {result?.words.map((word) => (
            <View key={word.id} style={styles.chip}>
              <Text style={styles.chipWord}>{word.engWordName}</Text>
              <Text style={styles.chipMeaning}>{word.turWordName}</Text>
            </View>
          ))}
        </View>
      </SurfaceCard>
      <SurfaceCard muted>
        <Text style={styles.title}>Hikaye</Text>
        <Text style={styles.body}>{result?.story}</Text>
      </SurfaceCard>
      <SurfaceCard muted>
        <Text style={styles.title}>Gorsel istemi</Text>
        <Text style={styles.body}>{result?.imagePrompt}</Text>
        {savedMessage ? <Text style={styles.success}>{savedMessage}</Text> : null}
        <AppButton label="Hikayeyi uygulamada kaydet" onPress={() => setSavedMessage("Word Chain ciktilari kaydedildi.")} />
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.cardTitle, color: palette.text },
  body: { ...typography.body, color: palette.textMuted },
  success: { ...typography.caption, color: palette.success },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderRadius: radius.md, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.cardMuted, padding: spacing.sm },
  chipWord: { ...typography.label, color: palette.text },
  chipMeaning: { ...typography.caption, color: palette.textMuted }
});
