/* eslint-disable react-native/no-inline-styles */
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import {Media} from '../../../../services/postRedux/postTypes';

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
  if (media.length === 0) {
    return null;
  }

  const isReversed = index % 2 === 0;

  // chọn 1 media có videoUrl để làm video lớn, nếu không có thì lấy media[0]
  const bigMedia = media.find(m => !!m.videoUrl) || media[0];

  const smallMedias = media.filter(m => m._id !== bigMedia._id);
  const isPlaying = currentVisibleIndex === index;

  return (
    <View
      style={{
        flexDirection: isReversed ? 'row' : 'row-reverse',
        marginBottom: GAP,
        gap: GAP,
        paddingHorizontal: 1,
      }}>
      {/* Media lớn (video hoặc image) */}
      <TouchableOpacity
        onPress={() => console.log(`${bigMedia._id}`)}
        style={{
          width: SMALL,
          height: BIG,
          backgroundColor: '#ccc',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
        {bigMedia.videoUrl ? (
          <Video
            source={{uri: bigMedia.videoUrl}}
            style={{flex: 1}}
            resizeMode="cover"
            repeat
            muted
            paused={!isPlaying || isPause || isFocused || !isFocusedPage}
          />
        ) : (
          <Image
            source={{uri: bigMedia.imageUrl}}
            style={{flex: 1}}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>

      {/* 4 ô ảnh nhỏ */}
      <View
        style={{
          width: SMALL * 2 + GAP,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: GAP,
        }}>
        {smallMedias.map(item => (
          <TouchableOpacity
            onPress={() => console.log(`${item._id}`)}
            key={item._id}
            style={{
              width: SMALL,
              height: SMALL,
              backgroundColor: '#eee',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
            {item.videoUrl ? (
              <Video
                source={{uri: item.videoUrl}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
                repeat
                muted
                paused={!isPlaying || isPause || isFocused || !isFocusedPage}
              />
            ) : (
              <Image
                source={{uri: item.imageUrl}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default React.memo(ExploreSection);
