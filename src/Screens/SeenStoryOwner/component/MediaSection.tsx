import React from 'react';
import {View, Image, Text} from 'react-native';
import Video from 'react-native-video';
import {styles} from './style';

interface MediaSectionProps {
  selectedItem: any;
}

export const MediaSection = ({selectedItem}: MediaSectionProps) => (
  <View style={styles.ViewMedia}>
    {selectedItem && selectedItem.mediaUrl ? (
      selectedItem.mediaUrl.endsWith('.m3u8') ? (
        <Video
          source={{uri: selectedItem.mediaUrl}}
          style={styles.media}
          resizeMode="cover"
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
        />
      ) : (
        <Image
          source={{uri: selectedItem.mediaUrl}}
          style={styles.media}
          resizeMode="cover"
        />
      )
    ) : (
      <Text style={styles.errorText}>Không có media để hiển thị</Text>
    )}
  </View>
);
