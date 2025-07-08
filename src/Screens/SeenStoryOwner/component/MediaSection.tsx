import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {View, Image, Text, Alert, ActivityIndicator} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import Sound from 'react-native-sound';
import {styles} from './style';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

interface MediaSectionProps {
  selectedItem: any;
  onLoad?: (data: {duration: number}) => void;
  onEnd?: () => void;
  onMediaLayout?: (size: {width: number; height: number}) => void;
  onMusicLoad?: (data: {duration: number}) => void;
  onMusicEnd?: () => void;
  paused?: boolean;
  muted?: boolean;
  isVideoLoaded?: boolean;
  isMediaLoading?: boolean;
  onImageLoad?: () => void;
}

export const MediaSection = forwardRef<VideoRef, MediaSectionProps>(
  (
    {
      selectedItem,
      onLoad,
      onEnd,
      onMediaLayout,
      onMusicLoad,
      onMusicEnd,
      paused,
      muted,
      isVideoLoaded,
      isMediaLoading,
      onImageLoad,
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
        GlobalAlertManager.show('Lỗi phát nhạc', 'URL nhạc không hợp lệ.');
        return;
      }

      // Dừng và giải phóng nhạc cũ
      if (soundRef.current) {
        soundRef.current.stop(() => soundRef.current?.release());
      }

      const sound = new Sound(musicLink, undefined, error => {
        if (error) {
          GlobalAlertManager.show('Lỗi phát nhạc', 'Không thể tải nhạc');
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
        if (paused) {
          sound.pause();
        }
      });

      return () => {
        // Cleanup dứt khoát
        if (soundRef.current) {
          soundRef.current.stop(() => soundRef.current?.release());
          soundRef.current = null;
        }
      };
    }, [selectedItem]); // ✅ Không chỉ là selectedItem.music.link
    useEffect(() => {
      if (soundRef.current) {
        if (paused) {
          soundRef.current.pause();
        } else {
          soundRef.current.play();
        }
      }
    }, [paused]);

    useEffect(() => {
      if (soundRef.current) {
        soundRef.current.setVolume(muted ? 0 : 1);
      }
    }, [muted]);

    return (
      <View style={styles.ViewMedia}>
        {selectedItem?.mediaUrl ? (
          selectedItem.mediaUrl.endsWith('.m3u8') ? (
            <>
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
                muted={muted}
                onLayout={event => {
                  const {width, height} = event.nativeEvent.layout;
                  onMediaLayout?.({width, height});
                }}
              />
              {!isVideoLoaded && selectedItem?.mediaUrl?.endsWith('.m3u8') && (
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginLeft: -15,
                    marginTop: -15,
                    zIndex: 20,
                  }}
                />
              )}
            </>
          ) : (
            <Image
              source={{uri: selectedItem.mediaUrl}}
              style={styles.media}
              resizeMode="contain"
              onLayout={event => {
                const {width, height} = event.nativeEvent.layout;
                onMediaLayout?.({width, height});
              }}
              onLoad={onImageLoad}
            />
          )
        ) : (
          <Text style={styles.errorText}>Không có media để hiển thị</Text>
        )}

        {isMediaLoading && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)', // có thể thêm nền mờ nếu muốn
              zIndex: 10,
            }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    );
  },
);
