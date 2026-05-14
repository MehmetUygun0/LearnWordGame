import React, { useState } from "react";
import { Link, router } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { AppInput } from "../../components/ui/AppInput";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { useAuth } from "../../lib/auth-context";
import { palette, typography } from "../../constants/theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister() {
    if (password !== confirmPassword) {
      setMessage("Sifreler eslesmiyor.");
      return;
    }

    try {
      await register(userName, password);
      router.replace("/(app)/home");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kayit basarisiz.");
    }
  }

  return (
    <ScreenContainer scrollable>
      <SectionHeader eyebrow="Kayit" title="Yeni kullanici olustur." description="Kullanici kaydi dokumandaki ilk story icin hazir." />
      <SurfaceCard>
        <AppInput label="Kullanici adi" value={userName} onChangeText={setUserName} />
        <AppInput label="Sifre" value={password} onChangeText={setPassword} secureTextEntry />
        <AppInput label="Sifre tekrar" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <AppButton label="Kayit ol" onPress={handleRegister} />
        <Link href="/(auth)/login" style={styles.link}>Giris ekranina don</Link>
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  link: {
    ...typography.label,
    color: palette.secondary
  },
  message: {
    ...typography.caption,
    color: palette.warning
  }
});
