import React, {forwardRef} from 'react';
import {View, Image, Text} from 'react-native';
import Video from 'react-native-video';
import {styles} from './style';

// Định nghĩa kiểu props
interface MediaSectionProps {
  selectedItem: any;
  onLoad?: (data: {duration: number}) => void;
  onEnd?: () => void;
  onMediaLayout?: (size: {width: number; height: number}) => void;
}

// Sử dụng forwardRef để truyền ref
export const MediaSection = forwardRef(
  ({selectedItem, onLoad, onEnd, onMediaLayout}: MediaSectionProps, ref) => (
    <View style={styles.ViewMedia}>
      {selectedItem && selectedItem.mediaUrl ? (
        selectedItem.mediaUrl.endsWith('.m3u8') ? (
          <Video
            ref={ref}
            source={{uri: selectedItem.mediaUrl}}
            style={styles.media}
            resizeMode="contain"
            repeat={false}
            onLoad={onLoad}
            onEnd={onEnd}
            playInBackground={false}
            playWhenInactive={false}
            onLayout={event => {
              const {width, height} = event.nativeEvent.layout;
              onMediaLayout?.({width, height});
            }}
          />
        ) : (
          <Image
            source={{uri: selectedItem.mediaUrl}}
            style={styles.media}
            resizeMode="contain"
            onLayout={event => {
              const {width, height} = event.nativeEvent.layout;
              onMediaLayout?.({width, height});
            }}
          />
        )
      ) : (
        <Text style={styles.errorText}>Không có media để hiển thị</Text>
      )}
    </View>
  ),
);
