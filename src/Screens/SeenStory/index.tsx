import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
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

import {Keyboard} from 'react-native';
import ModalShare, {ModalShareHandle} from './components/ModalShare';
import StoryLoadingSkeleton from '../../(tabs)/Home/components/StoryLoadingSkeleton';
import {debugStoryGroups} from '../../(tabs)/Home/util';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// ✅ Simple Loading Component as fallback
const SimpleLoading = () => (
  <View style={{
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={{
      color: '#fff',
      marginTop: 10,
      fontSize: 16,
    }}>
      Đang tải story...
    </Text>
  </View>
);

export const SeenStory = ({route, navigation}: any) => {
  const {
    creator,
    stories: routeStories = [],
    storyGroups = [],
    storyGroupIndex = 0,
    isLoading = false,
  } = route.params || {};

  // ✅ State để handle loading và update params
  const [stories, setStories] = useState(routeStories);
  const [currentStoryGroups, setCurrentStoryGroups] = useState(storyGroups);
  const [currentCreator, setCurrentCreator] = useState(creator);
  const [isDataLoading, setIsDataLoading] = useState(isLoading);

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
    stories.map(() => new Animated.Value(0)),
  ).current;
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMusicLoaded, setIsMusicLoaded] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const shareModalRef = useRef<ModalShareHandle>(null);

  // ✅ Listen for parameter updates
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = route.params;
      if (params) {
        setStories(params.stories || []);
        setCurrentStoryGroups(params.storyGroups || []);
        setCurrentCreator(params.creator || {});
        setIsDataLoading(params.isLoading || false);
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  // ✅ Update progress anims when stories change
  useEffect(() => {
    if (stories.length !== progressAnims.length) {
      progressAnims.splice(0, progressAnims.length);
      progressAnims.push(...stories.map(() => new Animated.Value(0)));
    }
  }, [stories.length]);

  const selectedItem = useMemo(
    () => stories[currentIndex] || {},
    [stories, currentIndex],
  );

  // ✅ Show loading skeleton if data is still loading or story is loading
  if (isDataLoading || selectedItem.isLoading) {
    return <StoryLoadingSkeleton />;
  }

  useEffect(() => {
    const hasVideo = !!selectedItem?.uriVideo;
    const hasMusic = !!selectedItem?.music?.link;

    if ((hasVideo && !isVideoLoaded) || (hasMusic && !isMusicLoaded)) {
      return;
    }

    setIsMediaLoading(false);
    if (!isPaused) {
      startProgressAnimation();
    }
  }, [isVideoLoaded, isMusicLoaded]);

  const imageDuration = 15000;

  const getItemDuration = () => {
    if (selectedItem?.uriVideo && videoDuration) {
      return videoDuration * 1000;
    }

    if (!selectedItem?.uriVideo && selectedItem?.music?.link && musicDuration) {
      return imageDuration;
    }

    return imageDuration;
  };

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef<any>(null);
  
  // hàm next story
  const goToNextStory = () => {
    stopCurrentAnimation();

    if (currentIndex < stories.length - 1) {
      console.log(`📱 Next story within same user: ${currentIndex + 1}/${stories.length}`);
      setCurrentIndex(currentIndex + 1);
    } else {
      const nextGroupIndex = storyGroupIndex + 1;

      if (nextGroupIndex < currentStoryGroups.length) {
        const nextGroup = currentStoryGroups[nextGroupIndex];
        
        console.log(`📱 Moving to next user group: ${nextGroup.creator.username} (index ${nextGroupIndex})`);
        debugStoryGroups(currentStoryGroups, nextGroupIndex, 'Navigation: Next Group');
        
        // ✅ Check if next group belongs to current user
        const isOwner = nextGroup.creator?.username === user?.handleName ||
                       nextGroup.creator?._id === user?._id;
        const routeName = isOwner ? 'SeenStoryOwner' : 'SeenStory';

        navigation.replace(routeName, {
          storyGroups: currentStoryGroups,
          storyGroupIndex: nextGroupIndex,
          creator: nextGroup.creator,
          stories: nextGroup.stories,
          initialIndex: 0,
          timestamp: Date.now(),
        });
      } else {
        console.log('📱 No more story groups, going back');
        navigation.goBack();
      }
    }
  };
  
  // hàm thanh ProgressBar hoạt dộng
  const startProgressAnimation = () => {
    animationRef.current?.stop();

    const anim = progressAnims[currentIndex];
    if (!anim) return;

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
      // ✅ Lùi trong cùng user group
      console.log(`📱 Previous story within same user: ${currentIndex - 1}/${stories.length}`);
      setCurrentIndex(currentIndex - 1);
    } else {
      // ✅ Đang ở story đầu tiên của group, tìm previous group
      console.log(`📱 At first story of current group, looking for previous group...`);
      
      let prevGroupIndex = storyGroupIndex - 1;

      // ✅ Tìm previous group có stories
      while (prevGroupIndex >= 0) {
        const prevGroup = currentStoryGroups[prevGroupIndex];

        if (prevGroup?.stories?.length > 0) {
          console.log(`📱 Moving to previous user group: ${prevGroup.creator.username} (index ${prevGroupIndex})`);
          debugStoryGroups(currentStoryGroups, prevGroupIndex, 'Navigation: Previous Group');

          // ✅ Check ownership properly  
          const isOwner = prevGroup.creator?.username === user?.handleName ||
                         prevGroup.creator?._id === user?._id;
          const routeName = isOwner ? 'SeenStoryOwner' : 'SeenStory';

          navigation.replace(routeName, {
            storyGroups: currentStoryGroups,
            storyGroupIndex: prevGroupIndex,
            creator: prevGroup.creator,
            stories: prevGroup.stories,
            initialIndex: (prevGroup.stories.length || 1) - 1,
            timestamp: Date.now(),
          });
          
          return; // ✅ Tìm thấy và navigate thành công
        }
        
        // ✅ Group này không có stories, thử group trước đó
        prevGroupIndex--;
      }
      
      // ✅ Chỉ goBack khi thực sự không còn previous group nào có stories
      console.log('📱 No previous story groups with stories, going back');
      navigation.goBack();
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

    return tags.map(({tag, index}: any) => {
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
  // logic khi nhấn vàp textInput thì dứng story
  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setIsPaused(true);
    });

    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setIsPaused(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  useEffect(() => {
    const liked = selectedItem?.likedByUsers?.includes(user?._id);
    setIsLiked(liked || false);
  }, [selectedItem, user?._id]);

  useEffect(() => {
    if (!selectedItem) return;

    stopCurrentAnimation();
    setVideoDuration(null);
    setMusicDuration(null);
    setIsVideoLoaded(false);
    setIsMusicLoaded(false);
    setIsMediaLoading(true);
    progressAnims.forEach((anim, i) => {
      if (i < currentIndex) anim.setValue(1);
      else anim.setValue(0);
    });

    //  Nếu không có video/music, start luôn
    const hasVideo = !!selectedItem.uriVideo;
    const hasMusic = !!selectedItem.music?.link;

    if (!hasVideo && !hasMusic) {
      startProgressAnimation();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isPaused) {
      startProgressAnimation();
    } else {
      stopCurrentAnimation();
    }
  }, [isPaused]);

  const handleOpenShare = () => {
    stopCurrentAnimation();
    shareModalRef.current?.open(); // phải dùng ref để mở Modal
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.mediaWrapper}
        activeOpacity={1}
        onPress={handleTouch}>
        <Header
          onClose={() => navigation.goBack()}
          username={currentCreator?.username}
          profilePic={currentCreator?.profilePic}
          pause={isPaused}
          onTogglePause={togglePause}
          mute={isMuted}
          onToggleMute={toggleMute}
          createdAt={selectedItem?.createdAt}
        />
        <ProgressBar
          progressAnims={progressAnims}
          storyCount={stories.length}
        />
        <MediaPlayer
          item={selectedItem}
          ref={videoRef}
          onLoad={d => {
            setVideoDuration(d.duration);
            setIsVideoLoaded(true);
          }}
          onEnd={goToNextStory}
          onMediaLayout={setMediaSize}
          onMusicLoad={seconds => {
            setMusicDuration(seconds);
            setIsMusicLoaded(true);
          }}
          onMusicEnd={goToNextStory}
          paused={isPaused}
          muted={isMuted}
          isMediaLoading={isMediaLoading}
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
        ref={shareModalRef}
        onOpen={() => {
          setIsPaused(true); // dừng story
          stopCurrentAnimation(); // đảm bảo animation ngừng
        }}
        onClose={() => {
          setIsPaused(false); // tiếp tục
          startProgressAnimation(); // gọi lại animation!
        }}
      />
    </SafeAreaView>
  );
};
