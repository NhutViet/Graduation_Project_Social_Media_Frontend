import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Video from 'react-native-video';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {
  Clapperboard,
  GalleryHorizontal,
  CheckCircle2,
  Play,
} from 'lucide-react-native';

const {width} = Dimensions.get('window');

type PostItemProps = {
  data: {
    image_url: string[];
    video: string[];
  };
  onHandle: () => void;
  isSelect: boolean;
};

const PostItem = (props: PostItemProps) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const {data, onHandle, isSelect} = props;
  const [isPause, setIsPause] = useState<boolean>(true);
  return (
    <TouchableOpacity
      onPress={onHandle}
      style={{width: width / 3, aspectRatio: 1}}>
      {data.image_url.length === 0 && data.video.length > 0 ? (
        <View>
          <TouchableOpacity onPress={() => setIsPause(!isPause)}>
            <Video
              source={{uri: data.video[0]}}
              resizeMode="cover"
              repeat={false}
              style={[styles.container]}
              muted={true}
              paused={isPause}
              poster={data.video[0]}
            />
            {isPause && (
              <Play size={14} style={styles.playButtonOverlay}/>
            )}
          </TouchableOpacity>
          <Clapperboard
            size={22}
            color={color.background}
            style={styles.note}
          />
        </View>
      ) : data.image_url.length > 1 ||
        (data.image_url.length > 0 && data.video.length > 0) ? (
        <View>
          <Image source={{uri: data.image_url[0]}} style={styles.container} />
          <GalleryHorizontal
            size={22}
            color={color.background}
            style={styles.note}
          />
        </View>
      ) : (
        <Image source={{uri: data.image_url[0]}} style={styles.container} />
      )}
      {isSelect ? (
        <CheckCircle2 size={22} color={color.text} style={styles.tick} />
      ) : (
        <View style={[styles.rounded, {borderColor: color.textSecondary}]} />
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
});
