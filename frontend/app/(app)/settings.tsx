// @ts-nocheck
import React, { useEffect, useState } from 'react';
import * as ExpoRouter from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useAuth } from '@/lib/auth-context';
import { palette, radius, spacing, typography } from '@/constants/theme';
import {
  getSettingsSummary,
  SettingsSummary,
  updateDailyWordsRequest,
  updateLevelRequest,
} from '@/services/settings';
import { WordLevel } from '@/services/words';

const levels: WordLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const difficulties = ['Kolay', 'Dengeli', 'Zor'];
const pixelAvatar = require('../../assets/images/pixel-profile-avatar.png');

export default function SettingsScreen() {
  const { router } = ExpoRouter;
  const { logout, token, user } = useAuth();
  const [summary, setSummary] = useState<SettingsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const nextSummary = await getSettingsSummary(user);
        setSummary(nextSummary);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [user]);

  const updateSetting = async (patch: Partial<SettingsSummary>) => {
    await Haptics.selectionAsync();
    const previousSummary = summary;
    const nextSummary = previousSummary ? { ...previousSummary, ...patch } : previousSummary;
    setSummary(nextSummary);

    try {
      if (typeof patch.dailyNewWords === 'number') {
        const result = await updateDailyWordsRequest({
          dailyNewWords: patch.dailyNewWords,
          token,
        });
        setSummary((current) =>
          current
            ? {
                ...current,
                dailyNewWords: result.dailyNewWords,
                dailyQuestionCount: Math.max(result.dailyNewWords + 3, 10),
              }
            : current
        );
      }

      if (patch.level) {
        await updateLevelRequest({
          level: patch.level,
          token,
        });
      }

      setNotice(token === 'demo-session' ? 'Demo tercihi güncellendi.' : 'Tercih backend tarafına kaydedildi.');
    } catch (error) {
      setSummary(previousSummary);
      setNotice(error instanceof Error ? error.message : 'Tercih güncellenemedi.');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenContainer scrollable withBackgroundDecor>
      <SectionHeader
        eyebrow="Ayarlar"
        title="Ritmini ayarla"
        description="Günlük hedef, soru sayısı ve zorluk seviyeni düzenle."
      />

      {isLoading ? (
        <SurfaceCard muted style={styles.loadingCard}>
          <ActivityIndicator color={palette.text} />
          <Text style={styles.preferenceText}>Ayarlar hazırlanıyor...</Text>
        </SurfaceCard>
      ) : (
        <>
          <SurfaceCard accent="primary">
            <View style={styles.profileRow}>
              <View style={styles.profileAvatar}>
                <Image source={pixelAvatar} style={styles.profileImage} resizeMode="cover" />
              </View>
              <View style={styles.profileBody}>
                <Text style={styles.profileName}>{user?.userName ?? 'Profil'}</Text>
                <Text style={styles.preferenceText}>
                  {summary?.level ?? 'A1'} seviyesi • {summary?.totalLearnedWords ?? 0} kelime tamamlandı
                </Text>
              </View>
            </View>
            <View style={styles.profileStats}>
              <MiniStat label="Günlük hedef" value={`${summary?.dailyNewWords ?? 0}`} />
              <MiniStat label="Soru" value={`${summary?.dailyQuestionCount ?? 0}`} />
              <MiniStat label="Zorluk" value={summary?.difficulty ?? 'Dengeli'} />
            </View>
          </SurfaceCard>

          <SurfaceCard accent="primary">
            <StepperRow
              icon="sparkles-outline"
              title="Günlük yeni kelime"
              value={summary?.dailyNewWords ?? 0}
              suffix="kelime"
              onMinus={() => updateSetting({ dailyNewWords: Math.max((summary?.dailyNewWords ?? 5) - 1, 5) })}
              onPlus={() => updateSetting({ dailyNewWords: Math.min((summary?.dailyNewWords ?? 5) + 1, 25) })}
            />
            <StepperRow
              icon="help-circle-outline"
              title="Günlük soru sayısı"
              value={summary?.dailyQuestionCount ?? 0}
              suffix="soru"
              onMinus={() => updateSetting({ dailyQuestionCount: Math.max((summary?.dailyQuestionCount ?? 1) - 1, 5) })}
              onPlus={() => updateSetting({ dailyQuestionCount: Math.min((summary?.dailyQuestionCount ?? 1) + 1, 60) })}
            />
          </SurfaceCard>

          <SurfaceCard>
            <Text style={styles.preferenceTitle}>Aktif seviye</Text>
            <View style={styles.choiceRow}>
              {levels.map((level) => (
                <ChoicePill
                  key={level}
                  label={level}
                  active={summary?.level === level}
                  onPress={() => updateSetting({ level })}
                />
              ))}
            </View>
            <Text style={styles.preferenceTitle}>Zorluk</Text>
            <View style={styles.choiceRow}>
              {difficulties.map((difficulty) => (
                <ChoicePill
                  key={difficulty}
                  label={difficulty}
                  active={summary?.difficulty === difficulty}
                  onPress={() => updateSetting({ difficulty })}
                />
              ))}
            </View>
          </SurfaceCard>

          <SurfaceCard muted>
            <Text style={styles.preferenceTitle}>Öğrenme özeti</Text>
            <View style={styles.summaryPill}>
              <Ionicons name="checkmark-circle-outline" size={18} color={palette.success} />
              <Text style={styles.summaryText}>{summary?.totalLearnedWords ?? 0} kelime tamamlandı</Text>
            </View>
            {notice ? <Text style={styles.noticeText}>{notice}</Text> : null}
          </SurfaceCard>
        </>
      )}

      <SurfaceCard>
        <Text style={styles.preferenceTitle}>Hesap</Text>
        <Text style={styles.preferenceText}>Oturumunu güvenli şekilde kapatabilirsin.</Text>
        <AppButton label="Çıkış yap" variant="ghost" icon="log-out-outline" onPress={handleLogout} />
      </SurfaceCard>
    </ScreenContainer>
  );
}

function StepperRow({ icon, title, value, suffix, onMinus, onPlus }) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceIcon}>
        <Ionicons name={icon} size={18} color={palette.primary} />
      </View>
      <View style={styles.preferenceBody}>
        <Text style={styles.preferenceTitle}>{title}</Text>
        <View style={styles.valueLine}>
          <AnimatedNumber value={value} style={styles.preferenceValue} maxScale={1.06} />
          <Text style={styles.preferenceText}>{suffix}</Text>
        </View>
      </View>
      <View style={styles.stepper}>
        <Pressable onPress={onMinus} style={styles.stepButton}>
          <Ionicons name="remove" size={18} color={palette.text} />
        </Pressable>
        <Pressable onPress={onPlus} style={styles.stepButton}>
          <Ionicons name="add" size={18} color={palette.text} />
        </Pressable>
      </View>
    </View>
  );
}

function ChoicePill({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.choicePill, active && styles.choicePillActive]}>
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</Text>
    </Pressable>
  );
}

function MiniStat({ label, value }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.primary,
    backgroundColor: palette.backgroundElevated,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileBody: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    ...typography.title,
    color: palette.text,
  },
  profileStats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  miniStat: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundElevated,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.md,
    gap: 2,
  },
  miniValue: {
    ...typography.label,
    color: palette.text,
  },
  miniLabel: {
    ...typography.caption,
    color: palette.textFaint,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  preferenceIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preferenceBody: {
    flex: 1,
    minWidth: 0,
  },
  preferenceTitle: {
    ...typography.cardTitle,
    color: palette.text,
  },
  preferenceText: {
    ...typography.body,
    color: palette.textMuted,
  },
  preferenceValue: {
    ...typography.cardTitle,
    color: palette.text,
  },
  valueLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    minHeight: 24,
  },
  stepper: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  stepButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  choicePill: {
    minHeight: 40,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choicePillActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryStrong,
  },
  choiceText: {
    ...typography.label,
    color: palette.textMuted,
  },
  choiceTextActive: {
    color: palette.text,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  summaryText: {
    ...typography.label,
    color: palette.text,
  },
  noticeText: {
    ...typography.caption,
    color: palette.accent,
  },
});
