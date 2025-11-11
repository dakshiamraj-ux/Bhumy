'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

const translations: Record<string, any> = { en, hi };

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: string) => {
    if (translations[newLocale]) {
      setLocaleState(newLocale);
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if(fallbackResult === undefined) return key;
        }
        return fallbackResult || key;
      }
    }
    return result;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
