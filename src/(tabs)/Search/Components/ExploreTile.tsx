import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Media } from '@services/postRedux/postTypes';
import { useNavigation } from '@react-navigation/native';

export interface ExploreMedia {
  _id: string;
  media: Media[];
}

interface ExploreSectionProps {
  data: ExploreMedia[];
  media: ExploreMedia[];
  index: number;
}

const screenWidth = Dimensions.get('window').width;
const GAP = 2;
const SMALL = (screenWidth - GAP * 3) / 3;
const BIG = SMALL * 2 + GAP;

// 🔁 Chuyển video sang thumbnail ảnh
const convertToImage = (uri: string): string => {
  if (
    uri.includes('videodelivery.net') &&
    uri.includes('/manifest/') &&
    !uri.endsWith('.jpg')
  ) {
    const parts = uri.split('/');
    const videoId = parts[3];
    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=2s`;
  }
  return uri;
};

const ExploreSection: React.FC<ExploreSectionProps> = ({
  media,
  index,
  data,
}) => {
  const navigation = useNavigation<any>();
  if (!media || !Array.isArray(media) || media.length === 0) return null;

  const allMedia: Media[] = media.map(exploreMedia => exploreMedia?.media?.[0]).filter(Boolean);
  if (allMedia.length === 0) return null;

  const isReversed = index % 2 === 0;
  const bigMedia = allMedia.find(m => m?.videoUrl) || allMedia[0];
  const smallMedias = allMedia.filter(m => m?._id !== bigMedia?._id).slice(0, 4);

  const handleMediaPress = (exploreMediaId: string, isBigMedia: boolean = false) => {
    navigation.navigate('AllPostOfCollection', {posts: data, targetPostId: exploreMediaId, playlistName: 'Bài viết'})
  };

  const renderMediaItem = (item: Media, isBigMedia: boolean = false) => {
    if (!item) return null;

    const isVideo = !!item.videoUrl;
    const parentExploreMedia = media.find(em =>
      em?.media?.some(m => m?._id === item._id),
    );
    const showOverlay = !isVideo && (parentExploreMedia?.media?.length || 0) > 1;

    const displayImage = isVideo ? convertToImage(item.videoUrl) : item.imageUrl;

    return (
      <View style={isBigMedia ? styles.bigMediaContainer : styles.smallMediaContainer}>
        {displayImage && (
          <Image
            source={{ uri: displayImage }}
            style={styles.media}
            resizeMode="cover"
          />
        )}

        {isVideo ? (
          <View style={styles.overlayContainer}>
            <Image
              source={require('@assets/icon/reels.png')}
              resizeMode="contain"
              style={styles.overlayIcon}
            />
          </View>
        ) : showOverlay && (
          <View style={styles.overlayContainer}>
            <Image
              source={require('@assets/icon/layers.png')}
              resizeMode="contain"
              style={styles.overlayIcon}
            />
          </View>
        ) }
      </View>
    );
  };

  const bigMediaParent = media.find(em =>
    em?.media?.some(m => m?._id === bigMedia?._id),
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
            em?.media?.some(m => m?._id === item?._id),
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
