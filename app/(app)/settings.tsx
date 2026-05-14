import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { useAuth } from "../../lib/auth-context";
import { getSettingsSummary } from "../../services/settings";
import { palette, spacing, typography } from "../../constants/theme";

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [settings, setSettings] = useState({ dailyNewWords: 10, dailyQuestionCount: 20, level: "A1", difficulty: 2 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSettingsSummary().then(setSettings);
  }, []);

  function adjust(field: "dailyNewWords" | "dailyQuestionCount" | "difficulty", delta: number) {
    setSettings((current) => ({
      ...current,
      [field]: Math.max(1, Number(current[field]) + delta)
    }));
    setMessage("");
  }

  return (
    <ScreenContainer scrollable>
      <SectionHeader eyebrow="Story 4" title="Ayarlar" description="Gunluk yeni kelime, gunluk soru ve zorluk seviyesi frontendte ayarlanabilir durumda." />
      <SurfaceCard>
        <Row label="Gunluk yeni kelime" value={settings.dailyNewWords} onDecrease={() => adjust("dailyNewWords", -1)} onIncrease={() => adjust("dailyNewWords", 1)} />
        <Row label="Gunluk soru sayisi" value={settings.dailyQuestionCount} onDecrease={() => adjust("dailyQuestionCount", -1)} onIncrease={() => adjust("dailyQuestionCount", 1)} />
        <Row label="Zorluk seviyesi" value={settings.difficulty} onDecrease={() => adjust("difficulty", -1)} onIncrease={() => adjust("difficulty", 1)} />
        {message ? <Text style={styles.success}>{message}</Text> : null}
        <AppButton label="Ayarlarini uygula" onPress={() => setMessage("Ayarlar bu oturum icin uygulandi.")} />
      </SurfaceCard>
      <SurfaceCard muted>
        <Text style={styles.title}>Hesap</Text>
        <AppButton label="Cikis yap" variant="ghost" onPress={logout} />
      </SurfaceCard>
    </ScreenContainer>
  );
}

function Row({
  label,
  value,
  onDecrease,
  onIncrease
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.actions}>
        <AppButton label="-" variant="secondary" onPress={onDecrease} style={{ width: 44 }} />
        <Text style={styles.value}>{value}</Text>
        <AppButton label="+" variant="secondary" onPress={onIncrease} style={{ width: 44 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { ...typography.cardTitle, color: palette.text },
  value: { ...typography.body, color: palette.textMuted, minWidth: 24, textAlign: "center" },
  success: { ...typography.caption, color: palette.success }
});
