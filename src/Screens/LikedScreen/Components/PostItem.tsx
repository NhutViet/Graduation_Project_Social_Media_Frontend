import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, { useState } from 'react';
import Video from 'react-native-video';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';
import { Media, MediaR, Item } from '@services/postUserRedux/postUserType';
import {
  Clapperboard,
  GalleryHorizontal,
  CheckCircle2,
} from 'lucide-react-native';

const {width} = Dimensions.get('window');

interface Props {
  data: Item;
  onHandle: () => void;
  isSelect: boolean;
  showSelect?: boolean;
}


const PostItem = ({ data, onHandle, isSelect, showSelect }: Props) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const media = data.media ?? [];

  const images = media
    .filter((m): m is MediaR => typeof (m as any).imageUrl === 'string')
    .map(m => m.imageUrl!);

  const videos = media
    .filter((m): m is Media => typeof (m as any).videoUrl === 'string')
    .map(m => m.videoUrl!);

  let content: React.ReactNode;
    if (images.length === 0 && videos.length > 0) {
      content = (
        <View>
          <Video
            source={{ uri: videos[0] }}
            resizeMode="cover"
            style={styles.container}
            muted
            paused
            poster={videos[0]}
          />
          <Clapperboard
            size={22}
            color={color.background}
            style={styles.note}
          />
        </View>
      );
    } else if (images.length >= 1 || (images.length > 0 && videos.length > 0)) {
      content = (
        <View>
          <Image source={{ uri: images[0] }} style={styles.container} />
          <GalleryHorizontal
            size={22}
            color={color.background}
            style={styles.note}
          />
        </View>
      );
    } else {
      // không có media: placeholder
      content = (
        <View style={[styles.container, styles.placeholder]}>
          <Text style={{ color: color.textSecondary }}>—</Text>
        </View>
      );
    }



  return (
    <TouchableOpacity onPress={onHandle} style={{width: (width)/3, aspectRatio: 1,}}>
      {content}
      {showSelect && (
        isSelect 
          ? <CheckCircle2 size={22} color={color.primary} style={styles.tick} />
          : <View style={[styles.rounded, { borderColor: color.textSecondary }]} />
      )}
    </TouchableOpacity>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  container: {
    width: width / 3,
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  rounded: {
    width: 20,
    aspectRatio: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 2,
    borderRadius: 100,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  tick: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 1,
  },
  note: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  playButtonOverlay: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    top: (Dimensions.get('window').height * 50 / 100 - 20),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});
