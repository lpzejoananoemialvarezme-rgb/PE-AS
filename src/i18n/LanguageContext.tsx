import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppLanguage, LANGUAGE_STORAGE_KEY, getStoredLanguage } from './types';
import { tataVoice } from '../utils/tataVoice';

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

const DOCUMENT_TITLES: Record<AppLanguage, string> = {
  es: 'Peñas: Sendero del Guardián — Aventura Cultural y Natural en La Paz',
  en: 'Peñas: Path of the Guardian — Cultural & Nature Adventure in La Paz',
  pt: 'Peñas: Caminho do Guardião — Aventura Cultural e Natural em La Paz'
};

const LanguageContext = createContext<LanguageContextValue>({
  language: 'es',
  setLanguage: () => {}
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const initial = getStoredLanguage();
    tataVoice.setLanguage(initial);
    return initial;
  });

  const setLanguage = useCallback((nextLang: AppLanguage) => {
    setLanguageState((prev) => {
      if (prev === nextLang) return prev;
      tataVoice.stop();
      tataVoice.setLanguage(nextLang);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
      } catch {
        // Ignore storage quota errors
      }
      return nextLang;
    });
  }, []);

  useEffect(() => {
    tataVoice.setLanguage(language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.title = DOCUMENT_TITLES[language];
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
