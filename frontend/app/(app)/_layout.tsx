// @ts-nocheck
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        // Tüm uygulama içi sekmeler aynı görsel dilde kalsın diye stil burada merkezi tutuluyor.
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1730',
          borderTopWidth: 0,
          height: 84,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: '#6EA8FE',
        tabBarInactiveTintColor: '#7382B8',
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 12,
        },
      }}>
      {/* Sprint 1 sonunda kullanıcı göreceği ana sekmeler */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Study',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="flash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="options-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
