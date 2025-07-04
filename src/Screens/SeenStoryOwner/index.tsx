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
  ActivityIndicator,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import ModelPeopleSeen from './component/ModelPeopleSeen';
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
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import StoryLoadingSkeleton from '../../(tabs)/Home/components/StoryLoadingSkeleton';
import {debugStoryGroups} from '../../(tabs)/Home/util';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// ✅ LoadingSkeleton được import từ StoryLoadingSkeleton component

export const SeenStoryOwner = ({route, navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // ✅ Get initial params
  const {
    storyGroups: initialStoryGroups = [], 
    storyGroupIndex: initialStoryGroupIndex = 0,
    isLoading = false,
  } = route.params;

  // ✅ State để handle loading và update params
  const [storyGroups, setStoryGroups] = useState(initialStoryGroups);
  const [storyGroupIndex, setStoryGroupIndex] = useState(initialStoryGroupIndex);
  const [isDataLoading, setIsDataLoading] = useState(isLoading);

  const currentGroup = storyGroups[storyGroupIndex];
  const stories = currentGroup?.stories || [];
  const creator = currentGroup?.creator || {};

  const user = useSelector((state: RootState) => state.user.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // ✅ Debug currentIndex changes
  useEffect(() => {
    console.log(`📍 currentIndex changed to: ${currentIndex}/${stories.length - 1}`);
  }, [currentIndex, stories.length]);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const selectedItem = stories[currentIndex];
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [musicDuration, setMusicDuration] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [visibleSeeMore, setVisibleSeeMore] = useState(false);
  const [mediaSize, setMediaSize] = useState({width: 0, height: 0});
  const progressValues = useRef<number[]>(stories.map(() => 0)).current;
  const [isMuted, setIsMuted] = useState(false);
  // state để loading video và music
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMusicLoaded, setIsMusicLoaded] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const progressAnims = useRef<Animated.Value[]>(
    (stories || []).map(() => new Animated.Value(0)),
  ).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const videoRef = useRef<any>(null);
  const viewModalRef = useRef<Modalize>(null);
  const addModalRef = useRef<Modalize>(null);
  const isNavigatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const imageDuration = 15000;
  const isCurrentUserStory = creator?.username === user?.handleName;

  // ✅ Listen for parameter updates
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = route.params;
      if (params) {
        setStoryGroups(params.storyGroups || []);
        setStoryGroupIndex(params.storyGroupIndex || 0);
        setIsDataLoading(params.isLoading || false);
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  // ✅ Update progress anims when stories change
  useEffect(() => {
    console.log(`🔍 Stories length changed: ${stories.length}, progressAnims.length: ${progressAnims.length}`);
    if (stories.length !== progressAnims.length) {
      console.log(`📍 Updating progressAnims arrays for ${stories.length} stories`);
      progressAnims.splice(0, progressAnims.length);
      progressAnims.push(...stories.map(() => new Animated.Value(0)));
      progressValues.splice(0, progressValues.length);
      progressValues.push(...stories.map(() => 0));
    }
  }, [stories.length]);

  // ✅ Show loading skeleton if data is still loading or story is loading
  if (isDataLoading || (selectedItem && selectedItem.isLoading)) {
    return <StoryLoadingSkeleton />;
  }

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
  
  // handleDelte Story
  const handleDeleteStory = async () => {
    try {
      const currentStory = stories[currentIndex];
      if (!currentStory?._id) return;
      
      // ✅ Tắt modal ngay lập tức
      setVisibleSeeMore(false);
      
      // Xóa story từ server (Redux store sẽ tự động cập nhật)
      await dispatch(deleteStory({storyId: currentStory._id})).unwrap();

      GlobalAlertManager.show('Thành công', 'Tin của bạn đã được xoá');
      
      // ✅ Cập nhật state local ngay lập tức để UI responsive
      const updatedStories = stories.filter((_: any, index: number) => index !== currentIndex);
      
      if (updatedStories.length === 0) {
        // Không còn story nào, quay lại
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        // ✅ Cập nhật local state để không bị lag UI
        const updatedStoryGroups = [...storyGroups];
        updatedStoryGroups[storyGroupIndex] = {
          ...currentGroup,
          stories: updatedStories
        };
        setStoryGroups(updatedStoryGroups);
        
        // Điều chỉnh currentIndex nếu cần
        const newIndex = currentIndex >= updatedStories.length ? updatedStories.length - 1 : currentIndex;
        setCurrentIndex(newIndex);
      }
      
    } catch (error) {
      console.error('❌ Xoá story thất bại:', error);
      GlobalAlertManager.show('Thất bại', 'Không thể xoá story');
      // ✅ Đóng modal nếu có lỗi
      setVisibleSeeMore(false);
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

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  // hàm next story
  const goToNextStory = () => {
    console.log(`🔍 DEBUG goToNextStory - currentIndex: ${currentIndex}, stories.length: ${stories.length}`);
    
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    const maxIndex = stories.length - 1;

    if (currentIndexRef.current < maxIndex) {
      console.log(`📱 Next story within same user: ${currentIndexRef.current + 1}/${maxIndex + 1}`);
      setVideoDuration(null);
      setMusicDuration(null);
      setIsVideoPaused(false);
      setMusicDuration(null);
      setCurrentIndex(prev => {
        console.log(`📍 goToNextStory: updating currentIndex from ${prev} to ${prev + 1}`);
        return prev + 1;
      });

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 300);
    } else {
      let nextGroupIndex = storyGroupIndex + 1;

      while (nextGroupIndex < storyGroups.length) {
        const nextGroup = storyGroups[nextGroupIndex];
        if (nextGroup?.stories?.length > 0) {
          console.log(`📱 Moving to next user group: ${nextGroup.creator.username} (index ${nextGroupIndex})`);
          debugStoryGroups(storyGroups, nextGroupIndex, 'Navigation: Next Group');
          
          const isOwner =
            nextGroup.creator?._id === user?._id ||
            nextGroup.creator?.handleName === user?.handleName ||
            nextGroup.creator?.username === user?.handleName;

          navigation.replace(isOwner ? 'SeenStoryOwner' : 'SeenStory', {
            storyGroups,
            storyGroupIndex: nextGroupIndex,
            creator: nextGroup.creator,
            stories: nextGroup.stories,
            initialIndex: 0,
            timestamp: Date.now(),
          });

          return;
        }
        nextGroupIndex++;
      }

      console.log('📱 No more story groups, going back');
      navigation.goBack();
    }
  };

  useEffect(() => {
    return () => {
      isNavigatingRef.current = false;
    };
  }, []);
  // hàm lùi story
  const goToPreviousStory = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    console.log(`🔍 DEBUG goToPreviousStory - currentIndex: ${currentIndex}, stories.length: ${stories.length}`);
    
    // ✅ Nếu không phải story đầu tiên (index > 0), quay về story trước đó trong cùng group
    if (currentIndexRef.current > 0) {
      console.log(`📱 Previous story within same user: ${currentIndexRef.current - 1}/${stories.length - 1}`);
      
      // Reset states trước khi chuyển
      setVideoDuration(null);
      setMusicDuration(null);
      setIsVideoPaused(false);
      
      setCurrentIndex(prev => {
        console.log(`📍 goToPreviousStory: updating currentIndex from ${prev} to ${prev - 1}`);
        return prev - 1;
      });

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 300);
      return;
    }
    
    // ✅ Nếu đang ở story đầu tiên (index 0), tìm previous group
    console.log(`📱 At first story of current group (index 0), looking for previous group...`);
    
    let prevGroupIndex = storyGroupIndex - 1;
    
    // ✅ Tìm previous group có stories
    while (prevGroupIndex >= 0) {
      const prevGroup = storyGroups[prevGroupIndex];
      
      if (prevGroup?.stories?.length > 0) {
        console.log(`📱 Moving to previous user group: ${prevGroup.creator.username} (index ${prevGroupIndex})`);
        debugStoryGroups(storyGroups, prevGroupIndex, 'Navigation: Previous Group');
        
        const isOwner =
          prevGroup.creator?._id === user?._id ||
          prevGroup.creator?.handleName === user?.handleName ||
          prevGroup.creator?.username === user?.handleName;

        navigation.replace(isOwner ? 'SeenStoryOwner' : 'SeenStory', {
          storyGroups,
          storyGroupIndex: prevGroupIndex,
          creator: prevGroup.creator,
          stories: prevGroup.stories,
          initialIndex: (prevGroup.stories.length || 1) - 1, // Start from last story
          timestamp: Date.now(),
        });
        
        return;
      }
      
      prevGroupIndex--;
    }
    
    // ✅ Không còn previous group nào có stories
    console.log('📱 No previous story groups with stories, going back');
    navigation.goBack();
  };
  // hàm thanh ProgressBar chạy
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
  // pause story
  const toggleVideoPause = () => {
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
  // mute story
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  const debouncedHandleTouch = useRef(
    debounce((locationX: number | null) => {
      console.log(`🔍 Touch handler - locationX: ${locationX}, screenWidth: ${screenWidth}`);
      
      if (locationX == null) {
        console.log('🔍 Touch - null location, toggling pause');
        toggleVideoPause();
        return;
      }

      const leftThird = screenWidth / 3;
      const rightThird = (screenWidth * 2) / 3;
      
      if (locationX < leftThird) {
        console.log(`🔍 Touch - left third (${locationX} < ${leftThird}), calling goToPreviousStory`);
        goToPreviousStory();
      } else if (locationX > rightThird) {
        console.log(`🔍 Touch - right third (${locationX} > ${rightThird}), calling goToNextStory`);
        goToNextStory();
      } else {
        console.log(`🔍 Touch - middle (${leftThird} <= ${locationX} <= ${rightThird}), toggling pause`);
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
    setIsVideoLoaded(true);
  };

  const onMusicLoad = (data: any) => {
    setMusicDuration(data.duration);
    setIsMusicLoaded(true);
  };

  useEffect(() => {
    if (selectedItem?.mediaUrl?.endsWith('.m3u8')) {
      if (isVideoLoaded && (!selectedItem.music?.link || isMusicLoaded)) {
        setIsMediaLoading(false);
        startProgressAnimation();
      }
    } else if (selectedItem?.music?.link) {
      if (isMusicLoaded) {
        setIsMediaLoading(false);
        startProgressAnimation();
      }
    } else {
      setIsMediaLoading(false);
      startProgressAnimation();
    }
  }, [isVideoLoaded, isMusicLoaded, selectedItem]);

  const onVideoEnd = () => {
    goToNextStory();
  };

  const onMusicEnd = () => {
    goToNextStory();
  };

  useEffect(() => {
    console.log(`🔍 useEffect triggered - currentIndex: ${currentIndex}, stories.length: ${stories.length}`);
    console.log(`🔍 stories[currentIndex] exists: ${!!stories[currentIndex]}`);
    
    setIsVideoLoaded(false);
    setIsMusicLoaded(false);
    setIsMediaLoading(true);
    setVideoDuration(null);
    setMusicDuration(null);
    setIsVideoPaused(false);

    // ✅ Kiểm tra kỹ hơn trước khi goBack
    if (!stories || stories.length === 0) {
      console.log('❌ No stories array available, going back');
      navigation.goBack();
      return;
    }
    
    if (currentIndex < 0 || currentIndex >= stories.length) {
      console.log(`❌ currentIndex ${currentIndex} out of bounds (0-${stories.length - 1}), going back`);
      navigation.goBack();
      return;
    }
    
    if (!stories[currentIndex]) {
      console.log(`❌ Story at index ${currentIndex} is null/undefined, going back`);
      navigation.goBack();
      return;
    }
    progressAnims.forEach((anim: Animated.Value, index: number) => {
      if (index < currentIndex) anim.setValue(1);
      else if (index > currentIndex) anim.setValue(0);
      else anim.setValue(0);
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
          createdAt={selectedItem?.createdAt}
          creator={creator}
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
            isVideoLoaded={isVideoLoaded}
            isMediaLoading={isMediaLoading}
          />
        ) : null}
        {renderCaption()}
        {renderTags()}
        {renderMusicInfo()}
      </View>

      {isCurrentUserStory && (
        <SeenStoryOwnerBottom
          onShowPeopleSeen={() => setVisible(true)}
          onShowMore={() => setVisibleSeeMore(true)}
          visible={visible}
          users={selectedItem?.viewedByUsers || []}
          onClose={() => setVisible(false)}
          onDelete={handleDeleteStory}
        />
      )}

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
