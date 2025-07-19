import React, {forwardRef, useEffect, useRef} from 'react';
import {Image, Text, View} from 'react-native';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import {styles} from './styles';
import LoadingModal from '../../../../components/Global/LoadingModal';

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
  paused?: boolean;
  muted?: boolean;
  isMediaLoading?: boolean;
  onImageLoad?: () => void;
  forceReset?: boolean;
}

export const MediaPlayer = forwardRef<any, MediaPlayerProps>(
  (
    {
      item,
      onLoad,
      onEnd,
      onMusicLoad,
      onMusicEnd,
      onMediaLayout,
      paused,
      muted,
      isMediaLoading,
      onImageLoad,
      forceReset = false,
    },
    ref,
  ) => {
    /* ---------- AUDIO ----------- */
    const soundRef = useRef<Sound | null>(null);

    // ✅ Reset sound khi item thay đổi (kể cả khi music.link giống nhau)
    useEffect(() => {
      if (item?.uriVideo || !item?.music?.link) return;

      let isMounted = true;

      // ✅ Luôn stop và release sound cũ trước khi tạo mới
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current?.release();
          soundRef.current = null;
        });
      }

      const sound = new Sound(item.music.link, undefined, error => {
        if (error) {
          console.warn('❌ Load sound failed:', error);
          return;
        }

        // ✅ Kiểm tra component vẫn mounted
        if (!isMounted) {
          sound.release();
          return;
        }

        const total = sound.getDuration();
        onMusicLoad?.(total);

        // ✅ Reset time_start cho mỗi story mới
        if (item.music?.time_start) {
          sound.setCurrentTime(item.music.time_start);
        }

        soundRef.current = sound;

        // Auto play nếu không pause
        if (!paused) {
          sound.setVolume(muted ? 0 : 1);
          sound.play(success => {
            if (success && isMounted) onMusicEnd?.();
          });
        }
      });

      return () => {
        isMounted = false;
        if (soundRef.current) {
          soundRef.current.stop(() => {
            soundRef.current?.release();
            soundRef.current = null;
          });
        }
      };
    }, [item?.music?.link, item?.music?.time_start, forceReset]); // ✅ Thêm forceReset vào dependencies

    // pause
    useEffect(() => {
      if (soundRef.current) {
        if (paused) {
          soundRef.current.pause();
        } else {
          soundRef.current.play(success => {
            if (success) onMusicEnd?.();
          });
        }
      }
    }, [paused]);

    // mute
    useEffect(() => {
      if (soundRef.current) {
        soundRef.current.setVolume(muted ? 0 : 1);
      }
    }, [muted]);

    if (!item) {
      return <Text style={styles.errorText}>Không có media để hiển thị</Text>;
    }

    const displayImage = item.image || item.mediaUrl;

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
            paused={paused}
            muted={muted}
          />
        ) : displayImage ? (
          <Image
            source={{uri: displayImage}}
            style={styles.media}
            resizeMode="contain"
            onError={e =>
              console.log('🖼️  Image load error:', e.nativeEvent.error)
            }
            onLoad={onImageLoad}
          />
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
              backgroundColor: 'rgba(0,0,0,0.2)',
              zIndex: 2,
            }}>
            <LoadingModal />
          </View>
        )}
      </View>
    );
  },
);
