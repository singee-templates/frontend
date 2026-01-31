import type { AppThemeName } from './index';

const THEME_COOKIE_KEY = 'app-theme';

function parseCookieHeader(cookieHeader: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey) continue;
    out[rawKey] = decodeURIComponent(rest.join('='));
  }
  return out;
}

export function getThemeNameFromCookieHeader(
  cookieHeader: string | undefined,
  allowed: ReadonlyArray<AppThemeName>,
): AppThemeName | undefined {
  if (!cookieHeader) return undefined;
  const cookies = parseCookieHeader(cookieHeader);
  const value = cookies[THEME_COOKIE_KEY];
  if (!value) return undefined;
  return (allowed as ReadonlyArray<string>).includes(value)
    ? (value as AppThemeName)
    : undefined;
}

export function setThemeCookie(themeName: AppThemeName) {
  const maxAgeSeconds = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${THEME_COOKIE_KEY}=${encodeURIComponent(themeName)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}
