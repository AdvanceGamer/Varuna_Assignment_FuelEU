const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    // try to surface server JSON errors nicely
    try { throw new Error(JSON.parse(text).error ?? text); }
    catch { throw new Error(text || res.statusText); }
  }
  return res.json();
}

export const api = {
  get:  <T>(path: string) => http<T>(path),
  post: <T>(path: string, body?: unknown) =>
    http<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
};

export { BASE as API_BASE_URL };
