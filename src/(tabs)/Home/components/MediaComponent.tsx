import React, {useEffect, useMemo, useState} from 'react';
import {View, Image, TouchableOpacity, Dimensions} from 'react-native';
import Video from 'react-native-video';
import {Colors} from '../../../../assets/color/Colors';
import {ItemHomeStyles} from '../component_styles/ItemHomeStyles';
import {Media} from '../../../../services/postRedux/postTypes';
import { Volume2, VolumeOff } from 'lucide-react-native';
import TagMarker from './TagMarker';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface RenderMediaItemProps {
  item: Media;
  currentVisible: boolean;
  isFocused: boolean;
  muted: boolean;
}

interface RenderPaginationProps {
  media: Media[];
  currentIndex: number;
}

interface RenderMuteButtonProps {
  muted: boolean;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isPostWithoutMusic: boolean;
}

export const RenderMediaItem = React.memo(
  ({item, currentVisible, isFocused, muted}: RenderMediaItemProps) => {
    const [videoSize, setVideoSize] = useState({width: 0, height: 0});
    const navigation = useNavigation<any>();
    const videoResizeMode = useMemo(() => {
      if (videoSize.height > videoSize.width) return 'cover';
      return 'contain';
    }, [videoSize]);

    if (item.videoUrl) {
      return (
        <Video
          source={{uri: item.videoUrl}}
          resizeMode={videoResizeMode}
          style={{width: screenWidth, height: 600}}
          repeat
          paused={!currentVisible || !isFocused}
          muted={muted}
          maxBitRate={0}
          progressUpdateInterval={500}
          onLoad={({naturalSize}) => {
            setVideoSize({
              width: naturalSize.width,
              height: naturalSize.height,
            });
          }}
          useTextureView={false}
        />
      );
    }

    return (
      <View style={{width: screenWidth, height: item.videoUrl ? 600 : 460}}>
        {item.videoUrl ? (
          <Video
            source={{uri: item.videoUrl}}
            resizeMode={videoResizeMode}
            style={{width: screenWidth, height: 600}}
            repeat
            paused={!currentVisible || !isFocused}
            muted={muted}
            maxBitRate={0}
            progressUpdateInterval={500}
            onLoad={({naturalSize}) => {
              setVideoSize({
                width: naturalSize.width,
                height: naturalSize.height,
              });
            }}
          />
        ) : (
          <Image
            source={{uri: item.imageUrl ?? ''}}
            style={{width: screenWidth, height: 460}}
            resizeMode="cover"
          />
        )}

        {/* Hiển thị các tag (nếu có) */}
        {item.tags?.map((tag, index) => (
          <TagMarker
            key={`${tag.userId}_${index}`}
            tag={tag}
            screenWidth={screenWidth}
            imageHeight={item.videoUrl ? 600 : 460}
            onPress={userId => {
              navigation.navigate('ProfileComp', {userID: userId});
            }}
          />
        ))}
      </View>
    );
  },
);

export const RenderPagination = React.memo(
  ({media, currentIndex}: RenderPaginationProps) => {
    if (media.length <= 1) return null;
    return (
      <View style={ItemHomeStyles.pagination}>
        {media.map((_, index) => (
          <View
            key={index}
            style={[
              ItemHomeStyles.dot,
              {
                backgroundColor:
                  index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
              },
            ]}
          />
        ))}
      </View>
    );
  },
);

export const RenderMuteButton = React.memo(
  ({muted, setMuted, isPostWithoutMusic}: RenderMuteButtonProps) => {
    if (isPostWithoutMusic) return null;

    return (
      <TouchableOpacity
        style={ItemHomeStyles.muteButton}
        onPress={() => setMuted(!muted)}>
        {muted ? <VolumeOff color={Colors.dark.text}/> : <Volume2 color={Colors.dark.text}/>}
      </TouchableOpacity>
    );
  },
);
