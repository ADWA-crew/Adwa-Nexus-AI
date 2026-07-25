import { createContext, useState, useCallback } from 'react';

export const VisitorContext = createContext(null);

export const VisitorProvider = ({ children }) => {
  const [visitor, setVisitor] = useState(null);
  const [session, setSession] = useState(null);

  /* Stores the payload returned by POST /api/v1/visitors/sessions */
  const startSession = useCallback((data) => {
    setSession(data);
    setVisitor(data?.visitor ?? null);
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
    setVisitor(null);
  }, []);

  return (
    <VisitorContext.Provider
      value={{ visitor, setVisitor, session, setSession, startSession, clearSession }}
    >
      {children}
    </VisitorContext.Provider>
  );
};
