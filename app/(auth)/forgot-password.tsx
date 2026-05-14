import React, { useState } from "react";
import { Text } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { AppInput } from "../../components/ui/AppInput";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { forgotPasswordRequest } from "../../services/auth";
import { palette, typography } from "../../constants/theme";

export default function ForgotPasswordScreen() {
  const [identity, setIdentity] = useState("");
  const [message, setMessage] = useState("");

  return (
    <ScreenContainer scrollable>
      <SectionHeader eyebrow="Sifre" title="Sifre sifirlama akisi" description="Backend sifirlama endpoint'i gelene kadar kullanici akisini frontendte tamamlar." />
      <SurfaceCard>
        <AppInput label="Kullanici adi veya e-posta" value={identity} onChangeText={setIdentity} />
        <AppButton
          label="Sifirlama istegi gonder"
          onPress={async () => {
            const result = await forgotPasswordRequest(identity);
            setMessage(result.message);
          }}
        />
        {message ? <Text style={{ ...typography.caption, color: palette.success }}>{message}</Text> : null}
      </SurfaceCard>
    </ScreenContainer>
  );
}
