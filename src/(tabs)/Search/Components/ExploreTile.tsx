import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
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
  if (!media || media.length === 0) return null;

  const { bigMedia, smallMedias, isReversed } = useMemo(() => {
    const reversed = index % 2 === 0;
    const big = media.find(m => !!m.videoUrl) || media[0];
    const small = media.filter(m => m._id !== big._id).slice(0, 4);
    return { bigMedia: big, smallMedias: small, isReversed: reversed };
  }, [media, index]);

  const handleBigMediaPress = useCallback(() => {
    console.log(`Big media: ${bigMedia?._id}`);
  }, [bigMedia?._id]);

  const handleSmallMediaPress = useCallback((mediaId: string) => {
    console.log(`Small media: ${mediaId}`);
  }, []);

  const renderBigMedia = useMemo(() => {
    if (!bigMedia) return null;
     return (
       <TouchableOpacity
         onPress={handleBigMediaPress}
         style={styles.bigMedia}>
        {bigMedia.videoUrl ? (
          <Video
            source={{uri: bigMedia.videoUrl}}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            repeat={false}
            muted={true}
            paused={true}
            useTextureView={true}
          />
        ) : bigMedia.imageUrl ? (
          <Image
            source={{uri: bigMedia.imageUrl}}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
        ) : null}
      </TouchableOpacity>
    );
  }, [bigMedia, handleBigMediaPress]);

  const renderSmallMedias = useMemo(() => {
    if (!smallMedias || smallMedias.length === 0) {
      return <View style={{width: BIG}} />;
    }
    return (
      <View
        style={{
          width: BIG,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {smallMedias.map((item, idx) => {
          const isRightCol = idx % 2 === 1;
          return (
            <TouchableOpacity
              key={item._id}
               onPress={() => handleSmallMediaPress(item._id)}
               style={[
                 styles.smallMedia,
                 {
                   marginRight: isRightCol ? 0 : GAP,
                   marginBottom: GAP,
                 },
               ]}
             >
              {item.videoUrl ? (
                <Video
                  source={{uri: item.videoUrl}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover"
                  repeat={false}
                  muted
                  paused
                  useTextureView={true}
                />
              ) : item.imageUrl ? (
                <Image
                  source={{uri: item.imageUrl}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover"
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [smallMedias, handleSmallMediaPress]);

  return (
    <View
       style={[
         styles.row,
         isReversed ? styles.rowReverse : {},
         { marginBottom: GAP, paddingHorizontal: 1 },
       ]}>
      <View
        style={isReversed ? styles.marginLeft : styles.marginRight}>
        {renderBigMedia}
      </View>

      {renderSmallMedias}
    </View>
  );
};

export default React.memo(ExploreSection, (prev, next) => {
  if (
    prev.currentVisibleIndex !== next.currentVisibleIndex ||
    prev.isPause !== next.isPause ||
    prev.isFocused !== next.isFocused ||
    prev.isFocusedPage !== next.isFocusedPage ||
    prev.index !== next.index
  ) {
    return false;
  }
  if (prev.media.length !== next.media.length) {
    return false;
  }
  const checkIndices = [0, 1, Math.floor(prev.media.length / 2), prev.media.length - 1];
  for (const i of checkIndices) {
    if (i < prev.media.length && prev.media[i]._id !== next.media[i]._id) {
      return false;
    }
  }
  return true;
});
const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rowReverse: { flexDirection: 'row-reverse' },
  marginRight: { marginRight: GAP },
  marginLeft: { marginLeft: GAP },
  bigMedia: {
    width: SMALL,
    height: BIG,
    borderRadius: 4,
    overflow: 'hidden',
  },
  smallContainer: {
    width: BIG,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  smallMedia: {
    width: SMALL,
    height: SMALL,
    borderRadius: 4,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
});