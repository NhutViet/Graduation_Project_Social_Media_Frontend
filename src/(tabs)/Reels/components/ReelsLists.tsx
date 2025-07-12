import React, {useCallback, useRef, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  likePost,
  unlikePost,
} from '../../../../services/reactionRedux/reactionSlice';
import {relationAction} from '@services/relationRedux/relationSlice';
import ReelsComponent from './reelsComponent';
import {PostWithMedia} from '@services/postRedux/postTypes';
import {UserProfile} from '@services/relationRedux/relationTypes';
import {
  addLikedPost,
  removeLikedPost,
} from '@services/reactionRedux/reactionReducer';
import LoadingModal from '../../../../components/Global/LoadingModal';

const width = Dimensions.get('window').width;

interface ReelsListProps {
  reels: PostWithMedia[];
  currentVisible: string | null;
  isFocused: boolean;
  loading: boolean;
  isInitialLoad: boolean;
  flashListRef: React.RefObject<FlashList<PostWithMedia>>;
  onViewRef: React.MutableRefObject<any>;
  handleLoadMore: () => void;
  openBottomSheet: (item: PostWithMedia) => void;
  openCommentSheet: (item: PostWithMedia) => void;
  openShareModal: (item: PostWithMedia) => void;
  setSkipReload: (value: boolean) => void;
}

const ReelsList = ({
  reels,
  currentVisible,
  isFocused,
  loading,
  isInitialLoad,
  flashListRef,
  onViewRef,
  handleLoadMore,
  openBottomSheet,
  openCommentSheet,
  openShareModal,
  setSkipReload,
}: ReelsListProps) => {
  const [visibleHeight, setVisibleHeight] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const loadingRef = useRef(false);

  const likedPostIds = useSelector(
    (state: RootState) => state.reactions.likePosts,
  );
  const followingUserIds = useSelector(
    (state: RootState) => state.relation.following,
  );
  const currentUser = useSelector((state: RootState) => state.user.user);
  const refreshToken = useSelector(
    (state: RootState) => state.user.refreshToken,
  );

  const handleLike = useCallback(
    async (postId: string, isLiked: boolean) => {
      const receiverId =
        reels.find((r: PostWithMedia) => r._id === postId)?.user._id ?? '';
      const action = isLiked ? unlikePost : likePost;
      if (isLiked) {
        dispatch(removeLikedPost(postId));
      } else {
        dispatch(addLikedPost(postId));
      }

      try {
        await dispatch(
          action({
            postId,
            refreshToken,
            receiverId,
            handleName: currentUser?.handleName ?? '',
            userId: currentUser?._id,
          }),
        ).unwrap();
      } catch (error) {
        // 3. Nếu thất bại, rollback UI
        console.log('Like/unlike thất bại, khôi phục UI:', error);
        if (isLiked) {
          dispatch(addLikedPost(postId));
        } else {
          dispatch(removeLikedPost(postId));
        }
      }
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
      navigation.navigate('ProfileComp', {userID: userId});
    },
    [navigation],
  );

  const handleOpenBottomSheet = useCallback(
    (item: PostWithMedia) => {
      openBottomSheet(item);
    },
    [openBottomSheet],
  );

  const handleOpenCommentSheet = useCallback(
    (item: PostWithMedia) => {
      openCommentSheet(item);
    },
    [openCommentSheet],
  );

  const handleOptimizedLoadMore = useCallback(() => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;

    handleLoadMore();

    setTimeout(() => {
      loadingRef.current = false;
    }, 500);
  }, [handleLoadMore]);

  return (
    <View
      style={{flex: 1}}
      onLayout={e => setVisibleHeight(e.nativeEvent.layout.height)}>
      {visibleHeight > 0 && (
        <FlashList
          ref={flashListRef}
          data={reels}
          extraData={[currentVisible, isFocused]}
          onEndReached={handleOptimizedLoadMore}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          getItemType={() => 'reel'}
          ListFooterComponent={
            loading && !isInitialLoad
              ? () => (
                  <View style={{padding: 12}}>
                    <LoadingModal />
                  </View>
                )
              : null
          }
          renderItem={({item}) => {
            const shouldPlay = item?._id === currentVisible;
            const isLiked = likedPostIds.includes(item._id);
            const isFollowing = followingUserIds.some(
              (user: UserProfile) => user._id === item.userID,
            );
            const isCurrentUser = currentUser?._id === item.user._id;

            let currentLikeCount = item.likeCount;
            if (currentLikeCount && item.likeCount && item.isLike !== isLiked) {
              currentLikeCount = isLiked
                ? item.likeCount + 1
                : item.likeCount - 1;
            }

            return (
              <ReelsComponent
                {...item}
                containerHeight={visibleHeight}
                isFocused={isFocused}
                currentVisible={shouldPlay}
                isFollow={item?.isFollow}
                isLiked={isLiked}
                isFollowing={isFollowing}
                isCurrentUser={isCurrentUser}
                likeCount={currentLikeCount}
                muted={false}
                onLike={handleLike}
                onFollow={handleFollow}
                onProfilePress={handleProfilePress}
                onTagPress={handleProfilePress}
                onMenu={() => handleOpenBottomSheet(item)}
                openComment={() => handleOpenCommentSheet(item)}
                openReactionModal={() => {}}
                openShareModal={() => openShareModal(item)}
                setSkipReload={setSkipReload}
              />
            );
          }}
          pagingEnabled={true}
          overScrollMode="never"
          decelerationRate="fast"
          disableHorizontalListHeightMeasurement={true}
          estimatedFirstItemOffset={3}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={visibleHeight}
          estimatedListSize={{height: visibleHeight, width}}
          keyExtractor={(item: PostWithMedia) => item._id}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 90,
            minimumViewTime: 300,
          }}
        />
      )}
    </View>
  );
};

export default ReelsList;
