import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import Draggable from 'react-native-draggable';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Sound from 'react-native-sound';
import axios from 'axios';
import {BASE_URL} from '../../../services/api';
import {useUploadProgress} from '../../../services/UploadProgressManager';
import {useSelector} from 'react-redux';
import {RootState} from '../../../services/store';
import {uploadImageToR2, uploadToCloudflare} from '../../core/upload';

export const EditStory = ({route, navigation}: any) => {
  const {selectedItem, selectedMusic, songUrl} = route.params;
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [caption, setCaption] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const videoRef = useRef<any>(null);
  const audioRef = useRef<Sound | null>(null); // ref cho âm thanh
  //lấy tọa độ
  const positionRef = useRef({x: 0, y: 0});
  const [initialized, setInitialized] = useState(false);

  // Sau khi render lần đầu, ngừng truyền x/y để tránh nhảy
  useEffect(() => {
    setInitialized(true);
  }, []);

  const {refreshToken} = useSelector((state: RootState) => state.user);

  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();

  const imageDuration = 10000; // 10 seconds for images

  const getItemDuration = () => {
    if (selectedItem?.type.includes('video') && videoDuration) {
      return videoDuration * 1000; // Convert to milliseconds
    }
    return imageDuration;
  };

  const startProgressAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    progressAnim.setValue(0);
    const duration = getItemDuration();
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    });

    animationRef.current.start(({finished}) => {
      if (finished) {
        progressAnim.setValue(0); // Reset progress for loop
        startProgressAnimation(); // Restart animation
        //nếu có nhạc thì chuyển audio vể timeStart
        if (selectedMusic && audioRef.current) {
          audioRef.current.setCurrentTime(selectedMusic.timeStart || 0);
          audioRef.current.play();
        }
      }
    });
  };

  const onVideoLoad = (data: any) => {
    console.log(`Video loaded, duration: ${data.duration}`);
    setVideoDuration(data.duration);
  };

  const onVideoProgress = (data: any) => {
    if (selectedItem?.type.includes('video')) {
      const currentTime = data.currentTime;
      setVideoCurrentTime(currentTime);
      if (videoDuration) {
        const progress = currentTime / videoDuration;
        progressAnim.setValue(progress);
      }
    }
  };

  const onVideoEnd = () => {
    progressAnim.setValue(0); // Reset progress for loop
    if (videoRef.current) {
      videoRef.current.seek(0); // Restart video
    }
    if (selectedMusic && audioRef.current) {
      audioRef.current.setCurrentTime(selectedMusic.timeStart || 0); // restart audio nếu có chọn
      audioRef.current.play();
    }
  };
  //chạy audio nêys có selectedMusic
  useEffect(() => {
    if (selectedMusic && songUrl) {
      const sound = new Sound(songUrl, undefined, error => {
        if (error) {
          console.log('Không thể tải âm thanh: ', error);
          return;
        }
        audioRef.current = sound;
        sound.setCurrentTime(selectedMusic.timeStart || 0);
        sound.setVolume(1.0);
        sound.play(success => {
          if (success) {
            //lặp lại audio
            sound.setCurrentTime(selectedMusic.timeStart || 0);
            sound.play();
          } else {
            console.log('Phát âm thanh thất bại.');
          }
        });
      });
    }

    //clean audio khi component unmout
    return () => {
      if (audioRef.current) {
        audioRef.current.release();
      }
    };
  }, [selectedMusic, songUrl]);

  useEffect(() => {
    setVideoDuration(null);
    setVideoCurrentTime(0);
    progressAnim.setValue(0);

    if (selectedItem?.type.includes('video')) {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    } else {
      startProgressAnimation();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [selectedItem]);

  const handleScreenTap = () => {
    console.log('Screen tapped, opening modal');
    setIsModalVisible(true);
  };

  const handleDonePress = () => {
    console.log('Done pressed, closing modal with caption:', caption);
    setIsModalVisible(false);
    setHasShownModal(true); // Keep track that modal has been shown at least once
  };

  const handleCloserPress = () => {
    console.log('Closer pressed, navigating back');
    navigation.goBack();
  };

  const renderProgressBar = () => {
    const width = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarWrapper}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width,
                backgroundColor: '#fff',
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const handleUploadStory = async () => {
    try {
      setProgress(0); // Reset tiến độ
      //kiểm tra selectedItem
      if (!selectedItem) {
        console.error('Không có media để upload.');
        return;
      }

      let mediaUrl = '';

      //xử lý loại
      try {
        if (selectedItem?.type.includes('video')) {
          const videoKey = await uploadToCloudflare(selectedItem.uri, {
            showUploadModal,
            hideUploadModal,
            setProgress,
          });
          mediaUrl = `https://videodelivery.net/${videoKey}/manifest/video.m3u8`;
        } else {
          mediaUrl = await uploadImageToR2(selectedItem.uri, {
            showUploadModal,
            hideUploadModal,
            setProgress,
          });
        }
      } catch (error) {
        Alert.alert(
          'Upload thất bại',
          `Không thể upload ${
            selectedItem?.type.includes('video') ? 'video' : 'ảnh'
          }: ${selectedItem.uri}`,
        );
        return;
      }

      const payload = {
        mediaUrl,
        music: selectedMusic?.musicId ? {
          musicId: selectedMusic?.musicId,
          time_start: selectedMusic.timeStart || 0,
          time_end: selectedMusic.timeEnd || 30,
        } :undefined,
        content: caption ? {
          text: caption,
          x: positionRef.current.x,
          y: positionRef.current.y,
        }: undefined,
        
      };

      //api
      const res = await axios.post(`${BASE_URL}/stories/create`, payload, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      console.log('Upload story thành công: ', res.data);

      hideUploadModal();
      navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
    } catch (error) {
      console.error('Lỗi khi upload story: ', error);
      hideUploadModal();
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.btnCloser}
              onPress={handleCloserPress}>
              <Image
                style={styles.iconCloser}
                source={require('../../../assets/icon/closer.png')}
              />
            </TouchableOpacity>
            <View style={styles.viewHeaderRight}>
              <TouchableOpacity
                style={[styles.btnCloser, {marginRight: 15}]}
                onPress={() => setIsModalVisible(true)}>
                <Text style={styles.txtAa}>Aa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnCloser}
                onPress={handleUploadStory}>
                <Image
                  style={styles.iconCloser}
                  source={require('../../../assets/icon/rightArrow.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mediaItems}>{renderProgressBar()}</View>
          <View style={styles.mediaWrapper}>
            <TouchableWithoutFeedback onPress={handleScreenTap}>
              <View style={styles.mediaTouchArea}>
                {selectedItem ? (
                  selectedItem.type.includes('video') ? (
                    <Video
                      ref={videoRef}
                      source={{uri: selectedItem.uri}}
                      style={styles.media}
                      resizeMode="contain"
                      repeat={false}
                      onLoad={onVideoLoad}
                      onProgress={onVideoProgress}
                      onEnd={onVideoEnd}
                      playInBackground={false}
                      playWhenInactive={false}
                    />
                  ) : (
                    <Image
                      source={{uri: selectedItem.uri}}
                      style={styles.media}
                      resizeMode="contain"
                    />
                  )
                ) : (
                  <Text style={styles.errorText}>
                    Không có media để hiển thị
                  </Text>
                )}
                {caption && (
                  <Draggable
                    x={!initialized ? positionRef.current.x : undefined}
                    y={!initialized ? positionRef.current.y : undefined}
                    onDragRelease={(event, gestureState) => {
                      positionRef.current.x += gestureState.dx;
                      positionRef.current.y += gestureState.dy;
                      console.log(
                        `📍 New position: x=${positionRef.current.x}, y=${positionRef.current.y}`,
                      );
                    }}>
                    <View style={styles.textInputContainer}>
                      <Text style={styles.captionText}>{caption}</Text>
                    </View>
                  </Draggable>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.controls} />
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              console.log('Modal close requested, closing modal');
              setIsModalVisible(false);
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.textInput}
                  value={caption}
                  onChangeText={setCaption}
                  placeholderTextColor="#aaa"
                  multiline
                  autoFocus
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDonePress}>
                  <Text style={styles.doneButtonText}>Xong</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    marginRight: 15,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50, // Fixed height for header
  },
  btnCloser: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(140, 137, 137, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCloser: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  mediaItems: {
    height: 35,
    marginBottom: 0,
    marginTop: 10,
  },
  mediaWrapper: {
    flex: 1,
    position: 'relative',
  },
  mediaTouchArea: {
    flex: 1,
    position: 'relative',
  },
  media: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    backgroundColor: '#888',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
    padding: 15,
  },
  textInputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 5,
    width: '100%',
  },
  textInput: {
    width: 300,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  captionText: {
    width: 200,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  doneButton: {
    backgroundColor: '#555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    height: 50,
    padding: 15,
    alignItems: 'center',
  },
  txtAa: {
    fontWeight: '500',
    fontSize: 16,
    color: '#fff',
  },
  viewHeaderRight: {
    flexDirection: 'row',
  },
});
