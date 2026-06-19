import { getToken } from './auth';

const BASE_URL = 'http://localhost:3000/api/v1';

export async function api<T = any>(
  method: string,
  path: string,
  body?: any
): Promise<{ ok: boolean; data: T; status: number }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { ok: res.ok, data, status: res.status };
}