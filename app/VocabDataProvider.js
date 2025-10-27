'use client';

import { createContext, useContext } from 'react';

const VocabContext = createContext();

export function VocabDataProvider({ initialVocab, children }) {
  return (
    <VocabContext.Provider value={initialVocab}>
      {children}
    </VocabContext.Provider>
  );
}

export function useVocab() {
  return useContext(VocabContext);
}