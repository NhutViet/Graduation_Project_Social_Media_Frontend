import React, {createContext, useContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {loadThemeForUser, saveThemeForUser} from './themeStorage'; // hàm ở trên
import {RootState} from '../../services/store';

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
  const userId = useSelector((state: RootState) => state.user.user?._id);

  useEffect(() => {
    const loadTheme = async () => {
      if (userId) {
        const savedTheme = await loadThemeForUser(userId);
        if (savedTheme) setTheme(savedTheme);
      }
    };
    loadTheme();
  }, [userId]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (userId) {
      await saveThemeForUser(userId, newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
