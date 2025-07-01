import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {
  fetchFollowingStories,
  toggleLikeStory,
} from '../../../services/StoryRedux/StorySlice';
import {styles} from './components/styles';
import {Header} from './components/Header';
import {ProgressBar} from './components/ProgressBar';
import {MediaPlayer} from './components/MediaPlayer';
import {Footer} from './components/Footer';
import {ModalShare} from './components/modalShare';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const SeenStory = ({route, navigation}: any) => {
  const {
    creator,
    stories: routeStories = [],
    storyGroups = [],
    storyGroupIndex = 0,
  } = route.params || {};

  const [currentIndex, setCurrentIndex] = useState(
    route.params?.initialIndex || 0,
  );
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [musicDuration, setMusicDuration] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mediaSize, setMediaSize] = useState({width: 0, height: 0});
  const progressAnims = useRef<Animated.Value[]>(
    routeStories.map(() => new Animated.Value(0)),
  ).current;
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [showShareModal, setShowShareModal] = useState(false);

  const selectedItem = useMemo(
    () => routeStories[currentIndex] || {},
    [routeStories, currentIndex],
  );

  const imageDuration = 15000;

  const getItemDuration = () => {
    if (selectedItem?.uriVideo && videoDuration) {
      return videoDuration * 1000;
    }

    if (!selectedItem?.uriVideo && selectedItem?.music?.link && musicDuration) {
      return imageDuration; // ✅ Luôn cố định 15s dù nhạc dài
    }

    return imageDuration;
  };

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef<any>(null);
  // hàm next story
  const goToNextStory = () => {
    stopCurrentAnimation();

    if (currentIndex < routeStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const nextGroupIndex = storyGroupIndex + 1;

      if (nextGroupIndex < storyGroups.length) {
        const nextGroup = storyGroups[nextGroupIndex];
        navigation.replace('SeenStory', {
          storyGroups,
          storyGroupIndex: nextGroupIndex,
          creator: nextGroup.creator,
          stories: nextGroup.stories,
        });
      } else {
        navigation.goBack();
      }
    }
  };
  // hàm thanh ProgressBar hoạt dộng
  const startProgressAnimation = () => {
    animationRef.current?.stop();

    const anim = progressAnims[currentIndex];

    // ⚠️ Chỉ reset nếu anim đang ở 0
    anim.stopAnimation(value => {
      if (value === 0 || value >= 1) {
        anim.setValue(0);
      }

      const duration = getItemDuration() * (1 - value); // phần còn lại

      animationRef.current = Animated.timing(anim, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      });

      animationRef.current.start(({finished}) => {
        if (finished) goToNextStory();
      });
    });
  };

  const stopCurrentAnimation = () => {
    animationRef.current?.stop();
    animationRef.current = null;
  };
  // hàm lùi story
  const goToPreviousStory = () => {
    stopCurrentAnimation();

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      const prevGroupIndex = storyGroupIndex - 1;

      if (prevGroupIndex >= 0) {
        const prevGroup = storyGroups[prevGroupIndex];

        const isOwner = prevGroup.creator?.username === user?.handleName; // Sửa thành username
        const routeName = isOwner ? 'SeenStoryOwner' : 'SeenStory';

        const routeKey = `${routeName}-${Date.now()}`;
        navigation.replace(routeName, {
          key: routeKey,
          storyGroups,
          storyGroupIndex: prevGroupIndex,
          creator: prevGroup.creator,
          stories: prevGroup.stories,
          initialIndex: (prevGroup.stories.length || 1) - 1,
          timestamp: Date.now(),
        });
      } else {
        navigation.goBack();
      }
    }
  };

  // pause
  const togglePause = () => setIsPaused(prev => !prev);
  // mute
  const toggleMute = () => setIsMuted(prev => !prev);

  const handleTouch = (event: any) => {
    const {locationX} = event.nativeEvent;
    if (locationX < screenWidth / 3) goToPreviousStory();
    else if (locationX > (screenWidth * 2) / 3) goToNextStory();
  };

  const handleLike = async () => {
    try {
      await dispatch(toggleLikeStory({storyId: selectedItem._id})).unwrap();

      dispatch(fetchFollowingStories({page: 1}));

      setIsLiked(prev => !prev);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err) {
      console.error('Error liking story:', err);
    }
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

    const {x = 50, y = 50} = content;
    const left = (x / 100) * (mediaSize.width || screenWidth);
    const top = (y / 100) * (mediaSize.height || screenHeight);

    return (
      <Text
        style={{
          position: 'absolute',
          color: '#fff',
          fontSize: 18,
          fontWeight: '600',
          left,
          top,
        }}>
        {content.text}
      </Text>
    );
  };

  const renderTags = () => {
    const tags = selectedItem?.tags || [];

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

  useEffect(() => {
    const liked = selectedItem?.likedByUsers?.includes(user?._id);
    setIsLiked(liked || false);
  }, [selectedItem, user?._id]);

  useEffect(() => {
    if (!selectedItem) return;

    stopCurrentAnimation();
    setVideoDuration(null);
    setMusicDuration(null);

    progressAnims.forEach((anim, i) => {
      if (i < currentIndex) anim.setValue(1);
      else anim.setValue(0);
    });

    // ✅ Nếu không có video/music, start luôn
    const hasVideo = !!selectedItem.uriVideo;
    const hasMusic = !!selectedItem.music?.link;

    if (!hasVideo && !hasMusic) {
      startProgressAnimation();
    }
  }, [currentIndex]);

  useEffect(() => {
    const hasVideo =
      !!selectedItem?.uriVideo && typeof videoDuration === 'number';
    const hasOnlyMusic =
      !selectedItem?.uriVideo &&
      selectedItem?.music?.link &&
      typeof musicDuration === 'number';
    const isImage = !selectedItem?.uriVideo && !selectedItem?.music?.link;

    // ⛔️ Đừng chạy nếu chưa có duration đầy đủ
    if (
      (hasVideo && videoDuration == null) ||
      (hasOnlyMusic && musicDuration == null)
    )
      return;

    if (!isPaused) {
      startProgressAnimation();
    }
  }, [videoDuration, musicDuration, selectedItem?._id, isPaused]);
  useEffect(() => {
    if (!isPaused) {
      startProgressAnimation();
    } else {
      stopCurrentAnimation();
    }
  }, [isPaused]);

  const handleOpenShare = () => setShowShareModal(true);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.mediaWrapper}
        activeOpacity={1}
        onPress={handleTouch}>
        <Header
          onClose={() => navigation.goBack()}
          username={creator?.username}
          profilePic={creator?.profilePic}
          pause={isPaused}
          onTogglePause={togglePause}
          mute={isMuted}
          onToggleMute={toggleMute}
          createdAt={selectedItem?.createdAt}
        />
        <ProgressBar
          progressAnims={progressAnims}
          storyCount={routeStories.length}
        />
        <MediaPlayer
          item={selectedItem}
          ref={videoRef}
          onLoad={d => {
            setVideoDuration(d.duration);
          }}
          onEnd={goToNextStory}
          onMediaLayout={setMediaSize}
          onMusicLoad={seconds => {
            setMusicDuration(seconds);
          }}
          onMusicEnd={goToNextStory}
          paused={isPaused}
          muted={isMuted}
        />
        {renderCaption()}
        {renderTags()}
      </TouchableOpacity>
      <Footer
        onLike={handleLike}
        isLiked={isLiked}
        scaleAnim={scaleAnim}
        onPressSend={handleOpenShare}
      />
      <ModalShare
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </SafeAreaView>
  );
};
