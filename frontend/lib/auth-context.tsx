// @ts-nocheck
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  AuthSession,
  AuthUser,
  getCurrentUserRequest,
  loginRequest,
  refreshTokenRequest,
  registerRequest,
} from '@/services/auth';

const AUTH_SESSION_KEY = 'learn_word_game_auth_session';

const readStoredSession = async () => {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(AUTH_SESSION_KEY) ?? null;
  }

  return SecureStore.getItemAsync(AUTH_SESSION_KEY);
};

const writeStoredSession = async (value: string) => {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(AUTH_SESSION_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(AUTH_SESSION_KEY, value);
};

const clearStoredSession = async () => {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(AUTH_SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isHydrating: boolean;
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  login: (credentials: { userName: string; password: string }) => Promise<AuthUser>;
  register: (credentials: { userName: string; password: string; email?: string }) => Promise<AuthUser>;
  enterDemo: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const rawSession = await readStoredSession();
        if (!rawSession) {
          return;
        }

        const parsedSession = JSON.parse(rawSession) as AuthSession;

        if (!parsedSession?.accessToken) {
          await clearStoredSession();
          return;
        }

        if (parsedSession.mode === 'demo') {
          setUser(parsedSession.user);
          setToken(parsedSession.accessToken);
          setRefreshToken(parsedSession.refreshToken);
          return;
        }

        try {
          const profile = await getCurrentUserRequest(parsedSession.accessToken);
          setUser(profile);
          setToken(parsedSession.accessToken);
          setRefreshToken(parsedSession.refreshToken);
          return;
        } catch {
          const refreshedTokens = await refreshTokenRequest({
            accessToken: parsedSession.accessToken,
            refreshToken: parsedSession.refreshToken,
          });

          const profile = await getCurrentUserRequest(refreshedTokens.accessToken);
          const nextSession: AuthSession = {
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken,
            user: profile,
          };

          await writeStoredSession(JSON.stringify(nextSession));
          setUser(profile);
          setToken(refreshedTokens.accessToken);
          setRefreshToken(refreshedTokens.refreshToken);
        }
      } catch {
        await clearStoredSession();
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateSession();
  }, []);

  const saveSession = async (session: AuthSession | null) => {
    setUser(session?.user ?? null);
    setToken(session?.accessToken ?? null);
    setRefreshToken(session?.refreshToken ?? null);

    if (!session) {
      await clearStoredSession();
      return;
    }

    await writeStoredSession(JSON.stringify(session));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isHydrating,
      user,
      token,
      refreshToken,
      login: async (credentials) => {
        const tokens = await loginRequest(credentials);
        const profile = await getCurrentUserRequest(tokens.accessToken);
        await saveSession({
          ...tokens,
          user: profile,
        });
        return profile;
      },
      register: async (credentials) => {
        const tokens = await registerRequest(credentials);
        const profile = await getCurrentUserRequest(tokens.accessToken);
        await saveSession({
          ...tokens,
          user: profile,
        });
        return profile;
      },
      enterDemo: async () => {
        await saveSession({
          accessToken: 'demo-session',
          refreshToken: 'demo-refresh',
          mode: 'demo',
          user: {
            userName: 'Demo',
            level: 'A1',
            totalLearnedWords: 12,
            dailyNewWords: 10,
            levelBasedLearnedWords: [
              { level: 'A1', words: 8 },
              { level: 'A2', words: 4 },
            ],
          },
        });
      },
      logout: async () => {
        await saveSession(null);
      },
    }),
    [isHydrating, refreshToken, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
  }

  return context;
}
