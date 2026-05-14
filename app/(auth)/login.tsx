import React, { useState } from "react";
import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { AppInput } from "../../components/ui/AppInput";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { useAuth } from "../../lib/auth-context";
import { palette, typography } from "../../constants/theme";

export default function LoginScreen() {
  const { login, enterDemo } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    const trimmedUserName = userName.trim();

    if (!trimmedUserName || !password.trim()) {
      setMessage("Kullanici adi ve sifre zorunlu.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await login(trimmedUserName, password);
      router.replace("/(app)/home");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Giris basarisiz.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer scrollable>
      <SectionHeader
        eyebrow="Story 1"
        title="Kelime ezberleme oyununa giris yap."
        description="Kayit, giris ve sifremi unuttum akislarini bu grupta topladik."
      />
      <SurfaceCard>
        <AppInput
          label="Kullanici adi"
          value={userName}
          onChangeText={setUserName}
          placeholder="ogrenci01"
          error={message ? message : undefined}
        />
        <AppInput
          label="Sifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="******"
          error={message ? " " : undefined}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <AppButton label={isLoading ? "Giris yapiliyor..." : "Giris yap"} onPress={handleLogin} disabled={isLoading} />
        <AppButton label="Demo ile devam et" variant="secondary" onPress={async () => {
          await enterDemo();
          router.replace("/(app)/home");
        }} />
      </SurfaceCard>
      <View style={styles.links}>
        <Link href="/(auth)/register" style={styles.link}>Kayit ol</Link>
        <Link href="/(auth)/forgot-password" style={styles.link}>Sifremi unuttum</Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  links: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  link: {
    ...typography.label,
    color: palette.secondary
  },
  message: {
    ...typography.caption,
    color: palette.warning
  }
});
