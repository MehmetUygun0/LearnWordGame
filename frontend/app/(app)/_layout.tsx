// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
        headerShown: false,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopWidth: 0,
          height: 88,
          marginHorizontal: 14,
          marginBottom: 10,
          borderRadius: 28,
          position: 'absolute',
          borderWidth: 1,
          borderColor: palette.borderSoft,
          paddingTop: 10,
          paddingBottom: 18,
          paddingHorizontal: 10,
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          borderRadius: 24,
          minHeight: 58,
          paddingVertical: 4,
          marginHorizontal: 2,
        },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        sceneStyle: {
          backgroundColor: palette.background,
        },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 11,
          lineHeight: 15,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: (props) => <TabIcon name="grid-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Çalış',
          tabBarIcon: (props) => <TabIcon name="flash-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="words"
        options={{
          title: 'Kelime',
          tabBarIcon: (props) => <TabIcon name="library-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Rapor',
          tabBarIcon: (props) => <TabIcon name="stats-chart-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: (props) => <TabIcon name="options-outline" {...props} />,
        }}
      />
      <Tabs.Screen name="word/[id]" options={{ href: null }} />
      <Tabs.Screen name="wordle" options={{ href: null }} />
      <Tabs.Screen name="story-lab" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({ name, color, size, focused }) {
  return (
    <View style={[styles.tabIconPill, focused && styles.tabIconPillActive]}>
      <Ionicons name={name} size={size - 1} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconPill: {
    width: 38,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconPillActive: {
    backgroundColor: palette.primarySoft,
  },
});
