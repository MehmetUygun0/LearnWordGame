// @ts-nocheck
import { DarkTheme, Theme } from '@react-navigation/native';
import { TextStyle, ViewStyle } from 'react-native';

// Projedeki tüm ekranlar koyu gri zemin ve bordo vurgu ailesi üzerine kuruldu.
export const palette = {
  background: '#241F24',
  backgroundElevated: '#2D262C',
  card: '#373038',
  cardMuted: '#433A43',
  border: '#5B4E58',
  primary: '#65142C',
  primaryStrong: '#4E0E21',
  primarySoft: 'rgba(101, 20, 44, 0.18)',
  secondary: '#8F5566',
  secondarySoft: 'rgba(143, 85, 102, 0.18)',
  text: '#F4EFF2',
  textMuted: '#C7BAC1',
  textFaint: '#9C8F96',
  danger: '#E56B86',
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
    shadowColor: '#050507',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.26,
    shadowRadius: 22,
    elevation: 8,
  } satisfies ViewStyle,
  glow: {
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.26,
    shadowRadius: 18,
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
