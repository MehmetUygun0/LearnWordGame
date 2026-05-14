import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatCard } from "../../components/ui/StatCard";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { getReportSummary } from "../../services/report";
import { palette, radius, spacing, typography } from "../../constants/theme";

export default function ReportScreen() {
  const [summary, setSummary] = useState({
    learnedCount: 0,
    inProgressCount: 0,
    successRate: 0,
    weeklyTrend: [] as number[],
    stageDistribution: [] as { label: string; value: number }[],
    difficultWords: [] as string[]
  });
  const [printMessage, setPrintMessage] = useState("");

  useEffect(() => {
    getReportSummary().then(setSummary);
  }, []);

  const maxHeight = Math.max(...summary.weeklyTrend, 1);

  return (
    <ScreenContainer scrollable>
      <SectionHeader eyebrow="Story 5" title="Analiz ve rapor" description="Yuzdesel basari, haftalik trend, stage dagilimi ve cikti aksiyonu burada." />
      <View style={styles.stats}>
        <StatCard eyebrow="Ogrenilen" value={`${summary.learnedCount} kelime`} />
        <StatCard eyebrow="Surecte" value={`${summary.inProgressCount} kelime`} accent="secondary" />
      </View>
      <View style={styles.stats}>
        <StatCard eyebrow="Basari" value={`%${summary.successRate}`} />
        <StatCard eyebrow="Zorlandigi kelime" value={`${summary.difficultWords.length} adet`} accent="secondary" />
      </View>
      <SurfaceCard>
        <Text style={styles.title}>Son 7 gun trendi</Text>
        <View style={styles.bars}>
          {summary.weeklyTrend.map((value, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={[styles.bar, { height: Math.max((value / maxHeight) * 120, 18) }]} />
            </View>
          ))}
        </View>
      </SurfaceCard>
      <SurfaceCard muted>
        <Text style={styles.title}>Stage dagilimi</Text>
        {summary.stageDistribution.map((item) => (
          <Text key={item.label} style={styles.body}>{item.label}: {item.value}</Text>
        ))}
      </SurfaceCard>
      <SurfaceCard muted>
        <Text style={styles.title}>Yazdirilabilir rapor</Text>
        <Text style={styles.body}>Dokumanda istenen kagit cikti akisina uygun olarak bu buton yazdirma aksiyonunu temsil eder.</Text>
        {printMessage ? <Text style={styles.success}>{printMessage}</Text> : null}
        <AppButton label="Rapor ciktisi al" variant="secondary" onPress={() => setPrintMessage("Rapor ciktisi hazirlandi.")} />
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: spacing.md },
  title: { ...typography.cardTitle, color: palette.text },
  body: { ...typography.body, color: palette.textMuted },
  success: { ...typography.caption, color: palette.success },
  bars: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-end", height: 120 },
  barColumn: { flex: 1, justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: radius.sm, backgroundColor: palette.primary }
});
