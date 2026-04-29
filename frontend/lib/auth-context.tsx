// @ts-nocheck
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { AuthSession, AuthUser, getCurrentUserRequest, loginRequest, registerRequest } from '@/services/auth';

const AUTH_SESSION_KEY = 'learn_word_game_auth_session';

type AuthContextValue = {
  isAuthenticated: boolean;
  isHydrating: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (credentials: { userName: string; password: string }) => Promise<AuthUser>;
  register: (credentials: { userName: string; password: string; email?: string }) => Promise<AuthUser>;
  enterDemo: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const rawSession = await SecureStore.getItemAsync(AUTH_SESSION_KEY);
        if (!rawSession) {
          return;
        }

        const parsedSession = JSON.parse(rawSession) as AuthSession;

        if (!parsedSession?.token) {
          await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
          return;
        }

        if (parsedSession.mode === 'demo') {
          setUser(parsedSession.user);
          setToken(parsedSession.token);
          return;
        }

        const currentUser = await getCurrentUserRequest(parsedSession.token);
        setUser(currentUser);
        setToken(parsedSession.token);
      } catch {
        await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateSession();
  }, []);

  const saveSession = async (session: AuthSession | null) => {
    setUser(session?.user ?? null);
    setToken(session?.token ?? null);

    if (!session) {
      await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
      return;
    }

    await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isHydrating,
      user,
      token,
      login: async (credentials) => {
        const session = await loginRequest(credentials);
        await saveSession(session);
        return session.user;
      },
      register: async (credentials) => {
        const session = await registerRequest(credentials);
        await saveSession(session);
        return session.user;
      },
      enterDemo: async () => {
        await saveSession({
          token: 'demo-session',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          mode: 'demo',
          user: {
            id: 0,
            userName: 'Demo',
          },
        });
      },
      logout: async () => {
        await saveSession(null);
      },
    }),
    [isHydrating, token, user]
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
