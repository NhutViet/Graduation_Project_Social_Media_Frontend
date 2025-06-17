import React, { createContext, useContext, useState } from 'react';

type TabLoadingContextType = {
  loadingTabs: Record<string, boolean>;
  setTabLoading: (tabName: string, isLoading: boolean) => void;
};

const TabLoadingContext = createContext<TabLoadingContextType | undefined>(undefined);

export const useTabLoading = () => {
  const context = useContext(TabLoadingContext);
  if (!context) throw new Error('Missing TabLoadingProvider');
  return context;
};

export const TabLoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingTabs, setLoadingTabs] = useState<Record<string, boolean>>({});

  const setTabLoading = (tabName: string, isLoading: boolean) => {
    setLoadingTabs(prev => ({ ...prev, [tabName]: isLoading }));
  };

  return (
    <TabLoadingContext.Provider value={{ loadingTabs, setTabLoading }}>
      {children}
    </TabLoadingContext.Provider>
  );
};