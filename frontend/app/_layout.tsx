// @ts-nocheck
import React, { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { navigationTheme, palette } from '@/constants/theme';
import { AuthProvider } from '@/lib/auth-context';

// Splash screen'i fontlar yüklenene kadar açık tutuyoruz.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Fontlar hazır değilken ekranı render etmiyoruz; aksi halde kısa süreli stil kayması olur.
  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          {/* Giriş öncesi ekranlar */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* Uygulama içi ana akış */}
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" backgroundColor={palette.background} />
      </ThemeProvider>
    </AuthProvider>
  );
}
