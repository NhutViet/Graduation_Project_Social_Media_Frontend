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
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import ModelPeopleSeen from './component/ModelPeopleSeen';
import HighlightAddModal from './component/HighlightAddModal';
import HighlightViewModal from './component/HighlightViewModal';
import {MediaSection} from './component/MediaSection';
import {styles} from './component/style';
import debounce from 'lodash/debounce';
import {
  deleteStory,
  fetchGetPostedSotry,
} from '@services/StoryRedux/StorySlice';
import SeenStoryOwnerHeader from './component/Header';
import SeenStoryOwnerBottom from './component/BottomBar';
import ModalSeeMore from './component/ModelSeeMore';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const SeenStoryOwner = ({route, navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
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
  const progressValues = useRef<number[]>(stories.map(() => 0)).current;
  const [isMuted, setIsMuted] = useState(false);
  console.log('story>>>>>>>>', stories);
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

  const handleDeleteStory = async () => {
    try {
      const currentStory = stories[currentIndex];
      if (!currentStory?._id) return;

      const result = await dispatch(deleteStory({storyId: currentStory._id}));

      if (deleteStory.fulfilled.match(result)) {
        GlobalAlertManager.show('Thành công', 'Tin của bạn đã được xoá');
        dispatch(fetchGetPostedSotry());
        navigation.goBack();
      } else {
        GlobalAlertManager.show('Thất bại', 'Không thể xoá story');
      }
    } catch (error) {
      console.log('Line 100', error);
    }
  };

  const getItemDuration = () => {
    const currentStory = stories[currentIndex];

    // Nếu là video .m3u8 thì lấy duration video
    if (currentStory?.mediaUrl?.endsWith('.m3u8') && videoDuration) {
      return videoDuration * 1000;
    }

    // Nếu là ảnh (không phải video), thì chỉ lấy imageDuration
    return imageDuration;
  };

  const startProgressAnimation = (forceRestart = false) => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    const anim = progressAnims[currentIndex];
    if (!anim) return;

    // Nếu reset thì đặt lại
    if (forceRestart || progressValues[currentIndex] >= 1) {
      anim.setValue(0);
      progressValues[currentIndex] = 0;
    }

    const remainingDuration =
      (1 - progressValues[currentIndex]) * getItemDuration();

    animationRef.current = Animated.timing(anim, {
      toValue: 1,
      duration: remainingDuration,
      useNativeDriver: false,
    });

    // Theo dõi giá trị tiến độ để cập nhật lại `progressValues`
    const listenerId = anim.addListener(({value}) => {
      progressValues[currentIndex] = value;
    });

    animationRef.current.start(({finished}) => {
      anim.removeListener(listenerId);
      if (finished) {
        progressValues[currentIndex] = 1;
        goToNextStory();
      }
    });
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

  // pause story
  const toggleVideoPause = () => {
    setIsVideoPaused(prev => {
      const newState = !prev;
      if (newState) {
        animationRef.current?.stop(); // pause
      } else {
        startProgressAnimation(); // không truyền true => không reset
      }
      return newState;
    });
  };
  // mute story
  const toggleMute = () => {
    setIsMuted(prev => !prev);
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
      startProgressAnimation();
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
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      debouncedHandleTouch.cancel();
    };
  }, [debouncedHandleTouch]);

  const handleCloserPress = () => {
    navigation.goBack();
  };

  const getCaptionPosition = (xPercent: number, yPercent: number) => {
    const width = mediaSize.width || screenWidth;
    const height = mediaSize.height || screenHeight;
    return {
      left: (xPercent / 100) * width,
      top: (yPercent / 100) * height,
    };
  };
  // caption
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
  // tag
  const renderTags = () => {
    const tags = selectedItem?.tags || [];
    console.log('tag>>>>>>>>>>>', tags);

    return tags.map((tag, index) => {
      const {user, position} = tag;
      if (!user) return null;

      const {x, y} = position;
      const {username, handleName} = user;

      const tagPosition = getCaptionPosition(x * 100, y * 100);

      return (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: tagPosition.left,
            top: tagPosition.top,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 12,
            zIndex: 10,
          }}>
          <Text style={{color: '#fff', fontSize: 14, fontWeight: '500'}}>
            @{handleName}
          </Text>
        </View>
      );
    });
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
        <SeenStoryOwnerHeader
          onClose={handleCloserPress}
          progressAnims={progressAnims}
          pause={isVideoPaused}
          onTogglePause={toggleVideoPause}
          mute={isMuted}
          onToggleMute={toggleMute}
        />
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
            muted={isMuted}
          />
        ) : null}
        {renderCaption()}
        {renderTags()}
        {renderMusicInfo()}
      </View>

      <SeenStoryOwnerBottom
        onShowPeopleSeen={() => setVisible(true)}
        onShowMore={() => setVisibleSeeMore(true)}
        visible={visible}
        users={selectedItem?.viewedByUsers || []}
        onClose={() => setVisible(false)}
        onDelete={handleDeleteStory}
      />

      <Portal>
        <ModelPeopleSeen
          visible={visible}
          onClose={() => setVisible(false)}
          users={selectedItem?.viewedByUsers || []}
        />
        <ModalSeeMore
          visible={visibleSeeMore}
          onClose={() => setVisibleSeeMore(false)}
          onDelete={handleDeleteStory}
        />
      </Portal>
    </SafeAreaView>
  );
};
