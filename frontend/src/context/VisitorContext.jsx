import { createContext, useState } from 'react';

export const VisitorContext = createContext(null);

export const VisitorProvider = ({ children }) => {
  const [visitor, setVisitor] = useState(null);

  return (
    <VisitorContext.Provider value={{ visitor, setVisitor }}>
      {children}
    </VisitorContext.Provider>
  );
};
