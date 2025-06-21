import React, {forwardRef, useEffect, useRef} from 'react';
import {View, Image, Text, Alert} from 'react-native';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import {styles} from './style';

interface MediaSectionProps {
  selectedItem: any;
  onLoad?: (data: {duration: number}) => void;
  onEnd?: () => void;
  onMediaLayout?: (size: {width: number; height: number}) => void;
  onMusicLoad?: (data: {duration: number}) => void;
  onMusicEnd?: () => void;
  paused?: boolean;
}

export const MediaSection = forwardRef(
  (
    {
      selectedItem,
      onLoad,
      onEnd,
      onMediaLayout,
      onMusicLoad,
      onMusicEnd,
      paused,
    }: MediaSectionProps,
    ref,
  ) => {
    const soundRef = useRef<Sound | null>(null);

    // Hàm kiểm tra URL hợp lệ
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    useEffect(() => {
      const musicLink = selectedItem?.music?.link;
      const startTime = selectedItem?.music?.time_start || 0;

      if (!musicLink) {
        return;
      }

      if (!isValidUrl(musicLink)) {
        Alert.alert('Lỗi phát nhạc', 'URL nhạc không hợp lệ.');
        return;
      }

      // Dừng và giải phóng nhạc cũ
      if (soundRef.current) {
        soundRef.current.stop(() => soundRef.current?.release());
      }

      const sound = new Sound(musicLink, null, error => {
        if (error) {
          console.warn('❌ Music error:', error);
          Alert.alert('Lỗi phát nhạc', 'Không thể tải nhạc.');
          return;
        }

        const duration = sound.getDuration();

        onMusicLoad?.({duration});

        sound.setCurrentTime(startTime);
        sound.play(success => {
          if (success) {
            onMusicEnd?.();
          } else {
            console.warn('⚠️ Music playback failed');
          }
        });

        soundRef.current = sound;
      });

      return () => {
        // Cleanup dứt khoát
        if (soundRef.current) {
          soundRef.current.stop(() => soundRef.current?.release());
          soundRef.current = null;
        }
      };
    }, [selectedItem]); // ✅ Không chỉ là selectedItem.music.link

    return (
      <View style={styles.ViewMedia}>
        {selectedItem?.mediaUrl ? (
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
              paused={paused}
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
    );
  },
);
