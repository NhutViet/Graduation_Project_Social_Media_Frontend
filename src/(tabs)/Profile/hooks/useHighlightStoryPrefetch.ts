import {useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@services/store';
import {fetchStoryDetails} from '@services/StoryRedux/StorySlice';

interface HighlightPrefetchCache {
  [highlightId: string]: {
    data: any[];
    timestamp: number;
    isLoading: boolean;
    priority: number;
  };
}

export const useHighlightStoryPrefetch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cache = useRef<HighlightPrefetchCache>({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const MAX_CACHE_SIZE = 10; // Limit cache size for memory management

  // Optimize cache eviction strategy
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
    toRemove.forEach(([highlightId]) => {
      delete cache.current[highlightId];
    });
  }, []);

  const prefetchHighlightStoryData = useCallback(
    async (highlightId: string, storyIds: string[], priority: number = 1) => {
      const now = Date.now();
      const cached = cache.current[highlightId];

      // Check if data is already cached and not expired
      if (
        cached &&
        now - cached.timestamp < CACHE_DURATION &&
        !cached.isLoading
      ) {
        // Update priority for LRU-like behavior
        cached.priority = Math.min(cached.priority + 1, 10);
        cached.timestamp = now; // Refresh timestamp
        return cached.data;
      }

      // Prevent multiple simultaneous requests for same highlight
      if (cached?.isLoading) {
        return null;
      }

      try {
        // Evict old cache entries if needed
        evictOldestCache();

        // Mark as loading
        cache.current[highlightId] = {
          data: [],
          timestamp: now,
          isLoading: true,
          priority,
        };

        const detailRes = await dispatch(
          fetchStoryDetails({storyIds}),
        ).unwrap();

        // Optimize story processing
        const processedStories = detailRes.map((story: any) => ({
          ...story,
          uriVideo: story.mediaUrl?.endsWith('.m3u8') ? story.mediaUrl : null,
          image:
            story.mediaUrl?.endsWith('.jpg') || story.mediaUrl?.endsWith('.png')
              ? story.mediaUrl
              : null,
          isLoading: false,
          // Add thumbnail for faster loading
          thumbnail: story.thumbnail || story.mediaUrl,
        }));

        // Cache the processed data
        cache.current[highlightId] = {
          data: processedStories,
          timestamp: now,
          isLoading: false,
          priority,
        };

        return processedStories;
      } catch (error) {
        console.error('Error prefetching highlight story data:', error);
        // Mark as not loading on error
        if (cache.current[highlightId]) {
          cache.current[highlightId].isLoading = false;
        }
        return null;
      }
    },
    [dispatch, evictOldestCache],
  );

  const getCachedHighlightStoryData = useCallback((highlightId: string) => {
    const cached = cache.current[highlightId];
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      // Update access time and priority
      cached.timestamp = now;
      cached.priority = Math.min(cached.priority + 1, 10);
      return cached.data;
    }

    return null;
  }, []);

  // Optimize cache management
  const clearCache = useCallback(() => {
    cache.current = {};
  }, []);

  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    Object.keys(cache.current).forEach(highlightId => {
      const cached = cache.current[highlightId];
      if (cached && now - cached.timestamp >= CACHE_DURATION) {
        delete cache.current[highlightId];
      }
    });
  }, []);

  // Add cache stats for debugging
  const getCacheStats = useCallback(() => {
    const entries = Object.values(cache.current);
    return {
      size: entries.length,
      loading: entries.filter(e => e.isLoading).length,
      expired: entries.filter(e => Date.now() - e.timestamp >= CACHE_DURATION)
        .length,
    };
  }, []);

  // Preload adjacent highlights for smoother navigation
  const preloadAdjacentHighlights = useCallback(
    async (
      currentHighlightId: string,
      allHighlights: any[],
      direction: 'next' | 'prev' = 'next',
    ) => {
      const currentIndex = allHighlights.findIndex(
        h => h._id === currentHighlightId,
      );
      if (currentIndex === -1) return;

      const adjacentIndex =
        direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      const adjacentHighlight = allHighlights[adjacentIndex];

      if (adjacentHighlight?.storyId?.length > 0) {
        // Lower priority for adjacent highlights
        await prefetchHighlightStoryData(
          adjacentHighlight._id,
          adjacentHighlight.storyId,
          0.5,
        );
      }
    },
    [prefetchHighlightStoryData],
  );

  // Preload first 5 highlights for better performance
  const preloadInitialHighlights = useCallback(
    async (highlights: any[]) => {
      const highlightsToPreload = highlights.slice(0, 5);

      for (const highlight of highlightsToPreload) {
        if (highlight.storyId?.length > 0) {
          try {
            await prefetchHighlightStoryData(
              highlight._id,
              highlight.storyId,
              1, // High priority for initial highlights
            );
          } catch (error) {
            console.log('Error prefetching highlight:', highlight._id);
          }
        }
      }
    },
    [prefetchHighlightStoryData],
  );

  return {
    prefetchHighlightStoryData,
    getCachedHighlightStoryData,
    clearCache,
    clearExpiredCache,
    getCacheStats,
    preloadAdjacentHighlights,
    preloadInitialHighlights,
  };
};
