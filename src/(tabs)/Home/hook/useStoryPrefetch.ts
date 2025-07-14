import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../services/store';
import { fetchStoryDetails } from '../../../../services/StoryRedux/StorySlice';

interface StoryPrefetchCache {
  [userId: string]: {
    data: any[];
    timestamp: number;
    isLoading: boolean;
    priority: number;
    isRequested: boolean; // ✅ Track if story details have been requested
  };
}

export const useStoryPrefetch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cache = useRef<StoryPrefetchCache>({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const MAX_CACHE_SIZE = 10; // ✅ Limit cache size for memory management

  // ✅ Optimize cache eviction strategy
  const evictOldestCache = useCallback(() => {
    const cacheEntries = Object.entries(cache.current);
    if (cacheEntries.length < MAX_CACHE_SIZE) return;

    // Sort by priority (lower = evict first) and timestamp
    const sortedEntries = cacheEntries.sort((a, b) => {
      const priorityDiff = a[1].priority - b[1].priority;
      if (priorityDiff !== 0) return priorityDiff;
      return a[1].timestamp - b[1].timestamp;
    });

    // Remove oldest entries to make room
    const toRemove = sortedEntries.slice(0, Math.floor(MAX_CACHE_SIZE / 2));
    toRemove.forEach(([userId]) => {
      delete cache.current[userId];
    });
  }, []);

  // ✅ Lazy load story details only when needed
  const prefetchStoryData = useCallback(async (userId: string, storyIds: string[], priority: number = 1, forceFetch: boolean = false) => {
    const now = Date.now();
    const cached = cache.current[userId];

    // Check if data is already cached and not expired
    if (cached && (now - cached.timestamp) < CACHE_DURATION && !cached.isLoading) {
      // ✅ Update priority for LRU-like behavior
      cached.priority = Math.min(cached.priority + 1, 10);
      cached.timestamp = now; // Refresh timestamp
      return cached.data;
    }

    // ✅ If not forced and already requested, don't fetch again
    if (!forceFetch && cached?.isRequested && !cached.isLoading) {
      return null;
    }

    // Prevent multiple simultaneous requests for same user
    if (cached?.isLoading) {
      return null;
    }

    try {
      // ✅ Evict old cache entries if needed
      evictOldestCache();

      // Mark as loading and requested
      cache.current[userId] = {
        data: [],
        timestamp: now,
        isLoading: true,
        priority,
        isRequested: true,
      };

      const detailRes = await dispatch(
        fetchStoryDetails({ storyIds })
      ).unwrap();

      // ✅ Optimize story processing
      const processedStories = detailRes.map((story: any) => ({
        ...story,
        uriVideo: story.mediaUrl?.endsWith('.m3u8') ? story.mediaUrl : null,
        image: story.mediaUrl?.endsWith('.jpg') || story.mediaUrl?.endsWith('.png') 
          ? story.mediaUrl 
          : null,
        isLoading: false,
        // ✅ Add thumbnail for faster loading
        thumbnail: story.thumbnail || story.mediaUrl,
      }));

      // Cache the processed data
      cache.current[userId] = {
        data: processedStories,
        timestamp: now,
        isLoading: false,
        priority,
        isRequested: true,
      };

      return processedStories;
    } catch (error) {
      console.error('Error prefetching story data:', error);
      // Mark as not loading on error
      if (cache.current[userId]) {
        cache.current[userId].isLoading = false;
      }
      return null;
    }
  }, [dispatch, evictOldestCache]);

  const getCachedStoryData = useCallback((userId: string) => {
    const cached = cache.current[userId];
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      // ✅ Update access time and priority
      cached.timestamp = now;
      cached.priority = Math.min(cached.priority + 1, 10);
      return cached.data;
    }

    return null;
  }, []);

  // ✅ Check if story details have been requested for a user
  const isStoryDetailsRequested = useCallback((userId: string) => {
    const cached = cache.current[userId];
    return cached?.isRequested || false;
  }, []);

  // ✅ Optimize cache management
  const clearCache = useCallback(() => {
    cache.current = {};
  }, []);

  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    Object.keys(cache.current).forEach(userId => {
      const cached = cache.current[userId];
      if (cached && (now - cached.timestamp) >= CACHE_DURATION) {
        delete cache.current[userId];
      }
    });
  }, []);

  // ✅ Add cache stats for debugging
  const getCacheStats = useCallback(() => {
    const entries = Object.values(cache.current);
    return {
      size: entries.length,
      loading: entries.filter(e => e.isLoading).length,
      expired: entries.filter(e => Date.now() - e.timestamp >= CACHE_DURATION).length,
      requested: entries.filter(e => e.isRequested).length,
    };
  }, []);

  // ✅ Preload adjacent stories for smoother navigation
  const preloadAdjacentStories = useCallback(async (
    currentUserId: string, 
    allUsers: any[], 
    direction: 'next' | 'prev' = 'next'
  ) => {
    const currentIndex = allUsers.findIndex(u => u._id === currentUserId);
    if (currentIndex === -1) return;

    const adjacentIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    const adjacentUser = allUsers[adjacentIndex];

    if (adjacentUser?.stories?.length > 0) {
      // Lower priority for adjacent stories
      await prefetchStoryData(adjacentUser._id, adjacentUser.stories, 0.5);
    }
  }, [prefetchStoryData]);

  // ✅ Lazy load story details when user is about to view stories
  const lazyLoadStoryDetails = useCallback(async (userId: string, storyIds: string[]) => {
    // Only fetch if not already requested
    if (!isStoryDetailsRequested(userId)) {
      return await prefetchStoryData(userId, storyIds, 1, true);
    }
    return getCachedStoryData(userId);
  }, [prefetchStoryData, isStoryDetailsRequested, getCachedStoryData]);

  // ✅ Prefetch story details on hover/focus for better UX
  const prefetchOnHover = useCallback(async (userId: string, storyIds: string[]) => {
    // Only prefetch if not already requested and not loading
    if (!isStoryDetailsRequested(userId)) {
      // Use lower priority for hover prefetch
      await prefetchStoryData(userId, storyIds, 0.5, false);
    }
  }, [prefetchStoryData, isStoryDetailsRequested]);

  return {
    prefetchStoryData,
    getCachedStoryData,
    clearCache,
    clearExpiredCache,
    getCacheStats,
    preloadAdjacentStories,
    isStoryDetailsRequested,
    lazyLoadStoryDetails,
    prefetchOnHover,
  };
}; 