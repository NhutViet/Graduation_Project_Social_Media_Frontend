import AsyncStorage from '@react-native-async-storage/async-storage';

export const markStoryAsSeen = async (storyId: string, createdAt: string) => {
  const key = `seen_story_${storyId}`;
  const value = JSON.stringify({createdAt});
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn('Lỗi khi lưu trạng thái seen story:', error);
  }
};

export const checkStorySeenInStorage = async (
  storyId: string,
  createdAt: string,
): Promise<boolean> => {
  const key = `seen_story_${storyId}`;
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return false;

    const {createdAt: storedAt} = JSON.parse(value);
    const createdTime = new Date(storedAt).getTime();
    const now = Date.now();

    // Nếu đã quá 24h thì xóa khỏi bộ nhớ
    if (now - createdTime > 24 * 60 * 60 * 1000) {
      await AsyncStorage.removeItem(key);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Lỗi khi kiểm tra trạng thái seen story:', error);
    return false;
  }
};

export const clearExpiredSeenStories = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const seenKeys = keys.filter(k => k.startsWith('seen_story_'));
    const now = Date.now();

    for (const key of seenKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        const {createdAt} = JSON.parse(value);
        const createdTime = new Date(createdAt).getTime();
        if (now - createdTime > 24 * 60 * 60 * 1000) {
          await AsyncStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.warn('Lỗi khi dọn dẹp story hết hạn:', error);
  }
};
