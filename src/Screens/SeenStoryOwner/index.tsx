import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useSelector} from 'react-redux';
import {RootState} from '../../../services/store';
import ModelPeopleSeen from './component/ModelPeopleSeen';
import ModelSeeMore from './component/ModelSeeMore';
import HighlightAddModal from './component/HighlightAddModal';
import HighlightViewModal from './component/HighlightViewModal';
import {MediaSection} from './component/MediaSection';
import {styles} from './component/style';
import debounce from 'lodash/debounce';

// Data mẫu cho modal highlight
const highlights = [
  {
    id: '1',
    name: 'Trip',
    isAdded: true,
    imageURL:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
  {
    id: '2',
    name: 'Food',
    isAdded: true,
    imageURL:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
  {
    id: '3',
    name: 'Friends',
    isAdded: false,
    imageURL:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const SeenStoryOwner = ({route, navigation}: any) => {
  const {stories, creator} = route.params;
  const user = useSelector((state: RootState) => state.user.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const selectedItem = stories[currentIndex];
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [musicDuration, setMusicDuration] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [visibleSeeMore, setVisibleSeeMore] = useState(false);
  const [mediaSize, setMediaSize] = useState({width: 0, height: 0});

  const progressAnims = useRef<Animated.Value[]>(
    (stories || []).map(() => new Animated.Value(0)),
  ).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const videoRef = useRef<any>(null);
  const viewModalRef = useRef<Modalize>(null);
  const addModalRef = useRef<Modalize>(null);

  const imageDuration = 15000;

  const handleOpenAddModal = () => {
    viewModalRef.current?.close();
    setTimeout(() => addModalRef.current?.open(), 300);
  };

  const handleOnBackAddModal = () => {
    addModalRef.current?.close();
    setTimeout(() => viewModalRef.current?.open(), 300);
  };

  const handleAddHighlight = (name: string) => {
    addModalRef.current?.close();
  };

  const getItemDuration = () => {
    const currentStory = stories[currentIndex];
    if (currentStory?.mediaUrl?.endsWith('.m3u8') && videoDuration) {
      return videoDuration * 1000;
    }
    if (currentStory?.music?.link && musicDuration) {
      return Math.max(musicDuration * 1000, imageDuration);
    }
    return imageDuration;
  };

  const startProgressAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    if (progressAnims[currentIndex]) {
      progressAnims[currentIndex].setValue(0);
      const duration = getItemDuration();

      animationRef.current = Animated.timing(progressAnims[currentIndex], {
        toValue: 1,
        duration,
        useNativeDriver: false,
      });

      animationRef.current.start(({finished}) => {
        if (finished) {
          goToNextStory();
        }
      });
    }
  };

  const goToNextStory = () => {
    const maxIndex = (stories?.length || 0) - 1;
    if (currentIndex < maxIndex) {
      setVideoDuration(null);
      setMusicDuration(null);
      setIsVideoPaused(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const goToPreviousStory = () => {
    setCurrentIndex(prev => {
      if (prev > 0) {
        setVideoDuration(null);
        setMusicDuration(null);
        setIsVideoPaused(false);
        return prev - 1;
      }

      return prev;
    });
  };

  const toggleVideoPause = () => {
    if (!selectedItem?.mediaUrl?.endsWith('.m3u8')) {
      return;
    }

    setIsVideoPaused(prev => {
      const newState = !prev;

      if (newState) {
        animationRef.current?.stop();
      } else {
        startProgressAnimation();
      }
      return newState;
    });
  };

  const debouncedHandleTouch = useRef(
    debounce((locationX: number | null) => {
      if (locationX == null) {
        toggleVideoPause();
        return;
      }

      if (locationX < screenWidth / 3) {
        goToPreviousStory();
      } else if (locationX > (screenWidth * 2) / 3) {
        goToNextStory();
      } else {
        toggleVideoPause();
      }
    }, 300),
  ).current;

  const handleTouch = useCallback(
    (event: GestureResponderEvent) => {
      const locationX = event.nativeEvent.locationX;

      debouncedHandleTouch(locationX);
    },
    [debouncedHandleTouch],
  );

  const onVideoLoad = (data: any) => {
    setVideoDuration(data.duration);

    if (!isVideoPaused) {
      startProgressAnimation();
    }
  };

  const onMusicLoad = (data: any) => {
    setMusicDuration(data.duration);

    if (!isVideoPaused) {
      startProgressAnimation(); // ✅ Thêm dòng này để kích hoạt thanh tiến trình
    }
  };

  const onVideoEnd = () => {
    goToNextStory();
  };

  const onMusicEnd = () => {
    goToNextStory();
  };

  useEffect(() => {
    setVideoDuration(null);
    setMusicDuration(null);
    setIsVideoPaused(false);

    if (!stories[currentIndex]) {
      navigation.goBack();
      return;
    }
    progressAnims.forEach((anim: Animated.Value, index: number) => {
      if (index < currentIndex) anim.setValue(1);
      else if (index > currentIndex) anim.setValue(0);
      else anim.setValue(0); // Reset thanh tiến trình cho story hiện tại
    });

    const currentStory = stories[currentIndex];
    if (currentStory) {
      const isVideo = currentStory?.mediaUrl?.endsWith('.m3u8');
      const hasMusic = !!currentStory?.music?.link;
      if (!isVideo && !hasMusic && !isVideoPaused) {
        startProgressAnimation();
      }
    } else {
      console.warn('🚨 Current story is undefined at index:', currentIndex);
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [currentIndex, isVideoPaused]);

  useEffect(() => {
    return () => {
      debouncedHandleTouch.cancel();
    };
  }, [debouncedHandleTouch]);

  const handleCloserPress = () => {
    navigation.goBack();
  };

  const renderProgressBars = () => {
    return (
      <View style={styles.progressContainer}>
        {stories.map((_, index) => {
          const width = progressAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });
          return (
            <View key={index} style={styles.progressBarWrapper}>
              <Animated.View
                style={[styles.progressBar, {width, backgroundColor: '#fff'}]}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const getCaptionPosition = (xPercent: number, yPercent: number) => {
    const width = mediaSize.width || screenWidth;
    const height = mediaSize.height || screenHeight;
    return {
      left: (xPercent / 100) * width,
      top: (yPercent / 100) * height,
    };
  };

  const renderCaption = () => {
    const content = selectedItem?.content;
    if (!content?.text) return null;

    const position = getCaptionPosition(content.x || 50, content.y || 50);
    return (
      <Text
        style={{
          position: 'absolute',
          color: '#fff',
          fontSize: 18,
          fontWeight: '600',
          ...position,
        }}>
        {content.text}
      </Text>
    );
  };

  const renderMusicInfo = () => {
    const music = selectedItem?.music;
    if (!music?.title && !music?.artist) return null;

    return (
      <View style={styles.musicContainer}>
        <Text style={styles.musicTitle}>{music?.title || 'Unknown Title'}</Text>
        <Text style={styles.musicArtist}>
          {music?.artist || 'Unknown Artist'}
        </Text>
      </View>
    );
  };

  if (!stories || stories.length === 0) {
    console.warn('🚫 No stories available');
    navigation.goBack();
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.mediaWrapper}
        onStartShouldSetResponder={() => true}
        onResponderRelease={handleTouch}>
        <View style={styles.header}>
          <View style={styles.mediaItems}>{renderProgressBars()}</View>
          <TouchableOpacity style={styles.viewUser}>
            <Image style={styles.avatar} source={{uri: user?.profilePic}} />
            <Text style={styles.nameUser}>{user?.username}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCloser}
            onPress={handleCloserPress}>
            <Image
              style={styles.iconCloser}
              source={require('../../../assets/icon/closer.png')}
            />
          </TouchableOpacity>
        </View>
        {stories[currentIndex] ? (
          <MediaSection
            selectedItem={stories[currentIndex]}
            ref={videoRef}
            onLoad={onVideoLoad}
            onEnd={onVideoEnd}
            onMediaLayout={setMediaSize}
            onMusicLoad={onMusicLoad}
            onMusicEnd={onMusicEnd}
            paused={isVideoPaused}
          />
        ) : null}
        {renderCaption()}
        {renderMusicInfo()}
      </View>
      <View style={styles.viewBottom}>
        <TouchableOpacity
          style={styles.viewIconItem}
          onPress={() => setVisible(true)}>
          <Image
            style={styles.icon}
            source={require('../../../assets/icon/users.png')}
          />
          <Text style={styles.txtIcon}>Hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewIconItem}
          onPress={() => setVisibleSeeMore(true)}>
          <Image
            style={styles.icon}
            source={require('../../../assets/icon/ellipsis.png')}
          />
          <Text style={styles.txtIcon}>Xem thêm</Text>
        </TouchableOpacity>
        <ModelPeopleSeen
          visible={visible}
          onClose={() => setVisible(false)}
          users={selectedItem?.viewByUsers || []}
        />
        <ModelSeeMore
          visible={visibleSeeMore}
          onClose={() => setVisibleSeeMore(false)}
        />
      </View>

      <Portal>
        <HighlightViewModal
          ref={viewModalRef}
          data={highlights}
          onAddNew={handleOpenAddModal}
        />
      </Portal>

      <Portal>
        <HighlightAddModal
          ref={addModalRef}
          onAdd={handleAddHighlight}
          onBack={handleOnBackAddModal}
          imageSource={
            'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg'
          }
        />
      </Portal>
    </SafeAreaView>
  );
};
