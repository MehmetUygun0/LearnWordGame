// @ts-nocheck
import { DarkTheme, Theme } from '@react-navigation/native';
import { TextStyle, ViewStyle } from 'react-native';

// Projedeki tüm ekranlar koyu arka plan + iki vurgu rengi üstüne kuruldu.
export const palette = {
  background: '#0B1020',
  backgroundElevated: '#121933',
  card: '#151E3D',
  cardMuted: '#1A2448',
  border: '#2A3564',
  primary: '#6EA8FE',
  secondary: '#5EEAD4',
  text: '#F4F7FF',
  textMuted: '#98A6D4',
  danger: '#FF7A90',
  success: '#4ADE80',
  warning: '#FBBF24',
};

// Ortak spacing değerleri ekranlar arasında tutarlılık sağlıyor.
export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
};

// Tüm yazı stilleri Poppins ailesi üzerinden merkezi tanımlanıyor.
export const typography = {
  display: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    lineHeight: 36,
  } satisfies TextStyle,
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 30,
  } satisfies TextStyle,
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  } satisfies TextStyle,
  body: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 22,
  } satisfies TextStyle,
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
  caption: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
  } satisfies TextStyle,
  button: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
  } satisfies TextStyle,
};

// Kart ve butonlarda tekrar kullanılacak gölge preset'leri.
export const shadows = {
  soft: {
    shadowColor: '#000814',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  } satisfies ViewStyle,
  glow: {
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 6,
  } satisfies ViewStyle,
};

// React Navigation teması da aynı renk sistemini kullansın diye ayrı export ediliyor.
export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.primary,
    background: palette.background,
    card: palette.card,
    text: palette.text,
    border: palette.border,
    notification: palette.secondary,
  },
};
