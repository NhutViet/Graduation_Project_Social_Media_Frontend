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
  toggleLikeStory,
  deleteStory,
} from '../../../services/StoryRedux/StorySlice';
import {styles} from './components/styles';
import {Header} from './components/Header';
import {ProgressBar} from './components/ProgressBar';
import {MediaPlayer} from './components/MediaPlayer';
import {Footer} from './components/Footer';
import {Keyboard} from 'react-native';
import ModalShareStory, {ModalShareHandle} from './components/modalShare';
import ModalReplyStory, {ModalReplyHandle} from './components/ModalReplyStory';
import StoryLoadingSkeleton from '../../(tabs)/Home/components/StoryLoadingSkeleton';
import {debugStoryGroups} from '../../(tabs)/Home/util';
import {renderTextWithMentions} from '../../util/storyTextRenderer';
import {Story} from '@services/StoryRedux/StoryType';
import {VideoRef} from 'react-native-video';
import {GestureResponderEvent} from 'react-native-modal';
import LoadingModal from '../../../components/Global/LoadingModal';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import debounce from 'lodash/debounce';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

// Import owner-specific components
import ModelPeopleSeen from './componentStoryOwner/ModelPeopleSeen';
import SeenStoryOwnerBottom from './componentStoryOwner/BottomBar';
import ModalSeeMore from './componentStoryOwner/ModelSeeMore';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// ✅ Simple Loading Component as fallback
const SimpleLoading = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <LoadingModal />
    <Text
      style={{
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
  const replyModalRef = useRef<ModalReplyHandle>(null);
  const yourUserId = useSelector((state: RootState) => state.user.user?._id);

  // ✅ Get story details from Redux store
  const {storyDetails} = useSelector((state: RootState) => state.stories);

  // ✅ Owner-specific states
  const [visible, setVisible] = useState(false);
  const [visibleSeeMore, setVisibleSeeMore] = useState(false);
  const [isNavigatedAway, setIsNavigatedAway] = useState(false);
  const [wasPausedByUser, setWasPausedByUser] = useState(false);
  const progressValues = useRef<number[]>(stories.map(() => 0)).current;
  const isNavigatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  // ✅ Check if current user is the story owner
  const isCurrentUserStory =
    currentCreator?.username === user?.handleName ||
    currentCreator?._id === user?._id;

  // ✅ Sync stories with Redux store data
  const syncedStories = useMemo(() => {
    return stories.map((story: Story) => {
      // Find updated story data from Redux store
      const updatedStory = storyDetails.find(s => s._id === story._id);
      if (updatedStory) {
        // Merge with existing story data, prioritizing Redux data for like status
        return {
          ...story,
          likedByUsers: updatedStory.likedByUsers || story.likedByUsers || [],
          viewedByUsers:
            updatedStory.viewedByUsers || story.viewedByUsers || [],
          // Keep other properties from original story
        };
      }
      return story;
    });
  }, [stories, storyDetails]);

  // ✅ Listen for parameter updates and navigation focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = route.params;
      if (params) {
        setStories(params.stories || []);
        setCurrentStoryGroups(params.storyGroups || []);
        setCurrentCreator(params.creator || {});
        setIsDataLoading(params.isLoading || false);
      }

      // ✅ Reset navigated away state khi quay lại
      setIsNavigatedAway(false);

      // ✅ Resume story khi quay lại từ profile
      if (isPaused) {
        setIsPaused(false);
      }
    });

    // ✅ Listen for blur event (khi navigate away)
    const blurUnsubscribe = navigation.addListener('blur', () => {
      // ✅ Set navigated away state
      setIsNavigatedAway(true);

      // Pause story khi navigate away
      if (!isPaused) {
        setIsPaused(true);
      }
    });

    return () => {
      unsubscribe();
      blurUnsubscribe();
    };
  }, [navigation, route.params, isPaused]);

  // ✅ Reset video và music khi navigate away và quay lại (owner mode)
  useEffect(() => {
    if (isCurrentUserStory && isNavigatedAway) {
      // Khi navigate away, pause cả video và music
      setIsPaused(true);
    } else if (isCurrentUserStory && !isNavigatedAway) {
      // Khi quay lại, resume nếu trước đó không bị pause bởi user
      if (!wasPausedByUser) {
        setIsPaused(false);
      }
    }
  }, [isNavigatedAway, wasPausedByUser, isCurrentUserStory]);

  // ✅ Update progress anims when stories change
  useEffect(() => {
    if (stories.length !== progressAnims.length) {
      progressAnims.splice(0, progressAnims.length);
      progressAnims.push(...stories.map(() => new Animated.Value(0)));
      if (isCurrentUserStory) {
        progressValues.splice(0, progressValues.length);
        progressValues.push(...stories.map(() => 0));
      }
    }
  }, [stories.length, isCurrentUserStory]);

  const selectedItem = useMemo(
    () => syncedStories[currentIndex] || {},
    [syncedStories, currentIndex],
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
  const videoRef = useRef<VideoRef>(null);

  // ✅ Owner-specific: Delete story functionality
  const handleDeleteStory = async () => {
    try {
      const currentStory = syncedStories[currentIndex];
      if (!currentStory?._id) return;

      // ✅ Tắt modal ngay lập tức
      setVisibleSeeMore(false);

      // Xóa story từ server (Redux store sẽ tự động cập nhật)
      await dispatch(deleteStory({storyId: currentStory._id})).unwrap();

      GlobalAlertManager.show('Thành công', 'Tin của bạn đã được xoá');

      // ✅ Cập nhật state local ngay lập tức để UI responsive
      const updatedStories = syncedStories.filter(
        (_: any, index: number) => index !== currentIndex,
      );

      if (updatedStories.length === 0) {
        // Không còn story nào, quay lại
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        // ✅ Cập nhật local state để không bị lag UI
        const updatedStoryGroups = [...currentStoryGroups];
        updatedStoryGroups[storyGroupIndex] = {
          ...currentStoryGroups[storyGroupIndex],
          stories: updatedStories,
        };
        setCurrentStoryGroups(updatedStoryGroups);
        setStories(updatedStories);

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

  // ✅ Owner-specific: Progress animation with tracking
  const startProgressAnimation = (forceRestart = false) => {
    if (isCurrentUserStory) {
      // Owner mode: Use tracking progress
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
    } else {
      // Viewer mode: Use simple animation
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
    }
  };

  const stopCurrentAnimation = () => {
    animationRef.current?.stop();
    animationRef.current = null;
  };

  // ✅ Owner-specific: Enhanced navigation with tracking
  const goToNextStory = () => {
    if (isCurrentUserStory && isNavigatingRef.current) return;
    if (isCurrentUserStory) {
      isNavigatingRef.current = true;
    }

    stopCurrentAnimation();

    if (currentIndex < syncedStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (isCurrentUserStory) {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 300);
      }
    } else {
      const nextGroupIndex = storyGroupIndex + 1;

      if (nextGroupIndex < currentStoryGroups.length) {
        const nextGroup = currentStoryGroups[nextGroupIndex];

        debugStoryGroups(
          currentStoryGroups,
          nextGroupIndex,
          'Navigation: Next Group',
        );

        // ✅ Check if next group belongs to current user
        const isOwner =
          nextGroup.creator?.username === user?.handleName ||
          nextGroup.creator?._id === user?._id;
        const routeName = isOwner ? 'SeenStory' : 'SeenStory'; // Use unified component

        // ✅ Use synced stories data for navigation
        const syncedNextGroupStories = nextGroup.stories.map((story: Story) => {
          const updatedStory = storyDetails.find(s => s._id === story._id);
          if (updatedStory) {
            return {
              ...story,
              likedByUsers:
                updatedStory.likedByUsers || story.likedByUsers || [],
              viewedByUsers:
                updatedStory.viewedByUsers || story.viewedByUsers || [],
            };
          }
          return story;
        });

        navigation.replace(routeName, {
          storyGroups: currentStoryGroups,
          storyGroupIndex: nextGroupIndex,
          creator: nextGroup.creator,
          stories: syncedNextGroupStories,
          initialIndex: 0,
          timestamp: Date.now(),
        });
      } else {
        navigation.goBack();
      }
    }
  };

  // ✅ Owner-specific: Enhanced previous navigation
  const goToPreviousStory = () => {
    if (isCurrentUserStory && isNavigatingRef.current) return;
    if (isCurrentUserStory) {
      isNavigatingRef.current = true;
    }

    stopCurrentAnimation();

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (isCurrentUserStory) {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 300);
      }
    } else {
      let prevGroupIndex = storyGroupIndex - 1;

      // ✅ Tìm previous group có stories
      while (prevGroupIndex >= 0) {
        const prevGroup = currentStoryGroups[prevGroupIndex];

        if (prevGroup?.stories?.length > 0) {
          debugStoryGroups(
            currentStoryGroups,
            prevGroupIndex,
            'Navigation: Previous Group',
          );

          // ✅ Check ownership properly
          const isOwner =
            prevGroup.creator?.username === user?.handleName ||
            prevGroup.creator?._id === user?._id;
          const routeName = isOwner ? 'SeenStory' : 'SeenStory'; // Use unified component

          // ✅ Use synced stories data for navigation
          const syncedPrevGroupStories = prevGroup.stories.map(
            (story: Story) => {
              const updatedStory = storyDetails.find(s => s._id === story._id);
              if (updatedStory) {
                return {
                  ...story,
                  likedByUsers:
                    updatedStory.likedByUsers || story.likedByUsers || [],
                  viewedByUsers:
                    updatedStory.viewedByUsers || story.viewedByUsers || [],
                };
              }
              return story;
            },
          );

          navigation.replace(routeName, {
            storyGroups: currentStoryGroups,
            storyGroupIndex: prevGroupIndex,
            creator: prevGroup.creator,
            stories: syncedPrevGroupStories,
            initialIndex: (prevGroup.stories.length || 1) - 1,
            timestamp: Date.now(),
          });

          return;
        }

        prevGroupIndex--;
      }

      navigation.goBack();
    }
  };

  // ✅ Owner-specific: Enhanced pause toggle
  const togglePause = () => {
    if (isCurrentUserStory) {
      setIsPaused(prev => {
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
    } else {
      setIsPaused(prev => !prev);
    }
  };

  // mute
  const toggleMute = () => setIsMuted(prev => !prev);

  const handleTouch = (event: GestureResponderEvent) => {
    const {locationX} = event.nativeEvent;
    if (locationX < screenWidth / 3) goToPreviousStory();
    else if (locationX > (screenWidth * 2) / 3) goToNextStory();
  };

  // ✅ Viewer-specific: Like functionality
  const handleLike = async () => {
    if (isCurrentUserStory) return; // Owner can't like their own story

    try {
      await dispatch(toggleLikeStory({storyId: selectedItem._id})).unwrap();

      // ✅ Update local state immediately for better UX
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

  // ✅ Update like status from synced story data
  useEffect(() => {
    const liked = selectedItem?.likedByUsers?.includes(user?._id);
    setIsLiked(liked || false);
  }, [selectedItem?.likedByUsers, user?._id]);

  const onImageLoad = () => {
    setIsMediaLoading(false);
    startProgressAnimation();
  };

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

    // ✅ Reset video ref để đảm bảo video mới được load
    if (videoRef.current) {
      videoRef.current.seek(0);
    }

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

  // ✅ Viewer-specific: Share functionality
  const handleOpenShare = () => {
    if (isCurrentUserStory) return; // Owner doesn't have share

    stopCurrentAnimation();
    shareModalRef.current?.open(); // phải dùng ref để mở Modal
  };

  // ✅ Viewer-specific: Reply functionality
  const handleOpenReply = () => {
    if (isCurrentUserStory) return; // Owner can't reply to their own story

    stopCurrentAnimation();
    replyModalRef.current?.open(); // phải dùng ref để mở Modal
  };

  // ✅ Owner-specific: Modal handlers
  useEffect(() => {
    if (visible) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [visible]);

  // ✅ Owner-specific: Cleanup
  useEffect(() => {
    return () => {
      if (isCurrentUserStory) {
        isNavigatingRef.current = false;
      }
    };
  }, [isCurrentUserStory]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.mediaWrapper}
        activeOpacity={1}
        onPress={handleTouch}>
        {/* Unified Header for both owner and viewer */}
        <Header
          onClose={() => navigation.goBack()}
          username={currentCreator?.username}
          profilePic={currentCreator?.profilePic}
          pause={isPaused}
          onTogglePause={togglePause}
          mute={isMuted}
          onToggleMute={toggleMute}
          createdAt={selectedItem?.createdAt}
          navigation={navigation}
          creatorId={currentCreator?._id}
          yourUserId={yourUserId}
          isOwner={isCurrentUserStory}
        />

        <ProgressBar
          progressAnims={progressAnims}
          storyCount={syncedStories.length}
        />
        <MediaPlayer
          key={`${selectedItem?._id}-${currentIndex}`} // ✅ Force re-render khi chuyển story
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
          onImageLoad={onImageLoad}
          forceReset={true} // ✅ Force reset sound khi chuyển story
        />
        {renderCaption()}
        {/* {renderTags()} */}
      </TouchableOpacity>

      {/* Conditional Footer based on ownership */}
      {isCurrentUserStory ? (
        <SeenStoryOwnerBottom
          onShowPeopleSeen={() => {
            setVisible(true);
            // ✅ Pause story khi mở modal People Seen
            if (!isPaused) {
              setIsPaused(true);
              setWasPausedByUser(true);
            }
          }}
          onShowMore={() => {
            setVisibleSeeMore(true);
            // ✅ Pause story khi mở modal SeeMore
            if (!isPaused) {
              setIsPaused(true);
              setWasPausedByUser(true);
            }
          }}
          visible={visible}
          users={selectedItem?.viewedByUsers || []}
          onClose={() => setVisible(false)}
          onDelete={handleDeleteStory}
        />
      ) : (
        <Footer
          onLike={handleLike}
          isLiked={isLiked}
          scaleAnim={scaleAnim}
          onPressSend={handleOpenShare}
          onPressReply={handleOpenReply}
        />
      )}

      {/* Conditional Modals based on ownership */}
      {!isCurrentUserStory && (
        <>
          <ModalShareStory
            ref={shareModalRef}
            storyData={{
              _id: selectedItem?._id,
              mediaUrl: selectedItem?.mediaUrl,
              type: selectedItem?.uriVideo ? 'video' : 'image',
            }}
            onOpen={() => {
              setIsPaused(true); // dừng story
              stopCurrentAnimation(); // đảm bảo animation ngừng
            }}
            onClose={() => {
              setIsPaused(false); // tiếp tục
              startProgressAnimation(); // gọi lại animation!
            }}
          />
          <ModalReplyStory
            ref={replyModalRef}
            storyData={{
              _id: selectedItem?._id,
              mediaUrl: selectedItem?.mediaUrl,
              type: selectedItem?.uriVideo ? 'video' : 'image',
            }}
            creatorId={currentCreator?._id}
            onOpen={() => {
              setIsPaused(true); // dừng story
              stopCurrentAnimation(); // đảm bảo animation ngừng
            }}
            onClose={() => {
              setIsPaused(false); // tiếp tục
              startProgressAnimation(); // gọi lại animation!
            }}
          />
        </>
      )}

      {/* Owner-specific modals */}
      {isCurrentUserStory && (
        <Portal>
          <ModelPeopleSeen
            visible={visible}
            onClose={() => {
              setVisible(false);
              // ✅ Resume story khi đóng modal People Seen (nếu không phải do user pause)
              if (wasPausedByUser && !isNavigatedAway) {
                setIsPaused(false);
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
                setIsPaused(false);
                setWasPausedByUser(false);
              }
            }}
            onDelete={handleDeleteStory}
          />
        </Portal>
      )}
    </SafeAreaView>
  );
};
