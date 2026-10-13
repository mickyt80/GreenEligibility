import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES, translations } from './translations';

// The language the service is shown in: English ('en') or Welsh ('cy').
// The choice is kept in the browser tab's session storage, like the answers, so it lasts
// until the tab is closed. The address is the same in both languages.

const STORAGE_KEY = 'green-home-grant-language';

function readLanguage() {
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(saved) ? saved : 'en';
  } catch {
    // Storage can be blocked. Start in English.
    return 'en';
  }
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readLanguage);

  const setLanguage = useCallback((next) => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      // If storage is blocked, the language still changes for this page.
    }
    setLanguageState(next);
  }, []);

  // Tells browsers and screen readers which language the page is in.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const strings = translations[language];
    return {
      language,
      setLanguage,
      // The text for `key` in the current language.
      t: (key) => strings[key] ?? translations.en[key],
      // How a saved (English) answer is shown in the current language.
      tAnswer: (answer) => strings.answers[answer] ?? answer,
    };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  return useContext(LanguageContext);
}
