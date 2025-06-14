import {useEffect, useRef} from 'react';
import Sound from 'react-native-sound';
import {ItemHomeProps} from '../types';

export const useItemHomeAudio = (props: ItemHomeProps, muted: boolean) => {
  const {currentVisible, musicInfo, isFocused, music} = props;
  const soundRef = useRef<Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPlayback = () => {
    soundRef.current?.stop();
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
  };

  useEffect(() => {
    if (!currentVisible || !musicInfo?.link || !isFocused) {
      stopPlayback();
      return;
    }

    const sound = new Sound(musicInfo.link, undefined, error => {
      if (error) return;

      sound.setVolume(muted ? 0 : 1);
      sound.setCurrentTime(music?.timeStart || 0);
      sound.play();

      const start = music?.timeStart ?? 0;
      const end = music?.timeEnd ?? 0;

      if (end > start) {
        intervalRef.current = setInterval(() => {
          sound.getCurrentTime(seconds => {
            if (seconds >= end) {
              sound.stop(() => {
                sound.setCurrentTime(start);
                sound.play();
              });
            }
          });
        }, 200);
      }
    });

    soundRef.current = sound;

    return () => {
      stopPlayback();
      sound.release();
    };
  }, [
    currentVisible,
    musicInfo?.link,
    isFocused,
    music?.timeStart,
    music?.timeEnd,
    muted,
  ]);

  useEffect(() => {
    if (soundRef.current?.isLoaded()) {
      soundRef.current.setVolume(muted ? 0 : 1);
    }
  }, [muted]);

  useEffect(() => {
    if (!isFocused) stopPlayback();
  }, [isFocused]);

  return {stopPlayback};
};
