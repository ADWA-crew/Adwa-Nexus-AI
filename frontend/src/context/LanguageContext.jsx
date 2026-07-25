import { createContext, useState } from 'react';
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
      {children}
    </LanguageContext.Provider>
  );
};
