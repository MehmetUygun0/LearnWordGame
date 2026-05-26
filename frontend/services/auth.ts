import config from '@/lib/config';
import { apiRequest, getErrorMessage, readResponsePayload } from '@/lib/api';

export type AuthUser = {
  userName: string;
  level?: string;
  totalLearnedWords?: number;
  dailyNewWords?: number;
  createdAt?: string;
  levelBasedLearnedWords?: {
    level: string;
    words: number;
  }[];
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  mode?: 'api' | 'demo';
};

type LoginInput = {
  userName: string;
  password: string;
};

type RegisterInput = {
  userName: string;
  password: string;
  email?: string;
};

type ForgotPasswordInput = {
  identity: string;
};

type ResetPasswordInput = {
  userNameOrEmail: string;
  code: string;
  newPassword: string;
};

export const loginRequest = async ({ userName, password }: LoginInput) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.LOGIN,
    method: 'POST',
    body: JSON.stringify({
      userName: userName.trim(),
      password,
    }),
  });

  const payload = await readResponsePayload(response);
  ensureSuccess(response, payload, 'Giriş sırasında bir sorun oluştu.');

  return normalizeTokenPair(payload);
};

export const registerRequest = async ({ userName, password, email }: RegisterInput) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.REGISTER,
    method: 'POST',
    body: JSON.stringify({
      userName: userName.trim(),
      email: email?.trim() || '',
      password,
    }),
  });

  const payload = await readResponsePayload(response);
  ensureSuccess(response, payload, 'Kayıt sırasında bir sorun oluştu.');

  return loginRequest({
    userName,
    password,
  });
};

export const forgotPasswordRequest = async ({ identity }: ForgotPasswordInput) => {
  const response = await apiRequest({
    endpoint: `${config.ENDPOINTS.AUTH.FORGOT_PASSWORD}?usernameOrEmail=${encodeURIComponent(identity.trim())}`,
    method: 'POST',
  });

  const payload = await readResponsePayload(response);
  ensureSuccess(response, payload, 'Şifre sıfırlama isteği gönderilemedi.');

  return {
    message: getErrorMessage(payload, 'Sıfırlama kodu gönderildi.'),
  };
};

export const resetPasswordRequest = async ({
  userNameOrEmail,
  code,
  newPassword,
}: ResetPasswordInput) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.RESET_PASSWORD,
    method: 'POST',
    body: JSON.stringify({
      userNameOrEmail: userNameOrEmail.trim(),
      code: Number(code),
      newPassword,
    }),
  });

  const payload = await readResponsePayload(response);
  ensureSuccess(response, payload, 'Şifre güncellenemedi.');

  return {
    message: getErrorMessage(payload, 'Şifre başarıyla güncellendi.'),
  };
};

export const refreshTokenRequest = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.REFRESH,
    method: 'POST',
    body: JSON.stringify({
      accessToken,
      refreshToken,
    }),
  });

  const payload = await readResponsePayload(response);
  ensureSuccess(response, payload, 'Oturum yenilenemedi.');

  return normalizeTokenPair(payload);
};

export const getCurrentUserRequest = async (accessToken: string) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.PROFILE,
    method: 'GET',
    token: accessToken,
  });

  const payload = await readResponsePayload(response);
  ensureSuccess(response, payload, 'Profil alınamadı.');

  if (!payload || typeof payload !== 'object' || typeof payload.userName !== 'string') {
    throw new Error('Geçersiz profil yanıtı alındı.');
  }

  return {
    userName: payload.userName,
    level: typeof payload.level === 'string' ? payload.level : undefined,
    totalLearnedWords:
      typeof payload.totalLearnedWords === 'number' ? payload.totalLearnedWords : undefined,
    dailyNewWords:
      typeof payload.dailyNewWords === 'number' ? payload.dailyNewWords : undefined,
    createdAt: typeof payload.createdAt === 'string' ? payload.createdAt : undefined,
    levelBasedLearnedWords: Array.isArray(payload.levelBasedLearnedWords)
      ? payload.levelBasedLearnedWords
      : undefined,
  } satisfies AuthUser;
};

const normalizeTokenPair = (payload: unknown) => {
  const tokenPayload =
    payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  if (
    !tokenPayload ||
    typeof tokenPayload.accessToken !== 'string' ||
    typeof tokenPayload.refreshToken !== 'string'
  ) {
    throw new Error('Beklenen oturum yanıtı alınamadı.');
  }

  return {
    accessToken: tokenPayload.accessToken,
    refreshToken: tokenPayload.refreshToken,
  };
};

const ensureSuccess = (response: Response, payload: unknown, fallback: string) => {
  if (!response.ok) {
    throw new Error(getErrorMessage(payload, fallback));
  }
};
