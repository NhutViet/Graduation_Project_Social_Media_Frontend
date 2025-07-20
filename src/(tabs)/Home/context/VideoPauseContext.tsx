import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VideoPauseData {
  videoId: string;
  timestamp: number;
  userId?: string;
}

interface VideoPauseContextType {
  pausedVideos: Set<string>;
  addPausedVideo: (videoId: string, userId?: string) => void;
  removePausedVideo: (videoId: string) => void;
  isPaused: (videoId: string) => boolean;
  clearPausedVideos: () => void;
  clearPausedVideosForUser: (userId: string) => void;
}

const VideoPauseContext = createContext<VideoPauseContextType | undefined>(undefined);

interface VideoPauseProviderProps {
  children: ReactNode;
  currentUserId?: string;
}

// Constants to avoid memory leaked
// Auto cleanup after 24 hours
// Limited a list set of paused video is 1000
const MAX_PAUSED_VIDEOS = 1000;
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'paused_videos_data';

export const VideoPauseProvider: React.FC<VideoPauseProviderProps> = ({
  children,
  currentUserId
}) => {
  const [pausedVideos, setPausedVideos] = useState<Set<string>>(new Set());
  const [pausedVideosData, setPausedVideosData] = useState<VideoPauseData[]>([]);

  // Load data from AsyncStorage whenever component mount
  useEffect(() => {
    loadPausedVideos();
  }, []);

  // Save data to AsyncStorage when pausedVideosData is changing
  useEffect(() => {
    savePausedVideos();
  }, [pausedVideosData]);

  // Cleanup old data when user switch account
  useEffect(() => {
    if (currentUserId) {
      cleanupOldData();
    } else {
      setPausedVideos(new Set());
    }
  }, [currentUserId]);

  const loadPausedVideos = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: VideoPauseData[] = JSON.parse(stored);
        // Cleanup expired data (older than 24h)
        const now = Date.now();
        const validData = data.filter(item =>
          now - item.timestamp < CLEANUP_INTERVAL
        );

        setPausedVideosData(validData);
      }
    } catch (error) {
      console.warn('Failed to load paused videos:', error);
    }
  }, []);

  const savePausedVideos = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pausedVideosData));
    } catch (error) {
      console.warn('Failed to save paused videos:', error);
    }
  }, [pausedVideosData]);

  const cleanupOldData = useCallback(() => {
    const now = Date.now();
    setPausedVideosData(prev => {
      const cleaned = prev.filter(item =>
        now - item.timestamp < CLEANUP_INTERVAL
      );

      // If out of context limit, keep some new items
      if (cleaned.length > MAX_PAUSED_VIDEOS) {
        return cleaned
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, MAX_PAUSED_VIDEOS);
      }

      return cleaned;
    });
  }, []);

  const filterVideosByCurrentUser = useCallback(() => {
    if (!currentUserId) {
      setPausedVideos(new Set());
      return;
    }

    const userVideos = pausedVideosData.filter(item =>
      item.userId === currentUserId
    );

    setPausedVideos(new Set(userVideos.map(item => item.videoId)));
  }, [pausedVideosData, currentUserId]);

  useEffect(() => {
    filterVideosByCurrentUser();
  }, [filterVideosByCurrentUser]);

  const addPausedVideo = useCallback((videoId: string, userId?: string) => {
    const now = Date.now();
    const actualUserId = userId || currentUserId;

    setPausedVideosData(prev => {
      const filtered = prev.filter(item => item.videoId !== videoId);

      // Add new entry
      const newData = [...filtered, {
        videoId,
        timestamp: now,
        userId: actualUserId
      }];

      // Limit size to prevent memory issues
      if (newData.length > MAX_PAUSED_VIDEOS) {
        return newData
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, MAX_PAUSED_VIDEOS);
      }

      return newData;
    });

    setPausedVideos(prev => new Set(prev).add(videoId));
  }, [currentUserId]);

  const removePausedVideo = useCallback((videoId: string) => {
    setPausedVideosData(prev =>
      prev.filter(item => item.videoId !== videoId)
    );

    setPausedVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
  }, []);

  const isPaused = useCallback((videoId: string) => {
    return pausedVideos.has(videoId);
  }, [pausedVideos]);

  const clearPausedVideos = useCallback(() => {
    setPausedVideosData([]);
    setPausedVideos(new Set());
  }, []);

  const clearPausedVideosForUser = useCallback((userId: string) => {
    setPausedVideosData(prev =>
      prev.filter(item => item.userId !== userId)
    );

    // Update current set if clearing current user
    if (userId === currentUserId) {
      setPausedVideos(new Set());
    }
  }, [currentUserId]);

  const value = {
    pausedVideos,
    addPausedVideo,
    removePausedVideo,
    isPaused,
    clearPausedVideos,
    clearPausedVideosForUser,
  };

  return (
    <VideoPauseContext.Provider value={value}>
      {children}
    </VideoPauseContext.Provider>
  );
};

export const useVideoPause = (): VideoPauseContextType => {
  const context = useContext(VideoPauseContext);
  if (!context) {
    throw new Error('useVideoPause must be used within a VideoPauseProvider');
  }
  return context;
};