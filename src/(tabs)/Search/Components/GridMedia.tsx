import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import Video from 'react-native-video';
import {useTheme} from '../../../util/ThemeContext';
import {SearchStyles} from '../../../StyleSheet/SearchStyles';
import { MediaItem } from '@services/postRedux/postTypes';

interface GridMediaProps {
  images: any[];
  index: number;
  currentVisibleIndex: number;
  isFocused: boolean;
  isFocusedPage: boolean;
  isPause: boolean;
  func?: () => void; // optional, nếu có thể là callback
}

const GridMedia = (props: GridMediaProps) => {
  const {images, index, currentVisibleIndex, isFocused, func, isFocusedPage, isPause} = props;

  const theme = useTheme();
  const styles = SearchStyles(theme.theme);

  const bigImage = images[index * 5];
  const smallImage1 = images[index * 5 + 1];
  const smallImage2 = images[index * 5 + 2];
  const smallImage3 = images[index * 5 + 3];
  const smallImage4 = images[index * 5 + 4];
  const [isPlaying, setIsPlaying] = useState<boolean>(currentVisibleIndex === index);

  if (!bigImage) return null;

  const isReversed = index % 2 === 0;

  return (
    <View
      style={{
        flexDirection: isReversed ? 'row' : 'row-reverse',
        gap: 2,
        marginBottom: 2,
      }}>
      {bigImage && (
        <TouchableOpacity style={{flex: 1}} onPress={() => setIsPlaying(!isPlaying)}>
          <Video
            source={{
              uri: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
            }}
            style={styles.bigImage}
            resizeMode="cover"
            repeat={false}
            muted={true}
            paused={!isPlaying || isFocused || !isFocusedPage || isPause}
          />
        </TouchableOpacity>
      )}
      <View style={styles.smallImages}>
        {smallImage1 && (
          <TouchableOpacity>
            <Image source={{uri: smallImage1.uri}} style={styles.smallImage} />
            <Image
              source={require('../../../../assets/icon/gallery.png')}
              style={styles.iconDif}
            />
          </TouchableOpacity>
        )}
        {smallImage2 && (
          <TouchableOpacity>
            <Image source={{uri: smallImage2.uri}} style={styles.smallImage} />
            <Image
              source={require('../../../../assets/icon/gallery.png')}
              style={styles.iconDif}
            />
          </TouchableOpacity>
        )}
        {smallImage3 && (
          <TouchableOpacity>
            <Image source={{uri: smallImage3.uri}} style={styles.smallImage} />
            <Image
              source={require('../../../../assets/icon/gallery.png')}
              style={styles.iconDif}
            />
          </TouchableOpacity>
        )}
        {smallImage4 && (
          <TouchableOpacity>
            <Image source={{uri: smallImage4.uri}} style={styles.smallImage} />
            <Image
              source={require('../../../../assets/icon/gallery.png')}
              style={styles.iconDif}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default GridMedia;

const styles = StyleSheet.create({});
