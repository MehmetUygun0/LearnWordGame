// @ts-nocheck
import config from '@/lib/config';

const buildUrl = (path: string) => `${config.API_URL}${path}`;

type RequestOptions = RequestInit & {
  endpoint: string;
};

// Ekranların doğrudan fetch URL yazmaması için ortak istek katmanı.
export const apiRequest = async ({ endpoint, headers, ...init }: RequestOptions) => {
  return fetch(buildUrl(endpoint), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};
