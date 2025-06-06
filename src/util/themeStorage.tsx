import AsyncStorage from '@react-native-async-storage/async-storage';

export const getThemeKey = (userId: string) => `APP_THEME_${userId}`;

export const saveThemeForUser = async (
  userId: string,
  theme: 'light' | 'dark',
) => {
  await AsyncStorage.setItem(getThemeKey(userId), theme);
};

export const loadThemeForUser = async (
  userId: string,
): Promise<'light' | 'dark' | null> => {
  const theme = await AsyncStorage.getItem(getThemeKey(userId));
  return theme === 'dark' || theme === 'light' ? theme : null;
};
