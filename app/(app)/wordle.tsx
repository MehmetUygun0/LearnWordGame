import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { AppInput } from "../../components/ui/AppInput";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { evaluateGuess } from "../../services/wordle";
import { palette, radius, spacing, typography } from "../../constants/theme";

export default function WordleScreen() {
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState<{ char: string; state: string }[][]>([]);
  const [message, setMessage] = useState("");

  function submitGuess() {
    if (guess.length !== 5) {
      setMessage("5 harfli bir tahmin gir.");
      return;
    }

    const result = evaluateGuess(guess);
    setHistory((current) => [...current, result.letters]);
    setMessage(result.isWin ? "Dogru bildin." : "Devam et.");
    setGuess("");
  }

  return (
    <ScreenContainer scrollable>
      <SectionHeader eyebrow="Story 6" title="Wordle modulu" description="Ogrenilen kelimelerden uretilen 5 harfli bulmaca akisi." />
      <SurfaceCard>
        {history.map((row, index) => (
          <View key={index} style={styles.row}>
            {row.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={[
                  styles.tile,
                  item.state === "correct" ? styles.correct : item.state === "present" ? styles.present : styles.absent
                ]}>
                <Text style={styles.tileText}>{item.char}</Text>
              </View>
            ))}
          </View>
        ))}
        <AppInput label="Tahmin" value={guess} onChangeText={setGuess} placeholder="brain" />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <AppButton label="Tahmini gonder" onPress={submitGuess} />
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm },
  tile: { width: 48, height: 48, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: palette.border },
  correct: { backgroundColor: palette.success },
  present: { backgroundColor: palette.warning },
  absent: { backgroundColor: palette.cardMuted },
  tileText: { ...typography.cardTitle, color: palette.background },
  message: { ...typography.caption, color: palette.textMuted }
});
