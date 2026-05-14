import { DarkTheme, Theme } from "@react-navigation/native";
import { TextStyle, ViewStyle } from "react-native";

export const palette = {
  background: "#19161d",
  backgroundSoft: "#241f28",
  card: "#2f2835",
  cardMuted: "#3a3342",
  border: "#554a61",
  primary: "#c24d6f",
  primarySoft: "rgba(194, 77, 111, 0.16)",
  secondary: "#66c7c4",
  text: "#f6f2f7",
  textMuted: "#cdbed3",
  textFaint: "#9e90a6",
  success: "#76d38a",
  warning: "#f0bf5c",
  danger: "#ef7c93"
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999
};

export const typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700"
  } satisfies TextStyle,
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700"
  } satisfies TextStyle,
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700"
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400"
  } satisfies TextStyle,
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  } satisfies TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400"
  } satisfies TextStyle,
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700"
  } satisfies TextStyle
};

export const shadows = {
  soft: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6
  } satisfies ViewStyle
};

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: palette.background,
    card: palette.card,
    border: palette.border,
    primary: palette.primary,
    text: palette.text,
    notification: palette.secondary
  }
};
