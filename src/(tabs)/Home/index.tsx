import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {SafeAreaView, View, ActivityIndicator, ScrollView} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchPostsWithMedia} from '../../../services/postRedux/postSlice';
import {fetchFollowingStories} from '../../../services/StoryRedux/StorySlice';
import Header from '../../../components/Header';
import Story from './components/Story';
import ItemHome from './components/ItemHome';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from './components/CommentSection';
import {handleUserPress} from './util';
import {
  checkStorySeenInStorage,
  clearExpiredSeenStories,
} from '../../../services/storage/storage';

const HEADER_HEIGHT = 100;
const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

export const Home = forwardRef(({onReload}: any, ref) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const storyDetails = useSelector(
    (state: RootState) => state.stories.storyDetails,
  );
  const sheetRef = useRef<BottomSheetCommentRef>(null);
  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<{postId: string, receiverId: string}>({postId: '', receiverId: ''});
  const [seenMap, setSeenMap] = useState<Record<string, boolean>>({});
  
  // Add loading state for pagination
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasCalledLoadMore, setHasCalledLoadMore] = useState(false);
  
  const {posts, loading, page, hasNextPage} = useSelector((state: RootState) => state?.post);
  const followingUsers = useSelector(
    (state: RootState) => state.stories.followingUsers,
  );
  const user = useSelector((state: RootState) => state.user.user);

  const reloadAllData = useCallback(() => {
    dispatch(fetchPostsWithMedia({page: 1}));
    dispatch(fetchFollowingStories({page: 1}));
    clearExpiredSeenStories();
    setHasCalledLoadMore(false);
  }, [dispatch]);

  useImperativeHandle(ref, () => ({ reload: reloadAllData }));

  useEffect(reloadAllData, [reloadAllData]);

  // Improved load more function with better state management
  const loadMore = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingMore || !hasNextPage || hasCalledLoadMore) {
      return;
    }

    setIsLoadingMore(true);
    setHasCalledLoadMore(true);
    
    try {
      await dispatch(fetchPostsWithMedia({ page: page + 1 })).unwrap();
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
      // Reset the flag after a delay to allow next load
      setTimeout(() => setHasCalledLoadMore(false), 1000);
    }
  }, [dispatch, isLoadingMore, hasNextPage, page, hasCalledLoadMore]);

  // Prefetch next page when user is halfway through current posts
  const prefetchNextPage = useCallback(() => {
    if (!isLoadingMore && hasNextPage && !hasCalledLoadMore) {
      loadMore();
    }
  }, [loadMore, isLoadingMore, hasNextPage, hasCalledLoadMore]);

  useEffect(() => {
    const syncSeenStories = async () => {
      const map: Record<string, boolean> = {};
      for (const user of followingUsers) {
        for (const storyId of user.stories) {
          const story = storyDetails.find(s => s._id === storyId);
          const createdAt = story?.createdAt;
          if (!createdAt) continue;
          const seen = await checkStorySeenInStorage(storyId, createdAt);
          map[storyId] = seen;
        }
      }
      setSeenMap(map);
    };
    if (followingUsers.length && storyDetails.length) {
      syncSeenStories();
    }
  }, [followingUsers, storyDetails]);

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    const id = viewableItems[0]?.item?._id;
    if (id && id !== currentVisible) {
      setCurrentVisible(id);
    }
    
    // Prefetch when user views posts in the last 30% of loaded content
    if (viewableItems.length > 0 && posts.length > 0) {
      const currentIndex = posts.findIndex(post => post._id === id);
      const triggerPoint = Math.floor(posts.length * 0.7); 
      
      if (currentIndex >= triggerPoint) {
        prefetchNextPage();
      }
    }
  }).current;

  const prevScrollY = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);
  const scrolledUpDistance = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const delta = currentY - prevScrollY.value;

      if (currentY <= 0) {
        headerTranslateY.value = withTiming(0, {duration: 200});
        scrolledUpDistance.value = 0;
      } else if (delta > 0) {
        headerTranslateY.value = withTiming(-HEADER_HEIGHT, {duration: 200});
        scrolledUpDistance.value = 0;
      } else {
        scrolledUpDistance.value = Math.min(
          scrolledUpDistance.value - delta,
          1000,
        );
        if (scrolledUpDistance.value >= 20) {
          headerTranslateY.value = withTiming(0, {duration: 200});
        }
      }

      prevScrollY.value = currentY;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    transform: [{translateY: headerTranslateY.value}],
  }));

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      const shouldPlay = item._id === currentVisible;
      return (
        <ItemHome
          _id={item._id}
          type={item.type}
          caption={item.caption}
          createdAt={item.createdAt}
          media={item.media}
          user={item.user}
          isLike={item.isLike}
          isBookmarked={item.isBookmarked}
          commentCount={item.commentCount}
          likeCount={item.likeCount}
          share={item.share}
          music={item.music}
          currentVisible={shouldPlay}
          isFocused={isFocused}
          sheetRef={sheetRef}
          isFollow={item.isFollow}
          setSelectedPostId={setSelectedPostId}
        />
      );
    },
    [currentVisible, isFocused],
  );

  // Render footer with loading indicator
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={{
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: color.background,
      }}>
        <ActivityIndicator size="small" color={color.text} />
      </View>
    );
  }, [isLoadingMore, color]);

  if (loading && posts.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.background,
        }}>
        <ActivityIndicator size="large" color={color.text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <Animated.View
        style={[
          {position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10},
          animatedHeaderStyle,
        ]}>
        <Header
          icon={require('../../../assets/icon/logo_row.png')}
          iconQR={require('../../../assets/icon/qr.png')}
          iconNotify={require('../../../assets/icon/heart.png')}
          iconMessage={require('../../../assets/icon/message.png')}
          navigation={navigation}
        />
      </Animated.View>
      <AnimatedFlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        removeClippedSubviews={true}
        initialNumToRender={20} 
        maxToRenderPerBatch={3} 
        windowSize={5} 
        updateCellsBatchingPeriod={50} 
        onViewableItemsChanged={onViewRef}
        viewabilityConfig={{itemVisiblePercentThreshold: 70}}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        getItemLayout={undefined} 
        ListHeaderComponent={
          <View style={{position: 'relative', height: 160}}>
            <View style={{paddingTop: 48}}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 10}}>
                {[
                  // 1. Đưa "Tin của tôi" lên đầu
                  ...followingUsers.filter(
                    item =>
                      item._id === user?._id ||
                      item.handleName === user?.handleName,
                  ),
                  // 2. Sắp xếp những người còn lại: có story lên trước
                  ...followingUsers
                    .filter(
                      item =>
                        item._id !== user?._id &&
                        item.handleName !== user?.handleName,
                    )
                    .sort(
                      (a, b) =>
                        (b.stories?.length > 0 ? 1 : 0) -
                        (a.stories?.length > 0 ? 1 : 0),
                    ),
                ].map(item => {
                  const isCurrentUser =
                    item._id === user?._id ||
                    item.handleName === user?.handleName;

                  const story = storyDetails.find(
                    s => s._id === item.stories?.[0],
                  );

                  let isSeen = false;
                  if (story) {
                    isSeen =
                      story.isSeen === true || seenMap[story._id] === true;
                  }

                  const hasStory = item.stories?.length > 0;

                  return (
                    <Story
                      key={item._id}
                      name={isCurrentUser ? 'Tin của tôi' : item.handleName}
                      image={item?.profilePic}
                      status={hasStory ? 1 : 0}
                      hasStory={hasStory}
                      isSeen={isSeen}
                      isCurrentUser={isCurrentUser}
                      func={() => {
                        if (hasStory) {
                          handleUserPress(
                            item,
                            dispatch,
                            navigation,
                            storyDetails,
                            user,
                            followingUsers,
                          );
                        } else {
                          const isCurrentUser =
                            item._id === user?._id ||
                            item.handleName === user?.handleName;

                          if (isCurrentUser) {
                            navigation.navigate('UpStory');
                          } else {
                            navigation.navigate('ProfileComp', {
                              userID: item._id,
                              handlename: item.handleName,
                            });
                          }
                        }
                      }}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </View>
        }
      />
      <BottomSheetComment ref={sheetRef} postId={selectedPostId.postId} receiverId={selectedPostId.receiverId}/>
    </SafeAreaView>
  );
});

export default Home;