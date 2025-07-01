import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../services/store';
import {
  likePost,
  unlikePost,
} from '../../../../services/reactionRedux/reactionSlice';
import {hidePost} from '../../../../services/postRedux/postSlice';
import {
  fetchFollowers,
  fetchFollowing,
} from '../../../../services/relationRedux/relationSlice';
import {handleFollowToggle, handleBookmark} from '../util';
import {ItemHomeProps} from '../types';
import {
  addLikedPost,
  removeLikedPost,
} from '../../../../services/reactionRedux/reactionReducer';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

export const useItemHomeActions = (
  props: ItemHomeProps,
  state: any,
  isFollow: boolean,
) => {
  const dispatch = useDispatch<AppDispatch>();
  const {_id, user, likeCount} = props;

  const {
    isLiked,
    setIsLiked,
    setNumLike,
    likePosts,
    refreshToken,
    userID,
    handleName,
    loading,
    isBookmark,
    setIsBookmark,
    playlists,
    itemsByPlaylist,
  } = state;

  const handleLike = useCallback(() => {
    const optimisticLike = !isLiked;
    setIsLiked(optimisticLike);
    setNumLike((prev: number) => prev + (optimisticLike ? 1 : -1));

    const action = optimisticLike ? likePost : unlikePost;

    dispatch(
      action({
        postId: _id,
        refreshToken,
        senderId: userID,
        receiverId: user._id,
        handleName: handleName,
      }),
    )
      .unwrap()
      .then(() => {
        if (optimisticLike) {
          dispatch(addLikedPost(_id));
        } else {
          dispatch(removeLikedPost({postId: _id}));
        }
      })
      .catch(() => {
        setIsLiked(!optimisticLike);
        setNumLike(likeCount);
      });
  }, [isLiked, _id, refreshToken, likeCount, likePosts]);

  const handleHidePost = useCallback(() => {
    dispatch(hidePost(_id))
      .unwrap()
      .catch(() => {
        GlobalAlertManager.show('Thất bại', 'Ẩn bài viết lỗi');
      });
  }, [_id]);

  const handleFollowAction = useCallback(() => {
    handleFollowToggle({
      userId: user._id,
      follow: isFollow,
      dispatch,
    });
  }, [user._id, isFollow, dispatch]);

  const handleBookmarkAction = useCallback(() => {
    handleBookmark({
      isBookmarked: isBookmark,
      _id,
      refreshToken,
      setIsBookmarked: setIsBookmark,
      dispatch,
    });
  }, [isBookmark, _id, playlists, refreshToken, itemsByPlaylist, dispatch]);

  return {
    handleLike,
    handleHidePost,
    handleFollowAction,
    handleBookmarkAction,
  };
};
