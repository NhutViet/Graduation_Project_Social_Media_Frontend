import React, {forwardRef, useEffect, useRef} from 'react';
import {Image, Text, View} from 'react-native';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import {styles} from './styles';

interface MediaPlayerProps {
  item: {
    uriVideo?: string;
    image?: string;
    mediaUrl?: string;
    music?: {link: string; time_start?: number};
  };
  onLoad?: (data: {duration: number}) => void;
  onEnd?: () => void;
  onMusicLoad?: (seconds: number) => void;
  onMusicEnd?: () => void;
  onMediaLayout?: (size: {width: number; height: number}) => void;
}

export const MediaPlayer = forwardRef<any, MediaPlayerProps>(
  ({item, onLoad, onEnd, onMusicLoad, onMusicEnd, onMediaLayout}, ref) => {
    /* ---------- AUDIO ----------- */
    const soundRef = useRef<Sound | null>(null);

    useEffect(() => {
      let isMounted = true;

      // ✅ Nếu có video, KHÔNG load và phát nhạc
      if (item?.uriVideo) {
        console.log('🚫 Skipping music. Video is present:', item.uriVideo);
        return;
      }

      const {music} = item || {};
      if (!music?.link) return;
      console.log('🎵 Playing music:', music.link);
      soundRef.current?.stop(() => soundRef.current?.release());
      soundRef.current = null;

      const sound = new Sound(music.link, undefined, error => {
        if (error) {
          console.warn('❌ Can’t load sound:', error);
          return;
        }

        const total = sound.getDuration();
        onMusicLoad?.(total);
        if (music.time_start) sound.setCurrentTime(music.time_start);

        sound.play(success => {
          if (isMounted) {
            if (success) onMusicEnd?.();
            else console.warn('⚠️  Sound playback failed');
          }
        });

        soundRef.current = sound;
      });

      return () => {
        isMounted = false;
        soundRef.current?.stop(() => soundRef.current?.release());
        soundRef.current = null;
      };
    }, [
      item?.uriVideo,
      item?.image,
      item?.mediaUrl,
      item?.music?.link,
      item?.music?.time_start,
    ]);

    if (!item) {
      return <Text style={styles.errorText}>Không có media để hiển thị</Text>;
    }

    const displayImage = item.image || item.mediaUrl;

    useEffect(() => {
      if (displayImage) {
        Image.getSize(
          displayImage,
          () => {},
          err => {
            console.warn('🖼️ Image size error:', err);
          },
        );
      }
    }, [displayImage]);

    return (
      <View
        style={styles.media}
        onLayout={e => {
          const {width, height} = e.nativeEvent.layout;
          onMediaLayout?.({width, height});
        }}>
        {item.uriVideo ? (
          <Video
            ref={ref}
            source={{uri: item.uriVideo}}
            style={styles.media}
            resizeMode="contain"
            repeat={false}
            playInBackground={false}
            playWhenInactive={false}
            onLoad={onLoad}
            onEnd={onEnd}
          />
        ) : displayImage ? (
          <Image
            source={{uri: displayImage}}
            style={styles.media}
            resizeMode="contain"
            onError={e =>
              console.log('🖼️  Image load error:', e.nativeEvent.error)
            }
          />
        ) : (
          <Text style={styles.errorText}>Không có media để hiển thị</Text>
        )}
      </View>
    );
  },
);
