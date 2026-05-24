// @ts-nocheck
import { DarkTheme, Theme } from '@react-navigation/native';
import { TextStyle, ViewStyle } from 'react-native';

export const palette = {
  background: '#111827',
  backgroundElevated: '#172033',
  surface: '#1F2B45',
  card: '#233452',
  cardMuted: '#1B2538',
  border: '#3B4A63',
  borderSoft: 'rgba(255, 255, 255, 0.10)',
  primary: '#FF4D8D',
  primaryStrong: '#D92D6B',
  primarySoft: 'rgba(255, 77, 141, 0.16)',
  secondary: '#FFB86B',
  secondarySoft: 'rgba(255, 184, 107, 0.17)',
  accent: '#4EE4C1',
  accentSoft: 'rgba(78, 228, 193, 0.15)',
  electric: '#7C6CFF',
  electricSoft: 'rgba(124, 108, 255, 0.16)',
  lime: '#B6F36B',
  limeSoft: 'rgba(182, 243, 107, 0.14)',
  text: '#F9FBFF',
  textMuted: '#CBD5E1',
  textFaint: '#94A3B8',
  danger: '#FB7185',
  success: '#55E28C',
  warning: '#FACC15',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const typography = {
  display: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    lineHeight: 37,
  } satisfies TextStyle,
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 29,
  } satisfies TextStyle,
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  } satisfies TextStyle,
  body: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 21,
  } satisfies TextStyle,
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    lineHeight: 18,
  } satisfies TextStyle,
  caption: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 17,
  } satisfies TextStyle,
  button: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    lineHeight: 19,
  } satisfies TextStyle,
};

export const shadows = {
  soft: {
    shadowColor: '#030712',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 26,
    elevation: 9,
  } satisfies ViewStyle,
  glow: {
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 8,
  } satisfies ViewStyle,
};

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
