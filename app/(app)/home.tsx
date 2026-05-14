import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatCard } from "../../components/ui/StatCard";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { AppButton } from "../../components/ui/AppButton";
import { getDashboardSummary } from "../../services/dashboard";
import { useAuth } from "../../lib/auth-context";
import { spacing, typography, palette } from "../../constants/theme";

export default function HomeScreen() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    todayNewWords: 0,
    todayReviewWords: 0,
    totalLearnedWords: 0,
    successRate: 0
  });

  useEffect(() => {
    getDashboardSummary().then(setSummary);
  }, []);

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Dashboard"
        title={`Hos geldin${user ? `, ${user.userName}` : ""}.`}
        description="Bugunku yeni kelimeler, tekrar havuzu ve test baslatma alani burada."
      />
      <View style={styles.stats}>
        <StatCard eyebrow="Yeni kelime" value={`${summary.todayNewWords}`} />
        <StatCard eyebrow="Tekrar" value={`${summary.todayReviewWords}`} accent="secondary" />
      </View>
      <View style={styles.stats}>
        <StatCard eyebrow="Ogrenilen" value={`${summary.totalLearnedWords}`} />
        <StatCard eyebrow="Basari" value={`%${summary.successRate}`} accent="secondary" />
      </View>
      <SurfaceCard>
        <Text style={styles.title}>Bugunku plan</Text>
        <Text style={styles.body}>Dokumanda istenen gunluk test, yeni kelime ve tekrar akislarini tek merkezde topladik.</Text>
        <AppButton label="Bugunku teste basla" onPress={() => router.push("/(app)/study")} />
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: "row",
    gap: spacing.md
  },
  title: {
    ...typography.cardTitle,
    color: palette.text
  },
  body: {
    ...typography.body,
    color: palette.textMuted
  }
});
