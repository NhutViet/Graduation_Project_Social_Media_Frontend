import React, { useCallback, useMemo, useRef } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../../../services/store';
import {
  likePost,
  unlikePost,
} from '../../../../services/reactionRedux/reactionSlice';
import { relationAction } from '@services/relationRedux/relationSlice';
import ReelsComponent from './reelsComponent';

const ReelsList = ({
  reels,
  currentVisible,
  isFocused,
  flashListRef,
  onViewRef,
  handleLoadMore,
  openBottomSheet,
  openCommentSheet,
  openShareModal,
  setSkipReload,
}: any) => {
  const { height, width } = Dimensions.get('window');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const loadingRef = useRef(false);

  const likedPostIds = useSelector((state: RootState) => state.reactions.likePosts);
  const followingUserIds = useSelector((state: RootState) => state.relation.following);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const refreshToken = useSelector((state: RootState) => state.user.refreshToken);

  // Memoized those handlers below to avoid re-render
  const handleLike = useCallback(
    (postId: string, isLiked: boolean) => {
      const action = isLiked ? unlikePost : likePost;
      dispatch(
        action({
          postId,
          refreshToken,
          receiverId: reels.find((r: any) => r._id === postId)?.user._id,
          handleName: currentUser?.handleName ?? '',
          userId: currentUser?._id,
        }),
      );
    },
    [dispatch, refreshToken, currentUser, reels],
  );

  const handleFollow = useCallback(
    (targetId: string, isFollowing: boolean) => {
      dispatch(
        relationAction({
          targetId,
          senderId: currentUser?._id,
          handleName: currentUser?.handleName,
          action: isFollowing ? 'unfollow' : 'follow',
        }),
      );
    },
    [dispatch, currentUser],
  );

  const handleProfilePress = useCallback(
    (userId: string) => {
      navigation.navigate('ProfileComp', { userID: userId });
    },
    [navigation],
  );

  const handleOpenBottomSheet = useCallback(
    (item: any) => {
      openBottomSheet(item);
    },
    [openBottomSheet],
  );

  const handleOpenCommentSheet = useCallback(
    (item: any) => {
      openCommentSheet(item);
    },
    [openCommentSheet],
  );

  // Optimized load more handler with debouncing
  const handleOptimizedLoadMore = useCallback(() => {
    if (loadingRef.current) { return; }
    loadingRef.current = true;

    handleLoadMore();

    // Reset loading flag after 500ms
    setTimeout(() => {
      loadingRef.current = false;
    }, 500);
  }, [handleLoadMore]);

  // Optimized render item w CallBack
  const renderItem = useCallback(
    ({ item }: { item: any; index: number }) => {
      const isLiked = likedPostIds.includes(item._id);
      const isFollowing = followingUserIds.includes(item.user._id);
      const isCurrentUser = currentUser?._id === item.user._id;
      const shouldPlay = item._id === currentVisible;

      let currentLikeCount = item.likeCount;
      if (item.isLike !== isLiked) {
        currentLikeCount = isLiked ? item.likeCount + 1 : item.likeCount - 1;
      }

      if (item._id !== currentVisible) {
        return <ActivityIndicator style={{ height, width, backgroundColor: 'black' }} />;
      }

      return (
        <View style={{ height: height, width: width }}>
          <ReelsComponent
            {...item}
            containerHeight={height}
            isFocused={isFocused}
            currentVisible={shouldPlay}
            isLiked={isLiked}
            isFollowing={isFollowing}
            isCurrentUser={isCurrentUser}
            likeCount={currentLikeCount}
            onLike={handleLike}
            onFollow={handleFollow}
            onProfilePress={handleProfilePress}
            onTagPress={handleProfilePress}
            onMenu={() => handleOpenBottomSheet(item)}
            onComment={() => handleOpenCommentSheet(item)}
            onShare={() => openShareModal(item)}
            setSkipReload={setSkipReload}
          />
        </View>
      );
    },
    [likedPostIds, followingUserIds, currentUser?._id, currentVisible, height, width, isFocused, handleLike, handleFollow, handleProfilePress, setSkipReload, handleOpenBottomSheet, handleOpenCommentSheet, openShareModal],
  );

  // Viewability config
  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 90,
    minimumViewTime: 100,
  }), []);

  // Performance tracking
  const onLoad = useCallback((info: { elapsedTimeInMs: number }) => {
    console.log('FlashList loaded in:', info.elapsedTimeInMs, 'ms');
    if (info.elapsedTimeInMs > 1000) {
      console.warn('FlashList took too long to load');
    }
  }, []);

  // Blank area tracking tp get what performance issues
  const onBlankArea = useCallback((info: any) => {
    if (info.blankArea > height) {
      console.warn('Blank area detected:', info);
    }
  }, [height]);

  // Error handling for onEndReached
  const onEndReached = useCallback(() => {
    try {
      handleOptimizedLoadMore();
    } catch (error) {
      console.error('Error in onEndReached:', error);
    }
  }, [handleOptimizedLoadMore]);

  return (
    <View style={{ height: height, width: width }}>
      <FlashList
        ref={flashListRef}
        data={reels}
        renderItem={renderItem}
        numColumns={1}
        keyExtractor={(item: any) => item._id + Math.random() }
        extraData={[
          currentVisible,
          isFocused,
        ]}
        estimatedListSize={{
          height: height,
          width: width,
        }}
        estimatedItemSize={height}
        drawDistance={height * 2}
        overrideItemLayout={(layout, _, index) => {
          layout.size = index;
        }}

        // Viewability configs
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewRef.current}

        // Scroll behavior
        pagingEnabled={true}
        decelerationRate="fast"
        removeClippedSubviews={true}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        disableScrollViewPanResponder={true}
        disableHorizontalListHeightMeasurement={true}
        disableIntervalMomentum={true}

        // Load more optimization
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}

        // Performance && Performance issues tracking
        onLoad={onLoad}
        onBlankArea={onBlankArea}
      />
    </View>
  );
};

export default ReelsList;
