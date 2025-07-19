import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {TaggedMedia} from '../../TagSo';
import TagMarker from './TagMarker';
import Video from 'react-native-video';

const {width: screenWidth} = Dimensions.get('window');
const IMAGE_HEIGHT = 520;

const RenderImg = ({
  media,
  setPosition,
  onImageChange,
}: {
  media: TaggedMedia[];
  setPosition: (
    mediaIndex: number,
    tagIndex: number,
    position: {x: number; y: number},
  ) => void;
  onImageChange: (index: number) => void;
}) => {
  const {theme} = useTheme();
  const colors = Colors[theme];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoSize, setVideoSize] = useState({width: 0, height: 0});
  const [isDragging, setIsDragging] = useState(false);

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  const onViewRef = useRef(({viewableItems}: {viewableItems: ViewToken[]}) => {
    if (viewableItems.length > 0) {
      const idx = viewableItems[0].index ?? 0;
      setCurrentIndex(idx);
      onImageChange(idx);
    }
  });

  // Reset video size when switching to new media (to recalculate resize mode)
  useEffect(() => {
    setVideoSize({width: 0, height: 0});
  }, [currentIndex]);

  // Auto resize video based on aspect ratio
  const videoResizeMode = useMemo(() => {
    if (videoSize.height > videoSize.width) return 'cover';
    return 'contain';
  }, [videoSize]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={media}
        horizontal
        pagingEnabled
        scrollEnabled={!isDragging}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.node.id.toString()}
        renderItem={({item, index}) => {
          const isVideo = item.node.type.startsWith('video');
          return (
            <View
              style={{
                width: screenWidth,
                height: isVideo ? 600 : IMAGE_HEIGHT,
                backgroundColor: colors.lightGray,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {isVideo ? (
                <Video
                  source={{uri: item.node.image.uri}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode={videoResizeMode}
                  repeat={false}
                  muted
                  paused={currentIndex !== index}
                  onLoad={meta => {
                    const {width, height} = meta.naturalSize;
                    setVideoSize({width, height});
                  }}
                />
              ) : (
                <Image
                  source={{uri: item.node.image.uri}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover"
                />
              )}
              {item.tags?.map((tag, idx) => (
                <TagMarker
                  key={`${item.node.image.uri}_${tag.user._id}`} // key theo user id, tránh bị reuse sai
                  tag={tag}
                  tagIndex={idx}
                  mediaIndex={index}
                  screenWidth={screenWidth}
                  imageHeight={isVideo ? 600 : IMAGE_HEIGHT}
                  media={media}
                  onUpdatePosition={(mediaIdx, tagIdx, pos) => {
                    setPosition(mediaIdx, tagIdx, pos);
                  }}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                />
              ))}
            </View>
          );
        }}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig}
      />

      {media.length > 1 && (
        <View style={styles.dotContainer}>
          {media.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, currentIndex === idx && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default RenderImg;

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#aaa',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#000',
    width: 10,
    height: 10,
  },
});
