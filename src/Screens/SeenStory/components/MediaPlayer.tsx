import React from 'react';
import {Image, Text, View} from 'react-native';
import Video from 'react-native-video';
import {styles} from './styles';

export const MediaPlayer = ({item, onLoad, onEnd, videoRef}: any) => {
  if (!item)
    return <Text style={styles.errorText}>Không có media để hiển thị</Text>;

  if (item.uriVideo) {
    return (
      <Video
        ref={videoRef}
        source={{uri: item.uriVideo}}
        style={styles.media}
        resizeMode="cover"
        repeat={false}
        onLoad={onLoad}
        onEnd={onEnd}
        playInBackground={false}
        playWhenInactive={false}
      />
    );
  }

  if (item.image || item.mediaUrl) {
    // Sử dụng mediaUrl làm fallback nếu image không có
    const displayUrl = item.image || item.mediaUrl;
    return (
      <Image
        source={{uri: displayUrl}}
        style={styles.media}
        resizeMode="cover"
        onError={e => console.log('Image load error:', e.nativeEvent.error)}
      />
    );
  }

  return <Text style={styles.errorText}>Không có media để hiển thị</Text>;
};
