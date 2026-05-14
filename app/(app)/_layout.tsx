import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";

import { palette } from "../../constants/theme";
import { useAuth } from "../../lib/auth-context";
import { ScreenContainer } from "../../components/ui/ScreenContainer";

export default function AppLayout() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <ScreenContainer />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.border
        },
        tabBarActiveTintColor: palette.text,
        tabBarInactiveTintColor: palette.textFaint,
        sceneStyle: { backgroundColor: palette.background }
      }}>
      <Tabs.Screen name="home" options={{ title: "Ana", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="study" options={{ title: "Calis", tabBarIcon: ({ color, size }) => <Ionicons name="flash-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="words" options={{ title: "Kelimeler", tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="wordle" options={{ title: "Wordle", tabBarIcon: ({ color, size }) => <Ionicons name="game-controller-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="report" options={{ title: "Rapor", tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Ayar", tabBarIcon: ({ color, size }) => <Ionicons name="options-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="word-chain" options={{ title: "Chain", tabBarIcon: ({ color, size }) => <Ionicons name="git-branch-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
