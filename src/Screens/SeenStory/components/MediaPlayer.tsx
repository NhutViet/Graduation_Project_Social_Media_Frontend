import React, {forwardRef} from 'react';
import {Image, Text, View} from 'react-native';
import Video from 'react-native-video';
import {styles} from './styles';

interface MediaPlayerProps {
  item: any;
  onLoad?: (data: any) => void;
  onEnd?: () => void;
  videoRef: any;
  onMediaLayout?: (size: {width: number; height: number}) => void;
}

export const MediaPlayer = forwardRef(
  (
    {item, onLoad, onEnd, videoRef, onMediaLayout}: MediaPlayerProps,
    ref: any,
  ) => {
    if (!item) {
      return <Text style={styles.errorText}>Không có media để hiển thị</Text>;
    }

    if (item.uriVideo) {
      return (
        <View
          style={styles.media}
          onLayout={event => {
            const {width, height} = event.nativeEvent.layout;
            onMediaLayout?.({width, height});
          }}>
          <Video
            ref={videoRef}
            source={{uri: item.uriVideo}}
            style={styles.media}
            resizeMode="contain" // Thay đổi từ "cover" sang "contain" để nhất quán với EditStory
            repeat={false}
            onLoad={onLoad}
            onEnd={onEnd}
            playInBackground={false}
            playWhenInactive={false}
          />
        </View>
      );
    }

    if (item.image || item.mediaUrl) {
      const displayUrl = item.image || item.mediaUrl;
      return (
        <View
          style={styles.media}
          onLayout={event => {
            const {width, height} = event.nativeEvent.layout;
            onMediaLayout?.({width, height});
          }}>
          <Image
            source={{uri: displayUrl}}
            style={styles.media}
            resizeMode="contain" // Thay đổi từ "cover" sang "contain"
            onError={e => console.log('Image load error:', e.nativeEvent.error)}
          />
        </View>
      );
    }

    return <Text style={styles.errorText}>Không có media để hiển thị</Text>;
  },
);
