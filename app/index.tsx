// @ts-nocheck
import React from 'react';
import { Redirect } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useAuth } from '@/lib/auth-context';

// Uygulama ilk açıldığında oturum durumuna göre doğru akışa yönlendiriyoruz.
export default function IndexScreen() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <ScreenContainer withBackgroundDecor={false} />;
  }

  return <Redirect href={isAuthenticated ? '/(app)/home' : '/(auth)/login'} />;
}
