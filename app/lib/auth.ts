const TOKEN_KEY = 'gemajor_token';
const ROLE_KEY = 'gemajor_role';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, role?: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  if (role) localStorage.setItem(ROLE_KEY, role);
}

export function getRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ROLE_KEY);
}

export function setRole(role: string): void {
  localStorage.setItem(ROLE_KEY, role);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  window.location.href = '/login';
}

export function isAuthenticated(): boolean {
  return !!getToken();
}