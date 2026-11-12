import React, { createContext, useCallback, useContext, useState } from 'react';
import { getAppSettings, saveAppSettings } from '../db/database';
import { DEFAULT_APP_SETTINGS, type AppLanguage } from '../types/practice';
import { translations, type TranslationStrings } from './translations';

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_APP_SETTINGS.language,
  setLanguage: () => {},
  t: translations[DEFAULT_APP_SETTINGS.language],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      return getAppSettings().language;
    } catch {
      return DEFAULT_APP_SETTINGS.language;
    }
  });

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      const current = getAppSettings();
      saveAppSettings({ ...current, language: lang });
    } catch {
      // Keep UI responsive if DB write fails
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
