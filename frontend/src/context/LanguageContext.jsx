import { createContext, useState } from 'react';

export const LanguageContext = createContext(null);

const SUPPORTED_LANGUAGES = ['en', 'am'];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};
