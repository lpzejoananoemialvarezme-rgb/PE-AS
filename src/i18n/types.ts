export type AppLanguage = 'es' | 'en' | 'pt';

export const LANGUAGE_STORAGE_KEY = 'penas_language_v1';

export const SUPPORTED_LANGUAGES: Array<{
  code: AppLanguage;
  shortLabel: string;
  nativeLabel: string;
}> = [
  { code: 'es', shortLabel: 'ES', nativeLabel: 'Español' },
  { code: 'en', shortLabel: 'EN', nativeLabel: 'English' },
  { code: 'pt', shortLabel: 'PT', nativeLabel: 'Português' }
];

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'es' || value === 'en' || value === 'pt';
}

export function getStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isAppLanguage(saved)) return saved;
  } catch {
    // Ignore storage access errors
  }
  return 'es';
}
