import AsyncStorage from '@react-native-async-storage/async-storage';

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const persistUser = await AsyncStorage.getItem('persist:user');
    if (!persistUser) return null;

    const userState = JSON.parse(persistUser);
    const refreshToken = userState?.refreshToken;

    return refreshToken?.replace(/^"(.*)"$/, '$1');
  } catch (error) {
    console.error('❌ Failed to get refresh token from persist:', error);
    return null;
  }
};