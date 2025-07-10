import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  View,
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
import {MediaSection} from './component/MediaSection';
import {styles} from './component/style';
import debounce from 'lodash/debounce';
import {deleteStory} from '@services/StoryRedux/StorySlice';
import SeenStoryOwnerHeader from './component/Header';
import SeenStoryOwnerBottom from './component/BottomBar';
import ModalSeeMore from './component/ModelSeeMore';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import StoryLoadingSkeleton from '../../(tabs)/Home/components/StoryLoadingSkeleton';
import {debugStoryGroups} from '../../(tabs)/Home/util';
import {renderTextWithMentions} from '../../util/storyTextRenderer';
import {VideoRef} from 'react-native-video';

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

  // ✅ Get following users for user lookup
  const {followingUsers} = useSelector((state: RootState) => state.stories);

  // ✅ State để handle loading và update params
  const [storyGroups, setStoryGroups] = useState(initialStoryGroups);
  const [storyGroupIndex, setStoryGroupIndex] = useState(
    initialStoryGroupIndex,
  );
  const [isDataLoading, setIsDataLoading] = useState(isLoading);

  const currentGroup = storyGroups[storyGroupIndex];
  const stories = currentGroup?.stories || [];
  const creator = currentGroup?.creator || {};

  const user = useSelector((state: RootState) => state.user.user);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [wasPausedByUser, setWasPausedByUser] = useState(false);
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
  // ✅ Thêm state để track khi navigate away
  const [isNavigatedAway, setIsNavigatedAway] = useState(false);
  const progressAnims = useRef<Animated.Value[]>(
    (stories || []).map(() => new Animated.Value(0)),
  ).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const videoRef = useRef<VideoRef>(null);
  const viewModalRef = useRef<Modalize>(null);
  const addModalRef = useRef<Modalize>(null);
  const isNavigatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const imageDuration = 15000;
  const isCurrentUserStory = creator?.username === user?.handleName;
  const yourUserId = useSelector((state: RootState) => state.user.user?._id);

  // ✅ Listen for parameter updates and navigation focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = route.params;
      if (params) {
        setStoryGroups(params.storyGroups || []);
        setStoryGroupIndex(params.storyGroupIndex || 0);
        setIsDataLoading(params.isLoading || false);
      }

      // ✅ Reset navigated away state khi quay lại
      setIsNavigatedAway(false);

      // ✅ Resume story khi quay lại từ profile
      if (isVideoPaused) {
        setIsVideoPaused(false);
      }
    });

    // ✅ Listen for blur event (khi navigate away)
    const blurUnsubscribe = navigation.addListener('blur', () => {
      // ✅ Set navigated away state
      setIsNavigatedAway(true);

      // Pause story khi navigate away
      if (!isVideoPaused) {
        setIsVideoPaused(true);
      }
    });

    return () => {
      unsubscribe();
      blurUnsubscribe();
    };
  }, [navigation, route.params, isVideoPaused]);

  // ✅ Reset video và music khi navigate away và quay lại
  useEffect(() => {
    if (isNavigatedAway) {
      // Khi navigate away, pause cả video và music
      setIsVideoPaused(true);
    } else {
      // Khi quay lại, resume nếu trước đó không bị pause bởi user
      if (!wasPausedByUser) {
        setIsVideoPaused(false);
      }
    }
  }, [isNavigatedAway, wasPausedByUser]);

  // ✅ Update progress anims when stories change
  useEffect(() => {
    if (stories.length !== progressAnims.length) {
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
      const updatedStories = stories.filter(
        (_: any, index: number) => index !== currentIndex,
      );

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
          stories: updatedStories,
        };
        setStoryGroups(updatedStoryGroups);

        // Điều chỉnh currentIndex nếu cần
        const newIndex =
          currentIndex >= updatedStories.length
            ? updatedStories.length - 1
            : currentIndex;
        setCurrentIndex(newIndex);
      }
    } catch (error) {
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
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    const maxIndex = stories.length - 1;

    if (currentIndexRef.current < maxIndex) {
      setVideoDuration(null);
      setIsVideoPaused(false);
      setMusicDuration(null);
      setWasPausedByUser(false);
      setCurrentIndex(prev => {
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
          debugStoryGroups(
            storyGroups,
            nextGroupIndex,
            'Navigation: Next Group',
          );

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

    // ✅ Nếu không phải story đầu tiên (index > 0), quay về story trước đó trong cùng group
    if (currentIndexRef.current > 0) {
      // Reset states trước khi chuyển
      setVideoDuration(null);
      setMusicDuration(null);
      setIsVideoPaused(false);
      setWasPausedByUser(false);

      setCurrentIndex(prev => {
        return prev - 1;
      });

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 300);
      return;
    }

    let prevGroupIndex = storyGroupIndex - 1;

    // Tìm previous group có stories
    while (prevGroupIndex >= 0) {
      const prevGroup = storyGroups[prevGroupIndex];

      if (prevGroup?.stories?.length > 0) {
        debugStoryGroups(
          storyGroups,
          prevGroupIndex,
          'Navigation: Previous Group',
        );

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
      // ✅ Track khi user pause/resume
      setWasPausedByUser(newState);

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
      if (locationX == null) {
        toggleVideoPause();
        return;
      }

      const leftThird = screenWidth / 3;
      const rightThird = (screenWidth * 2) / 3;

      if (locationX < leftThird) {
        goToPreviousStory();
      } else if (locationX > rightThird) {
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

  const onVideoLoad = (data: {duration: number}) => {
    setVideoDuration(data.duration);
    setIsVideoLoaded(true);
  };

  const onMusicLoad = (data: {duration: number}) => {
    setMusicDuration(data.duration);
    setIsMusicLoaded(true);
  };

  const onImageLoad = () => {
    setIsMediaLoading(false);
    startProgressAnimation();
  };

  useEffect(() => {
    const currentStory = selectedItem;
    const isVideo = currentStory?.mediaUrl?.endsWith('.m3u8');
    const hasMusic = !!currentStory?.music?.link;

    // Trường hợp 1: Chỉ có ảnh (không có video, không có music)
    if (!isVideo && !hasMusic) {
      // KHÔNG setIsMediaLoading(false) ở đây nữa, để onImageLoad xử lý
      return;
    }

    // Trường hợp 2: Có video (có thể có hoặc không có music)
    if (isVideo) {
      if (isVideoLoaded && (!hasMusic || isMusicLoaded)) {
        setIsMediaLoading(false);
        if (!isVideoPaused) startProgressAnimation();
      }
      return;
    }

    // Trường hợp 3: Chỉ có music (không có video)
    if (hasMusic && !isVideo) {
      if (isMusicLoaded) {
        setIsMediaLoading(false);
        if (!isVideoPaused) startProgressAnimation();
      }
      return;
    }
  }, [isVideoLoaded, isMusicLoaded, selectedItem, isVideoPaused]);

  const onVideoEnd = () => {
    goToNextStory();
  };

  const onMusicEnd = () => {
    goToNextStory();
  };

  useEffect(() => {
    setIsVideoLoaded(false);
    setIsMusicLoaded(false);
    setIsMediaLoading(true);
    setVideoDuration(null);
    setMusicDuration(null);
    setIsVideoPaused(false);
    // ✅ Reset user pause state khi chuyển story mới
    setWasPausedByUser(false);

    // ✅ Kiểm tra kỹ hơn trước khi goBack
    if (!stories || stories.length === 0) {
      navigation.goBack();
      return;
    }

    if (currentIndex < 0 || currentIndex >= stories.length) {
      navigation.goBack();
      return;
    }

    if (!stories[currentIndex]) {
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

  useEffect(() => {
    if (visible) {
      setIsVideoPaused(true);
    } else {
      setIsVideoPaused(false);
    }
  }, [visible]);

  useEffect(() => {
    if (isVideoPaused) {
      animationRef.current?.stop();
    } else {
      startProgressAnimation();
    }
  }, [isVideoPaused]);
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
    const tags = selectedItem?.tags;

    // Combine content text và mentions từ tags
    const fullText = content?.text || '';

    // ✅ Adapt to backend structure: handleName is at tag level, not nested under user
    const validTags =
      tags?.filter((tag: any) => tag.user && tag.handleName) || [];

    const mentionsText =
      validTags.map((tag: any) => `@${tag.handleName}`).join(' ') || '';
    const combinedText =
      fullText && mentionsText
        ? `${fullText} ${mentionsText}`
        : fullText || mentionsText;

    if (!combinedText) {
      return null;
    }

    const position = getCaptionPosition(content?.x || 50, content?.y || 50);

    // Tạo mention data để có thể click từ valid tags only (adapt to backend structure)
    const mentionData = validTags.map((tag: any) => ({
      handleName: tag.handleName,
      _id: tag.user, // user field is the ID string
    }));

    const handleMentionPress = (userId: string) => {
      // ✅ Story sẽ tự động pause thông qua blur listener
      // ✅ Kiểm tra nếu là chính tài khoản hiện tại thì chuyển qua Account
      if (userId === yourUserId) {
        navigation.navigate('Account');
      } else {
        navigation.navigate('ProfileComp', {userID: userId});
      }
    };

    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          ...position,
        }}
        activeOpacity={1}>
        {renderTextWithMentions(
          combinedText,
          mentionData,
          handleMentionPress,
          {
            color: '#fff',
            fontSize: 18,
            fontWeight: '600',
          },
          {
            color: '#4A90E2',
            fontWeight: '700',
          },
        )}
      </TouchableOpacity>
    );
  };
  // tag
  const renderTags = () => {
    const tags = selectedItem?.tags || [];

    return tags.map((tagData: any, index: number) => {
      const {user: userId, position, handleName, username} = tagData;

      if (!userId || !position || !handleName) {
        return null;
      }

      const {x, y} = position;

      // ✅ Use data directly from tag object (backend puts user info at tag level)
      const finalUserData = {
        _id: userId, // user field is the ID
        handleName: handleName,
        username: username,
      };

      const tagPosition = getCaptionPosition(x * 100, y * 100);

      const handleTagPress = () => {
        if (finalUserData._id) {
          // ✅ Kiểm tra nếu là chính tài khoản hiện tại thì chuyển qua Account
          if (finalUserData._id === yourUserId) {
            navigation.navigate('Account');
          } else {
            navigation.navigate('ProfileComp', {
              userID: finalUserData._id,
            });
          }
        } else {
          console.log('❌ No userID found');
        }
      };

      return (
        <TouchableOpacity
          key={index}
          onPress={handleTagPress}
          activeOpacity={0.7}
          style={{
            position: 'absolute',
            left: tagPosition.left,
            top: tagPosition.top,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 15,
            zIndex: 999,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}>
          <Text style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
            @{finalUserData.handleName}
          </Text>
        </TouchableOpacity>
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
          navigation={navigation}
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
            paused={isVideoPaused || isNavigatedAway}
            muted={isMuted}
            isVideoLoaded={isVideoLoaded}
            isMediaLoading={isMediaLoading}
            onImageLoad={onImageLoad}
            isNavigatedAway={isNavigatedAway}
          />
        ) : null}
        {renderCaption()}
        {/* {renderTags()} */}
        {renderMusicInfo()}
      </View>

      {isCurrentUserStory && (
        <SeenStoryOwnerBottom
          onShowPeopleSeen={() => {
            setVisible(true);
            // ✅ Pause story khi mở modal People Seen
            if (!isVideoPaused) {
              setIsVideoPaused(true);
              setWasPausedByUser(true);
            }
          }}
          onShowMore={() => {
            setVisibleSeeMore(true);
            // ✅ Pause story khi mở modal SeeMore
            if (!isVideoPaused) {
              setIsVideoPaused(true);
              setWasPausedByUser(true);
            }
          }}
          visible={visible}
          users={selectedItem?.viewedByUsers || []}
          onClose={() => setVisible(false)}
          onDelete={handleDeleteStory}
        />
      )}

      <Portal>
        <ModelPeopleSeen
          visible={visible}
          onClose={() => {
            setVisible(false);
            // ✅ Resume story khi đóng modal People Seen (nếu không phải do user pause)
            if (wasPausedByUser && !isNavigatedAway) {
              setIsVideoPaused(false);
              setWasPausedByUser(false);
            }
          }}
          users={selectedItem?.viewedByUsers || []}
          onUserPress={user => {
            setVisible(false);
            if (user._id === yourUserId) {
              navigation.navigate('Account');
            } else {
              navigation.navigate('ProfileComp', {userID: user._id});
            }
          }}
        />
        <ModalSeeMore
          visible={visibleSeeMore}
          onClose={() => {
            setVisibleSeeMore(false);
            // ✅ Resume story khi đóng modal SeeMore (nếu không phải do user pause)
            if (wasPausedByUser && !isNavigatedAway) {
              setIsVideoPaused(false);
              setWasPausedByUser(false);
            }
          }}
          onDelete={handleDeleteStory}
        />
      </Portal>
    </SafeAreaView>
  );
};
