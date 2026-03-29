import { createContext, useState, useContext, ReactNode } from 'react';
import { fr } from '@/locales/fr';
import { ar } from '@/locales/ar';
import { en } from '@/locales/en';

type Language = 'fr' | 'ar' | 'en';

// Use a flexible type that accepts any subset of translation keys from any language
// This allows fr, ar, and en to have different numbers of keys while still being valid
type Translations = Partial<Record<keyof typeof fr, string>>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof fr) => string;
  lang: Language; // Ajout alias pour compatibilité
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const translations: Record<Language, Translations> = {
    fr,
    ar,
    en
  };

  const t = (key: keyof typeof fr): string => {
    const value = translations[language][key];
    return value || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, lang: language }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}