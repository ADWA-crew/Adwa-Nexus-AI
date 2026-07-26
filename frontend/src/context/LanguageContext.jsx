<<<<<<< HEAD
﻿import { createContext, useEffect, useMemo, useState } from 'react';
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
=======
﻿import { createContext, useState } from 'react';
import { LANGUAGE_OPTIONS } from '../utils/constants';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0].value);

  const activeLanguage =
    LANGUAGE_OPTIONS.find((l) => l.value === language) ?? LANGUAGE_OPTIONS[0];

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, activeLanguage, languages: LANGUAGE_OPTIONS }}
    >
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
      {children}
    </LanguageContext.Provider>
  );
};
