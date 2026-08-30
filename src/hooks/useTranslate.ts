import { useContext } from 'react';
import en from '../locales/en';
import hi from '../locales/hi';
import { useLanguage } from '../context/LanguageContext';

export type Translations = typeof en;
export type TranslationKey = keyof Translations;

export default function useTranslate() {
  const { language } = useLanguage();
  return (key: TranslationKey | string) => {
    try {
      if (language === 'hi') return (hi as any)[key] ?? (en as any)[key] ?? String(key);
      return (en as any)[key] ?? String(key);
    } catch (e) {
      return String(key);
    }
  };
}
