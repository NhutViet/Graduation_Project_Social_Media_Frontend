import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';

export const EditStory = ({route, navigation}: any) => {
  const {selectedItem, selectedItems, clearSelections} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState(null); // Store video duration dynamically
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null); // Store animation reference to stop it

  // If single item, convert to array for consistency
  const mediaItems = selectedItems || (selectedItem ? [selectedItem] : []);
  const imageDuration = 10000; // 10 seconds for images

  // Determine duration for the current item
  const getCurrentItemDuration = () => {
    const currentItem = mediaItems[currentIndex];
    if (currentItem?.type.includes('video') && videoDuration) {
      return videoDuration * 1000; // Convert to milliseconds
    }
    return imageDuration; // 10 seconds for images
  };

  // Animate progress bar
  const startProgressAnimation = () => {
    // Stop previous animation if it exists
    if (animationRef.current) {
      animationRef.current.stop();
    }

    progressAnim.setValue(0);
    const duration = getCurrentItemDuration();
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    });

    animationRef.current.start(({finished}) => {
      if (finished) {
        if (currentIndex < mediaItems.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0); // Loop back to start
        }
      }
    });
  };

  // Update progress animation whenever currentIndex changes
  useEffect(() => {
    if (mediaItems.length > 0) {
      setVideoDuration(null); // Reset video duration for new item
      startProgressAnimation();
    }

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [currentIndex, mediaItems]);

  // Handle video load to get duration
  const onVideoLoad = (data: any) => {
    setVideoDuration(data.duration);
    // Restart animation with correct duration
    startProgressAnimation();
  };

  // Handle navigation on tap
  const handleLeftTap = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRightTap = () => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  // Handle closer press
  const handleCloserPress = () => {
    clearSelections(); // Clear selected items in PostStory
    navigation.goBack(); // Navigate back
  };

  // Render progress bars
  const renderProgressBars = () => {
    return (
      <View style={styles.progressContainer}>
        {mediaItems.map((_: any, index: any) => {
          const isActive = index === currentIndex;
          const width = progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });

          return (
            <View key={index} style={styles.progressBarWrapper}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: isActive
                      ? width
                      : index < currentIndex
                      ? '100%'
                      : '0%',
                    backgroundColor:
                      isActive || index < currentIndex ? '#fff' : '#888',
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    );
  };

  // Render current media item
  const currentItem = mediaItems[currentIndex] || null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnCloser} onPress={handleCloserPress}>
          <Image
            style={styles.iconCloser}
            source={require('../../../assets/icon/closer.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCloser} onPress={handleCloserPress}>
          <Image
            style={styles.iconCloser}
            source={require('../../../assets/icon/rightArrow.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.mediaItems}>
        {mediaItems.length > 1 && renderProgressBars()}
      </View>
      <View style={styles.mediaWrapper}>
        <TouchableWithoutFeedback onPress={handleLeftTap}>
          <View style={styles.leftTapArea} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleRightTap}>
          <View style={styles.rightTapArea} />
        </TouchableWithoutFeedback>
        {currentItem ? (
          currentItem.type.includes('video') ? (
            <Video
              source={{uri: currentItem.uri}}
              style={styles.media}
              resizeMode="cover"
              muted
              repeat={false}
              onLoad={onVideoLoad}
              onEnd={() => {
                if (currentIndex < mediaItems.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  setCurrentIndex(0);
                }
              }}
            />
          ) : (
            <Image
              source={{uri: currentItem.uri}}
              style={styles.media}
              resizeMode="cover"
            />
          )
        ) : (
          <Text style={styles.errorText}>Không có media để hiển thị</Text>
        )}
      </View>
      <View style={styles.controls}>
        <Text style={styles.controlText}>
          Thêm văn bản, sticker, hoặc nhạc...
        </Text>
      </View>
    </SafeAreaView>
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
  },
  btnCloser: {
    width: 30,
    height: 30,
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
    marginBottom: 25,
    marginTop: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  mediaWrapper: {
    flex: 1,
    position: 'relative',
  },
  media: {
    flex: 1,
    width: '100%',
  },
  leftTapArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '33%', // 1/3 screen for left tap
    zIndex: 10,
  },
  rightTapArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '67%', // 2/3 screen for right tap
    zIndex: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 5,
    paddingTop: 5,
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
  controls: {
    padding: 15,
    alignItems: 'center',
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
});
