// @ts-nocheck
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { palette, radius, spacing, typography } from '@/constants/theme';

export default function StudyScreen() {
  const [answer, setAnswer] = useState('');

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Çalışma oturumu"
        title="Soru kartı akışını burada işle."
        description="Bu ekran, 6 tekrar algoritmasının ana yüzeyi olacak. Şimdilik odaklı bir placeholder düzeni hazır."
      />

      <SurfaceCard>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sıra 4 / 20</Text>
          </View>
          <Ionicons name="volume-high-outline" size={20} color={palette.textMuted} />
        </View>
        <Text style={styles.word}>abandon</Text>
        <Text style={styles.hint}>Bu alanda görsel, örnek cümle ve tekrar aşaması bilgisi gösterilecek.</Text>
        <AppInput
          label="Cevabın"
          placeholder="Türkçe karşılığını yaz"
          value={answer}
          onChangeText={setAnswer}
        />
        <AppButton label="Cevabı Gönder" />
      </SurfaceCard>

      <SurfaceCard muted style={styles.progressCard}>
        <Text style={styles.progressTitle}>Oturum akışı</Text>
        <Text style={styles.progressText}>Yeni kelime, tekrar kelimesi ve doğru-yanlış geri bildirim blokları sonraki sprintte bu ekranın içine gelecek.</Text>
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: radius.pill,
    backgroundColor: palette.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  badgeText: {
    ...typography.caption,
    color: palette.primary,
  },
  word: {
    ...typography.display,
    color: palette.text,
    textTransform: 'lowercase',
  },
  hint: {
    ...typography.body,
    color: palette.textMuted,
  },
  progressCard: {
    gap: spacing.sm,
  },
  progressTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  progressText: {
    ...typography.body,
    color: palette.textMuted,
  },
});
