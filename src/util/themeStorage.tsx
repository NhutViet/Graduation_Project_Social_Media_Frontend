import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'APP_THEME';

export const saveTheme = async (theme: 'light' | 'dark') => {
  await AsyncStorage.setItem(THEME_KEY, theme);
};

export const loadTheme = async (): Promise<'light' | 'dark' | null> => {
  const theme = await AsyncStorage.getItem(THEME_KEY);
  return theme === 'dark' || theme === 'light' ? theme : null;
};
