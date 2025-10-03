import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, TranslationSet } from '../i18n/translations';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationSet;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};
