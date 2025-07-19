import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import Video from 'react-native-video';
import {Pause, Play} from 'lucide-react-native';

type VideoModalProps = {
  uri: string;
  visible: boolean;
  onClose: () => void;
};

const VideoModal = (props: VideoModalProps) => {
  const {uri, visible, onClose} = props;
  const {theme} = useTheme();
  const color = Colors[theme];
  const {height} = Dimensions.get('window');
  const [isPause, setIsPause] = useState(true);

  const [isVisible, setIsVisible] = useState(false);

  //thay đổi thời gian
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

  //tua tiến
  const lessTime = () => {
    if (playerRef.current) {
      const newTime = Math.max(currentTime - 10, 0);
      playerRef.current.seek(newTime);
    }
  };

  const moreTime = () => {
    if (playerRef.current) {
      const newTime = currentTime + 10;
      playerRef.current.seek(newTime);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  }, [isVisible]);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor:
              theme === 'dark'
                ? 'rgba(255, 255, 255, 0.5)'
                : 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                width: '85%',
                height: height * 0.75,
                backgroundColor: color.black,
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: 15,
                borderColor: color.primary,
                borderWidth: 1,
              }}>
              {uri ? (
                <TouchableOpacity onPress={() => setIsPause(!isPause)}>
                  <Video
                    ref={playerRef}
                    source={{uri: uri}}
                    repeat={false}
                    poster={uri}
                    resizeMode="contain"
                    paused={isPause}
                    onProgress={({currentTime}) => setCurrentTime(currentTime)}
                    style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: 15,
                    }}
                  />
                  {isPause && (
                    <Play size={14} style={styles.playButtonOverlay} />
                  )}
                </TouchableOpacity>
              ) : (
                <Text style={{color: color.text, textAlign: 'center'}}>
                  Đang tải...
                </Text>
              )}
              {/* <Text style={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0, right: 0,
            textAlign: 'left',
            color: color.black,
            backgroundColor: color.primary,
            padding: 10,
            fontSize: 14,
            fontWeight: 'bold',
          }}>@user1234556</Text> */}
              {/* <LinearGradient 
          colors={['transparent', color.primary]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0, right: 0,
                height: 50,
            }}/> */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  top: 0,
                  gap: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  flexDirection: 'row',
                }}
                onPress={() => {
                  setIsPause(!isPause);
                  setIsVisible(true);
                }}>
                {/* <TouchableOpacity style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 25, height: 25,
                backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                borderColor: color.text,
                borderWidth: 1,
                borderRadius: 50,
            }}
            onPress={lessTime}>
                <Image source={require('../../../../assets/icon/left.png')} style={{width: 10, height: 10, resizeMode: 'contain', tintColor: color.text}}/>
            </TouchableOpacity> */}
                {isVisible && (
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 38,
                      height: 38,
                      backgroundColor:
                        theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.5)'
                          : 'rgba(0, 0, 0, 0.5)',
                      borderColor: color.background,
                      borderWidth: 1,
                      borderRadius: 50,
                    }}
                    onPress={() => setIsPause(!isPause)}>
                    {isPause ? (
                      <Play size={22} color={color.background} />
                    ) : (
                      <Pause size={22} color={color.background} />
                    )}
                  </TouchableOpacity>
                )}
                {/* <TouchableOpacity style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 25, height: 25,
                backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                borderColor: color.text,
                borderWidth: 1,
                borderRadius: 50,
            }}
            onPress={moreTime}>
                <Image source={require('../../../../assets/icon/right.png')} style={{width: 10, height: 10, resizeMode: 'contain', tintColor: color.text}}/>
            </TouchableOpacity> */}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default VideoModal;

const styles = StyleSheet.create({
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
