// @ts-nocheck
import config from '@/lib/config';
import { apiRequest, getErrorMessage, readResponsePayload } from '@/lib/api';

export type AuthUser = {
  id: number;
  userName: string;
};

export type AuthSession = {
  token: string;
  expiresAt: string;
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

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Giriş sırasında bir sorun oluştu.'));
  }

  return normalizeAuthSession(payload);
};

export const registerRequest = async ({ userName, password, email }: RegisterInput) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.REGISTER,
    method: 'POST',
    body: JSON.stringify({
      userName: userName.trim(),
      email: email?.trim() || undefined,
      password,
    }),
  });

  const payload = await readResponsePayload(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Kayıt sırasında bir sorun oluştu.'));
  }

  return normalizeAuthSession(payload);
};

export const forgotPasswordRequest = async ({ identity }: ForgotPasswordInput) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.FORGOT_PASSWORD,
    method: 'POST',
    body: JSON.stringify({
      identity: identity.trim(),
    }),
  });

  const payload = await readResponsePayload(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Şifre sıfırlama isteği gönderilemedi.'));
  }

  return {
    message: getErrorMessage(payload, 'Şifre sıfırlama bağlantısı gönderildi.'),
  };
};

export const getCurrentUserRequest = async (token: string) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.AUTH.ME,
    method: 'GET',
    token,
  });

  const payload = await readResponsePayload(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Oturum doğrulanamadı.'));
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    typeof payload.id !== 'number' ||
    typeof payload.userName !== 'string'
  ) {
    throw new Error('Geçersiz kullanıcı yanıtı alındı.');
  }

  return payload as AuthUser;
};

const normalizeAuthSession = (payload: unknown): AuthSession => {
  if (
    !payload ||
    typeof payload !== 'object' ||
    typeof payload.token !== 'string' ||
    typeof payload.expiresAt !== 'string' ||
    !payload.user ||
    typeof payload.user !== 'object' ||
    typeof payload.user.id !== 'number' ||
    typeof payload.user.userName !== 'string'
  ) {
    throw new Error('Beklenen oturum yanıtı alınamadı.');
  }

  return {
    token: payload.token,
    expiresAt: payload.expiresAt,
    user: {
      id: payload.user.id,
      userName: payload.user.userName,
    },
  };
};
