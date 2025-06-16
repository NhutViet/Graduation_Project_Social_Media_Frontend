// Components/ExploreTile.tsx
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import React, {useMemo, useCallback} from 'react';
import Video from 'react-native-video';
import {Media} from '../../../../services/postRedux/postTypes';

// Calculate dimensions once at module level
const screenWidth = Dimensions.get('window').width;
const GAP = 2;
const SMALL = (screenWidth - GAP * 3) / 3;
const BIG = SMALL * 2 + GAP;

interface ExploreSectionProps {
  media: Media[];
  index: number;
  currentVisibleIndex: number | null;
  isPause: boolean;
  isFocused: boolean;
  isFocusedPage: boolean;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({
  media,
  index,
  currentVisibleIndex,
  isPause,
  isFocused,
  isFocusedPage,
}) => {
  // Early return if no media
  if (!media || media.length === 0) {
    return null;
  }

  // FIXED: Optimize expensive calculations with better dependencies
  const { bigMedia, smallMedias, isReversed, shouldPlayVideo } = useMemo(() => {
    const reversed = index % 2 === 0;
    
    // Find big media (prefer video, fallback to first item)
    const big = media.find(m => !!m.videoUrl) || media[0];
    
    // Filter out the big media for small items, limit to 4
    const small = media.filter(m => m._id !== big._id).slice(0, 4);
    
    // Determine if video should play
    const isPlaying = currentVisibleIndex === index;
    const shouldPlay = isPlaying && !isPause && !isFocused && isFocusedPage;
    
    return {
      bigMedia: big,
      smallMedias: small,
      isReversed: reversed,
      shouldPlayVideo: shouldPlay,
    };
  }, [media, index, currentVisibleIndex, isPause, isFocused, isFocusedPage]);

  // FIXED: Use useCallback for press handlers to prevent re-renders
  const handleBigMediaPress = useCallback(() => {
    console.log(`Big media: ${bigMedia?._id}`);
  }, [bigMedia?._id]);

  const handleSmallMediaPress = useCallback((mediaId: string) => {
    console.log(`Small media: ${mediaId}`);
  }, []);

  // FIXED: Memoize big media render with proper error handling
  const renderBigMedia = useMemo(() => {
    if (!bigMedia) return null;

    return (
      <TouchableOpacity
        onPress={handleBigMediaPress}
        style={{
          width: SMALL,
          height: BIG,
          backgroundColor: '#ccc',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
        {bigMedia.videoUrl && shouldPlayVideo ? (
          <Video
            source={{uri: bigMedia.videoUrl}}
            style={{flex: 1}}
            resizeMode="cover"
            repeat
            muted
            paused={false}
            onError={(error) => console.log('Big video error:', error)}
            onLoad={() => {}} // Prevent unnecessary re-renders
            onLoadStart={() => {}} // Prevent unnecessary re-renders
          />
        ) : bigMedia.imageUrl ? (
          <Image
            source={{uri: bigMedia.imageUrl}}
            style={{flex: 1}}
            resizeMode="cover"
            onError={() => console.log('Big image error:', bigMedia.imageUrl)}
            onLoad={() => {}} // Prevent unnecessary re-renders
          />
        ) : (
          <View style={{flex: 1, backgroundColor: '#000'}} />
        )}
      </TouchableOpacity>
    );
  }, [bigMedia, shouldPlayVideo, handleBigMediaPress]);

  // FIXED: Optimize small media rendering
  const renderSmallMedias = useMemo(() => {
    if (!smallMedias || smallMedias.length === 0) {
      return <View style={{width: SMALL * 2 + GAP}} />;
    }

    return (
      <View
        style={{
          width: SMALL * 2 + GAP,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: GAP,
        }}>
        {smallMedias.map(item => {
          return (
            <TouchableOpacity
              onPress={() => handleSmallMediaPress(item._id)}
              key={item._id}
              style={{
                width: SMALL,
                height: SMALL,
                backgroundColor: '#eee',
                borderRadius: 2,
                overflow: 'hidden',
              }}>
              {item.videoUrl && shouldPlayVideo ? (
                <Video
                  source={{uri: item.videoUrl}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover"
                  repeat
                  muted
                  paused={false}
                  onError={(error) => console.log('Small video error:', error)}
                  onLoad={() => {}} // Prevent unnecessary re-renders
                  onLoadStart={() => {}} // Prevent unnecessary re-renders
                />
              ) : item.imageUrl ? (
                <Image
                  source={{uri: item.imageUrl}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover"
                  onError={() => console.log('Small image error:', item.imageUrl)}
                  onLoad={() => {}} // Prevent unnecessary re-renders
                />
              ) : (
                <View style={{flex: 1, backgroundColor: '#000'}} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [smallMedias, shouldPlayVideo, handleSmallMediaPress]);

  return (
    <View
      style={{
        flexDirection: isReversed ? 'row' : 'row-reverse',
        marginBottom: GAP,
        gap: GAP,
        paddingHorizontal: 1,
      }}>
      {renderBigMedia}
      {renderSmallMedias}
    </View>
  );
};

// FIXED: Improved memo comparison function
export default React.memo(ExploreSection, (prevProps, nextProps) => {
  // Quick checks first (most likely to change)
  if (
    prevProps.currentVisibleIndex !== nextProps.currentVisibleIndex ||
    prevProps.isPause !== nextProps.isPause ||
    prevProps.isFocused !== nextProps.isFocused ||
    prevProps.isFocusedPage !== nextProps.isFocusedPage ||
    prevProps.index !== nextProps.index
  ) {
    return false;
  }

  // Check media length
  if (prevProps.media.length !== nextProps.media.length) {
    return false;
  }

  // Only do deep comparison if lengths match
  // Compare first few items (most important) and sample a few others
  const checkIndices = [0, 1, Math.floor(prevProps.media.length / 2), prevProps.media.length - 1];
  
  for (const i of checkIndices) {
    if (i < prevProps.media.length) {
      const prevItem = prevProps.media[i];
      const nextItem = nextProps.media[i];
      
      if (!nextItem || prevItem._id !== nextItem._id) {
        return false;
      }
    }
  }

  return true;
});