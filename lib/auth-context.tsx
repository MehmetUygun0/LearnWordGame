import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { AuthUser, getDemoUser, loginRequest, registerRequest } from "../services/auth";

const STORAGE_KEY = "learnwordgame-session";

async function readStoredSession() {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(STORAGE_KEY) ?? null;
  }

  return SecureStore.getItemAsync(STORAGE_KEY);
}

async function writeStoredSession(value: string) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(STORAGE_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(STORAGE_KEY, value);
}

async function clearStoredSession() {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(STORAGE_KEY);
}

type AuthContextValue = {
  user: AuthUser | null;
  isHydrating: boolean;
  isAuthenticated: boolean;
  login: (userName: string, password: string) => Promise<void>;
  register: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  enterDemo: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const raw = await readStoredSession();
        if (raw) {
          setUser(JSON.parse(raw) as AuthUser);
        }
      } finally {
        setIsHydrating(false);
      }
    }

    hydrate();
  }, []);

  async function save(nextUser: AuthUser | null) {
    setUser(nextUser);
    if (!nextUser) {
      await clearStoredSession();
      return;
    }

    await writeStoredSession(JSON.stringify(nextUser));
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isHydrating,
      isAuthenticated: Boolean(user),
      login: async (userName, password) => {
        const result = await loginRequest(userName, password);
        await save(result.user);
      },
      register: async (userName, password) => {
        const result = await registerRequest(userName, password);
        await save(result.user);
      },
      logout: async () => {
        await save(null);
      },
      enterDemo: async () => {
        await save(getDemoUser());
      }
    }),
    [isHydrating, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
