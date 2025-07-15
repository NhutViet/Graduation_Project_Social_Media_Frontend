import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {View, Image, Text} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import Sound from 'react-native-sound';
import {styles} from './style';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {Story} from '@services/StoryRedux/StoryType';
import LoadingModal from '../../../../components/Global/LoadingModal';

interface MediaSectionProps {
  selectedItem: Story;
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
  isNavigatedAway?: boolean;
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
      isNavigatedAway,
    }: MediaSectionProps,
    ref,
  ) => {
    const soundRef = useRef<Sound | null>(null);
    const [isSoundInitialized, setIsSoundInitialized] = useState(false);

    // Hàm kiểm tra URL hợp lệ
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    // ✅ Khởi tạo sound chỉ một lần khi selectedItem thay đổi
    useEffect(() => {
      const musicLink = selectedItem?.music?.link;
      const startTime = selectedItem?.music?.time_start || 0;

      if (!musicLink) {
        setIsSoundInitialized(false);
        return;
      }

      if (!isValidUrl(musicLink)) {
        GlobalAlertManager.show('Lỗi phát nhạc', 'URL nhạc không hợp lệ.');
        setIsSoundInitialized(false);
        return;
      }

      // ✅ Chỉ tạo sound mới nếu chưa có hoặc selectedItem thay đổi
      if (!soundRef.current || !isSoundInitialized) {
        // Dừng và giải phóng nhạc cũ nếu có
        if (soundRef.current) {
          soundRef.current.stop(() => soundRef.current?.release());
          soundRef.current = null;
        }

        const sound = new Sound(musicLink, undefined, error => {
          if (error) {
            GlobalAlertManager.show('Lỗi phát nhạc', 'Không thể tải nhạc');
            setIsSoundInitialized(false);
            return;
          }

          const duration = sound.getDuration();
          onMusicLoad?.({duration});

          sound.setCurrentTime(startTime);

          // ✅ Chỉ play nếu không bị pause và không navigate away
          if (!paused && !isNavigatedAway) {
            sound.play(success => {
              if (success) {
                onMusicEnd?.();
              } else {
                console.warn('⚠️ Music playback failed');
              }
            });
          }

          soundRef.current = sound;
          setIsSoundInitialized(true);
        });
      }

      return () => {
        // Cleanup chỉ khi component unmount hoặc selectedItem thay đổi
        if (soundRef.current) {
          soundRef.current.stop(() => soundRef.current?.release());
          soundRef.current = null;
          setIsSoundInitialized(false);
        }
      };
    }, [selectedItem]); // ✅ Chỉ depend on selectedItem

    // ✅ Xử lý pause/resume sound đồng bộ với video
    useEffect(() => {
      if (soundRef.current && isSoundInitialized) {
        if (paused || isNavigatedAway) {
          soundRef.current.pause();
        } else {
          soundRef.current.play();
        }
      }
    }, [paused, isNavigatedAway, isSoundInitialized]);

    // ✅ Xử lý mute/unmute
    useEffect(() => {
      if (soundRef.current) {
        soundRef.current.setVolume(muted ? 0 : 1);
      }
    }, [muted]);

    return (
      <View style={styles.ViewMedia}>
        {selectedItem?.mediaUrl ? (
          selectedItem.mediaUrl.endsWith('.mp4') ? (
            <>
              <Video
                ref={ref}
                source={{uri: selectedItem.mediaUrl}}
                style={styles.media}
                resizeMode="contain"
                repeat={false}
                poster={selectedItem.mediaUrl}
                onLoad={onLoad}
                onEnd={onEnd}
                playInBackground={false}
                playWhenInactive={false}
                paused={paused || isNavigatedAway}
                muted={muted}
                onLayout={event => {
                  const {width, height} = event.nativeEvent.layout;
                  onMediaLayout?.({width, height});
                }}
              />
              {!isVideoLoaded && selectedItem?.mediaUrl?.endsWith('.mp4') && (
                <LoadingModal />
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
            <LoadingModal />
          </View>
        )}
      </View>
    );
  },
);
