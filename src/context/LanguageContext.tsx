import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '../types/language';
import i18n from '../i18n';

const STORAGE_KEY = 'psv_language';
const DEFAULT: Language = 'en';

type ContextShape = {
  language: Language;
  setLanguage: (l: Language) => void;
};

export const LanguageContext = createContext<ContextShape>({
  language: DEFAULT,
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === 'hi') return 'hi';
      return 'en';
    } catch (e) {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {
      // ignore
    }
    void i18n.changeLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
