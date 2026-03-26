// @ts-nocheck
import React from 'react';
import { Redirect } from 'expo-router';

// Uygulama ilk açıldığında kullanıcıyı auth akışına yönlendiriyoruz.
export default function IndexScreen() {
  return <Redirect href="/(auth)/login" />;
}
