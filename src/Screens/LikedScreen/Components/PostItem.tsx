import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';
import { Clapperboard, Images, CircleCheck } from 'lucide-react-native';
import { Media, Item } from '@services/postUserRedux/postUserType';

const {width} = Dimensions.get('window');

interface Props {
  data: Item;
  onHandle: () => void;
  isSelect: boolean;
}

const PostItem = ({ data, onHandle, isSelect }: Props) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const media = data.media ?? [];

  const images = media
    .filter((m): m is Media => typeof (m as any).imageUrl === 'string')
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
          />
          <Clapperboard
            style={styles.icon}
            color={color.background}
            size={20}
          />
        </View>
      );
    } else if (images.length >= 1 || (images.length > 0 && videos.length > 0)) {
      content = (
        <View>
          <Image source={{ uri: images[0] }} style={styles.container} />
          <Images style={styles.icon} color={color.background} size={20} />
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
    <TouchableOpacity onPress={onHandle} style={{width: (width)/3,
        aspectRatio: 1,}}>
        {content}
        {isSelect ? (
          <CircleCheck
            style={styles.check}
            color={color.background}
            fill={color.primary}
            size={20}
          />
        ) : (
          <View style={[styles.rounded, { borderColor: color.textSecondary }]} />
        )}
    </TouchableOpacity>
  );
};

export default PostItem;

const styles = StyleSheet.create({
    container: {
        width: (width)/3,
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    wrapper: {
      width: width / 3,
      aspectRatio: 1,
    },
    placeholder: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    icon: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    rounded: {
        width: 20,
        aspectRatio: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderWidth: 2,
        borderRadius: 100,
        position: 'absolute',
        bottom: 5,
        right: 5,
    },
    tick: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 5,
        right: 5,
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
    check: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      zIndex: 1,
    },
});
