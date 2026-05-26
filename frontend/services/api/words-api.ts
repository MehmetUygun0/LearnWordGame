import config from '@/lib/config';
import { apiRequest, readResponsePayload } from '@/lib/api';

export const fetchMyWords = async (token: string) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.WORDS.MY_WORDS,
    method: 'GET',
    token,
  });

  return {
    response,
    payload: await readResponsePayload(response),
  };
};

export const fetchDailyWords = async (token: string) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.WORDS.DAILY_WORD,
    method: 'POST',
    token,
  });

  return {
    response,
    payload: await readResponsePayload(response),
  };
};

export const postWordTestResults = async (
  token: string,
  results: { wordId: number; isCorrect: boolean }[]
) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.WORDS.TEST_RESULT,
    method: 'POST',
    token,
    body: JSON.stringify(results),
  });

  return {
    response,
    payload: await readResponsePayload(response),
  };
};

export const postUserWord = async ({
  token,
  body,
}: {
  token: string;
  body: Record<string, unknown>;
}) => {
  const response = await apiRequest({
    endpoint: config.ENDPOINTS.WORDS.ADD,
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });

  return {
    response,
    payload: await readResponsePayload(response),
  };
};
