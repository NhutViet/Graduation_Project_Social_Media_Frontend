import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import { Media } from '@services/postRedux/postTypes';

export interface ExploreMedia {
  _id: string;
  media: Media[];
}

interface ExploreSectionProps {
  media: ExploreMedia[];
  index: number;
}

const screenWidth = Dimensions.get('window').width;
const GAP = 2;
const SMALL = (screenWidth - GAP * 3) / 3;
const BIG = SMALL * 2 + GAP;

const ExploreSection: React.FC<ExploreSectionProps> = ({
  media,
  index,
}) => {
  if (!media || !Array.isArray(media) || media.length === 0) {
    return null;
  }

  const allMedia: Media[] = media.map(exploreMedia => {
    return exploreMedia?.media?.[0];
  }).filter(Boolean);

  if (allMedia.length === 0) {
    return null;
  }

  const isReversed = index % 2 === 0;
  const bigMedia = allMedia.find(m => m?.videoUrl) || allMedia[0];
  const smallMedias = allMedia.filter(m => m?._id !== bigMedia?._id).slice(0, 4);

  const handleMediaPress = (exploreMediaId: string, isBigMedia: boolean = false) => {
    console.log(`${isBigMedia ? 'Big' : 'Small'} explore media: ${exploreMediaId}`);
  };

  const renderMediaItem = (item: Media, isBigMedia: boolean = false) => {
    if (!item) {return null;}

    const isVideo = !!item.videoUrl;
    const parentExploreMedia = media.find(em =>
      em?.media?.some(m => m?._id === item._id)
    );
    const showOverlay = !isVideo && (parentExploreMedia?.media?.length || 0) > 1;

    return (
      <View style={isBigMedia ? styles.bigMediaContainer : styles.smallMediaContainer}>
        {isVideo ? (
          <>
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: item.videoUrl }}
                style={styles.media}
                resizeMode="cover"
                repeat={false}
                muted={true}
                paused={true}
                playInBackground={false}
                playWhenInactive={false}
                ignoreSilentSwitch={'ignore'}
              />
            </View>
            <View style={styles.overlayContainer}>
              <Image
                source={require('@assets/icon/reels.png')}
                resizeMode="contain"
                style={styles.overlayIcon}
              />
            </View>
          </>
        ) : item.imageUrl ? (
          <>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.media}
              resizeMode="cover"
            />
            {showOverlay && (
              <View style={styles.overlayContainer}>
                <Image
                  source={require('@assets/icon/layers.png')}
                  resizeMode="contain"
                  style={styles.overlayIcon}
                />
              </View>
            )}
          </>
        ) : null}
      </View>
    );
  };

  const bigMediaParent = media.find(em =>
    em?.media?.some(m => m?._id === bigMedia?._id)
  );

  return (
    <View style={[styles.row, isReversed && styles.rowReverse, { marginBottom: GAP }]}>
      <View style={isReversed ? styles.marginLeft : styles.marginRight}>
        <TouchableOpacity
          onPress={() => handleMediaPress(bigMediaParent?._id || '', true)}
          activeOpacity={0.8}
        >
          {renderMediaItem(bigMedia, true)}
        </TouchableOpacity>
      </View>

      <View style={styles.smallMediaGrid}>
        {smallMedias.map((item, idx) => {
          const smallMediaParent = media.find(em =>
            em?.media?.some(m => m?._id === item?._id)
          );

          return (
            <TouchableOpacity
              key={item?._id || `small-media-${idx}`}
              onPress={() => smallMediaParent && handleMediaPress(smallMediaParent._id)}
              activeOpacity={0.8}
              style={[
                styles.smallMediaWrapper,
                {
                  marginRight: idx % 2 === 1 ? 0 : GAP,
                  marginBottom: GAP,
                },
              ]}
            >
              {renderMediaItem(item)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: GAP / 2,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  marginRight: {
    marginRight: GAP,
  },
  marginLeft: {
    marginLeft: GAP,
  },
  bigMediaContainer: {
    width: SMALL,
    height: BIG,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  smallMediaContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  smallMediaGrid: {
    width: BIG,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  smallMediaWrapper: {
    width: SMALL,
    height: SMALL,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayIcon: {
    width: 18,
    height: 18,
    tintColor: 'white',
  },
});

export default React.memo(ExploreSection);
