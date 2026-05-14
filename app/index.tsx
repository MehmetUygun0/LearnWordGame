import React from "react";
import { Redirect } from "expo-router";

import { useAuth } from "../lib/auth-context";
import { ScreenContainer } from "../components/ui/ScreenContainer";

export default function IndexPage() {
  const { isHydrating, isAuthenticated } = useAuth();

  if (isHydrating) {
    return <ScreenContainer />;
  }

  return <Redirect href={isAuthenticated ? "/(app)/home" : "/(auth)/login"} />;
}
