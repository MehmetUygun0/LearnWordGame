// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { palette } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';

export default function RootLayout() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <ScreenContainer withBackgroundDecor={false} />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        // Tüm uygulama içi sekmeler aynı görsel dilde kalsın diye stil burada merkezi tutuluyor.
        headerShown: false,
        tabBarStyle: {
          backgroundColor: palette.backgroundElevated,
          borderTopWidth: 1,
          borderTopColor: palette.border,
          height: 84,
          paddingTop: 10,
          paddingBottom: 12,
        },
        sceneStyle: {
          backgroundColor: palette.background,
        },
        tabBarActiveTintColor: palette.text,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 12,
        },
      }}>
      {/* Sprint 1 sonunda kullanıcı göreceği ana sekmeler */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Çalış',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="flash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="words"
        options={{
          title: 'Kelimeler',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Rapor',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="options-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
