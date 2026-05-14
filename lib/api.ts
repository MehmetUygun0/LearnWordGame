import { config } from "./config";

export async function apiRequest(path: string, init?: RequestInit) {
  return fetch(`${config.apiUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });
}

export async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
