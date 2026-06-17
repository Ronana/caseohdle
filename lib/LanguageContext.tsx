'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import translations, { type LangCode, type T } from './translations';

const STORAGE_KEY = 'caseohdle_lang';

interface LangCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: T;
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: translations['en'],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && saved in translations) setLangState(saved);
  }, []);

  function setLang(l: LangCode) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT(): T {
  return useContext(LanguageContext).t;
}

export function useLang(): { lang: LangCode; setLang: (l: LangCode) => void } {
  const { lang, setLang } = useContext(LanguageContext);
  return { lang, setLang };
}
