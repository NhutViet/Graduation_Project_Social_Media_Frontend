import React, {useCallback} from 'react';
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
  const {height, width} = Dimensions.get('window');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  const {likedPostIds, followingUserIds, currentUser, refreshToken} =
    useSelector((state: RootState) => ({
      likedPostIds: state.reactions.likePosts,
      followingUserIds: state.relation.following,
      currentUser: state.user.user,
      refreshToken: state.user.refreshToken,
    }));

  const handleLike = useCallback(
    (postId: string, isLiked: boolean) => {
      const action = isLiked ? unlikePost : likePost;
      dispatch(
        action({
          postId,
          refreshToken,
          receiverId: reels.find(r => r._id === postId)?.user._id,
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
      navigation.navigate('ProfileComp', {userID: userId});
    },
    [navigation],
  );

  const handleTagPress = useCallback(
    (userId: string) => {
      navigation.navigate('ProfileComp', {userID: userId});
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

  const renderItem = useCallback(
    ({item}: any) => {
      const isLiked = likedPostIds.includes(item._id);
      const isFollowing = followingUserIds.includes(item.user._id);
      const isCurrentUser = currentUser?._id === item.user._id;
      const shouldPlay = item._id === currentVisible;

      let currentLikeCount = item.likeCount;
      if (item.isLike !== isLiked) {
        currentLikeCount = isLiked ? item.likeCount + 1 : item.likeCount - 1;
      }

      return (
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
          onTagPress={handleTagPress}
          onMenu={() => handleOpenBottomSheet(item)}
          onComment={() => handleOpenCommentSheet(item)}
          onShare={() => openShareModal(item)}
          setSkipReload={setSkipReload}
        />
      );
    },
    [
      currentVisible,
      isFocused,
      likedPostIds,
      followingUserIds,
      currentUser,
      handleLike,
      handleFollow,
      handleProfilePress,
      handleTagPress,
      handleOpenBottomSheet,
      handleOpenCommentSheet,
      openShareModal,
      height,
      setSkipReload,
    ],
  );

  return (
    <View style={{height, width}}>
      <FlashList
        ref={flashListRef}
        data={reels}
        renderItem={renderItem}
        keyExtractor={(item: any) => item._id}
        estimatedItemSize={height}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 90,
        }}
        pagingEnabled
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
      />
    </View>
  );
};

export default ReelsList;
