import AsyncStorage from '@react-native-async-storage/async-storage';

export const markStoryAsSeen = async (storyId: string, createdAt: string) => {
  const key = `seen_story_${storyId}`;
  const value = JSON.stringify({ createdAt });
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

    const { createdAt: storedAt } = JSON.parse(value);
    const createdTime = new Date(storedAt).getTime();
    const now = Date.now();

    // Check if story is older than 24 hours based on story creation time, not seen time
    const storyCreatedTime = new Date(createdAt).getTime();
    if (now - storyCreatedTime > 24 * 60 * 60 * 1000) {
      await AsyncStorage.removeItem(key);
      return false;
    }

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
    let cleanedCount = 0;

    for (const key of seenKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        try {
          const { createdAt } = JSON.parse(value);
          const createdTime = new Date(createdAt).getTime();

          // Remove if seen time is older than 24 hours
          if (now - createdTime > 24 * 60 * 60 * 1000) {
            await AsyncStorage.removeItem(key);
            cleanedCount++;
          }
        } catch (parseError) {
          // Remove corrupted entries
          await AsyncStorage.removeItem(key);
          cleanedCount++;
        }
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired story entries`);
    }
  } catch (error) {
    console.warn('Error cleaning expired stories:', error);
  }
};

// Utility function to check if a story should be visible (within 24 hours)
export const isStoryVisible = (createdAt: string): boolean => {
  try {
    const storyCreatedTime = new Date(createdAt).getTime();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    return (now - storyCreatedTime) < twentyFourHours;
  } catch (error) {
    console.warn('Error checking story visibility:', error);
    return false;
  }
};

// Debug function to log story age
export const getStoryAge = (createdAt: string): { hours: number; minutes: number; isExpired: boolean } => {
  try {
    const storyCreatedTime = new Date(createdAt).getTime();
    const now = Date.now();
    const diffMs = now - storyCreatedTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const isExpired = diffMs > (24 * 60 * 60 * 1000);

    return { hours, minutes, isExpired };
  } catch (error) {
    console.warn('Error calculating story age:', error);
    return { hours: 0, minutes: 0, isExpired: true };
  }
};

// Batch check multiple stories for seen status - more efficient for large lists
export const batchCheckStoriesSeen = async (
  stories: Array<{ id: string; createdAt: string }>
): Promise<Record<string, boolean>> => {
  const result: Record<string, boolean> = {};

  try {
    const keys = stories.map(story => `seen_story_${story.id}`);
    const values = await AsyncStorage.multiGet(keys);
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (let i = 0; i < values.length; i++) {
      const [key, value] = values[i];
      const storyId = stories[i].id;
      const storyCreatedAt = stories[i].createdAt;

      if (!value) {
        result[storyId] = false;
        continue;
      }

      try {
        const { createdAt: storedAt } = JSON.parse(value);
        const createdTime = new Date(storedAt).getTime();
        const storyCreatedTime = new Date(storyCreatedAt).getTime();

        // Check if story itself is older than 24 hours
        if (now - storyCreatedTime > 24 * 60 * 60 * 1000) {
          expiredKeys.push(key);
          result[storyId] = false;
          continue;
        }

        // Check if seen time is older than 24 hours
        if (now - createdTime > 24 * 60 * 60 * 1000) {
          expiredKeys.push(key);
          result[storyId] = false;
          continue;
        }

        result[storyId] = true;
      } catch (parseError) {
        expiredKeys.push(key);
        result[storyId] = false;
      }
    }

    // Clean up expired entries
    if (expiredKeys.length > 0) {
      await AsyncStorage.multiRemove(expiredKeys);
    }

    return result;
  } catch (error) {
    console.warn('Error batch checking stories:', error);
    // Fallback to individual checks
    for (const story of stories) {
      result[story.id] = await checkStorySeenInStorage(story.id, story.createdAt);
    }
    return result;
  }
};

// Optimized function to filter visible stories from a list
export const filterVisibleStories = (stories: Array<{ _id: string; createdAt: string }>) => {
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  return stories.filter(story => {
    try {
      const storyCreatedTime = new Date(story.createdAt).getTime();
      return (now - storyCreatedTime) < twentyFourHours;
    } catch (error) {
      console.warn('Error filtering story:', story._id, error);
      return false;
    }
  });
};
