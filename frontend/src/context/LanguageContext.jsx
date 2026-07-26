import { createContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { APP_LANGUAGES } from '../components/common/LanguageSelector';

export const LanguageContext = createContext(null);

/**
 * Thin bridge so existing useLanguage() callers stay in sync with i18next.
 */
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState(i18n.resolvedLanguage || 'am');

  useEffect(() => {
    const onChange = (lng) => setLanguageState(lng);
    i18n.on('languageChanged', onChange);
    setLanguageState(i18n.resolvedLanguage || 'am');
    return () => i18n.off('languageChanged', onChange);
  }, [i18n]);

  const setLanguage = (value) => {
    i18n.changeLanguage(value);
  };

  const activeLanguage =
    APP_LANGUAGES.find((lang) => lang.value === language) ?? APP_LANGUAGES[1];

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      activeLanguage,
      languages: APP_LANGUAGES,
    }),
    [language, activeLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
