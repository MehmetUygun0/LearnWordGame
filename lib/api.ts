// @ts-nocheck
import config from '@/lib/config';

const buildUrl = (path: string) => `${config.API_URL}${path}`;

type RequestOptions = RequestInit & {
  endpoint: string;
  token?: string;
};

// Ekranların doğrudan fetch URL yazmaması için ortak istek katmanı.
export const apiRequest = async ({ endpoint, headers, token, ...init }: RequestOptions) => {
  return fetch(buildUrl(endpoint), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
};

export const readResponsePayload = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => null);
};

export const getErrorMessage = (payload: unknown, fallback: string) => {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof payload.message === 'string' &&
    payload.message.trim()
  ) {
    return payload.message;
  }

  return fallback;
};
