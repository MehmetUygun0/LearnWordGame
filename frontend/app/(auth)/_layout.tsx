// @ts-nocheck
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useAuth } from '@/lib/auth-context';

export default function RootLayout() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <ScreenContainer withBackgroundDecor={false} />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
