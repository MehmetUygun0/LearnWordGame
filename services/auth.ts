import { apiRequest, readJson } from "../lib/api";
import { config } from "../lib/config";

export type AuthUser = {
  userName: string;
  dailyNewWords: number;
  dailyQuestionCount: number;
  totalLearnedWords: number;
  successRate: number;
  level: string;
};

const demoUser: AuthUser = {
  userName: "Demo",
  dailyNewWords: 10,
  dailyQuestionCount: 20,
  totalLearnedWords: 14,
  successRate: 74,
  level: "A1"
};

export async function loginRequest(userName: string, password: string) {
  const response = await apiRequest(
    `${config.endpoints.auth.login}?username=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`,
    { method: "GET" }
  );

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(readBackendMessage(payload, "Giris basarisiz."));
  }

  return {
    token: "legacy-session",
    user: { ...demoUser, userName }
  };
}

export async function registerRequest(userName: string, password: string) {
  const response = await apiRequest(
    `${config.endpoints.auth.register}?username=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`,
    { method: "POST" }
  );

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(readBackendMessage(payload, "Kayit basarisiz."));
  }

  return {
    token: "legacy-session",
    user: { ...demoUser, userName }
  };
}

export async function forgotPasswordRequest(identity: string) {
  return {
    message: `${identity} icin sifre sifirlama talebi hazirlandi.`
  };
}

export function getDemoUser() {
  return demoUser;
}

function readBackendMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message;
  }

  return fallback;
}
