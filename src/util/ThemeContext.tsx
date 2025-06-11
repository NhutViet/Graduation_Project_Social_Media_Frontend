import React, {createContext, useContext, useEffect, useState} from 'react';
import {loadTheme, saveTheme} from './themeStorage';

export type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const loadSavedTheme = async () => {
      const saved = await loadTheme();
      if (saved) setTheme(saved);
    };
    loadSavedTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
