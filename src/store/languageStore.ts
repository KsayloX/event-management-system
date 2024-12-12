import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { translations } from './translations';

interface LanguageStore {
  language: 'en' | 'ru';
  isLoaded: boolean;
  setLanguage: (lang: 'en' | 'ru') => void;
  t: (key: string, params?: Record<string, any>) => string;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'ru',
      isLoaded: false,
      setLanguage: (lang) => set({ language: lang }),
      t: (key, params) => {
        const { language } = get();
        let translation = translations[language]?.[key];
        
        if (!translation) {
          console.warn(`Missing translation for key: ${key} in language: ${language}`);
          translation = translations['en']?.[key] || key;
        }
        
        if (!params) return translation;
        
        return Object.entries(params).reduce(
          (str, [key, value]) => str.replace(`{${key}}`, String(value)),
          translation
        );
      },
    }),
    {
      name: 'language-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            isLoaded: true,
            language: persistedState.language || 'ru'
          };
        }
        return persistedState;
      },
    }
  )
);