import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {Alert} from 'react-native';
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

export const useItemHomeActions = (props: ItemHomeProps, state: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {_id, user, likeCount} = props;

  const {
    isLiked,
    setIsLiked,
    numLike,
    setNumLike,
    likePosts,
    refreshToken,
    userID,
    loading,
    setVisibleModalShare,
    follow,
    setFollow,
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

    dispatch(action({postId: _id, refreshToken}))
      .unwrap()
      .catch(() => {
        setIsLiked(likePosts.includes(_id));
        setNumLike(likeCount);
      });
  }, [isLiked, _id, refreshToken, likeCount, likePosts]);

  const handleHidePost = useCallback(() => {
    dispatch(hidePost(_id))
      .unwrap()
      .catch(() => {
        Alert.alert('Ẩn bài viết lỗi');
      });
  }, [_id]);

  const handleOpenModalShare = useCallback(() => {
    if (loading) return;

    if (userID) {
      Promise.all([
        dispatch(fetchFollowers({userId: userID})),
        dispatch(fetchFollowing({userId: userID})),
      ])
        .then(() => setVisibleModalShare(true))
        .catch(() => {
          Alert.alert(
            'Lỗi',
            'Không thể tải danh sách bạn bè. Vui lòng thử lại.',
          );
        });
    }
  }, [dispatch, userID, loading, setVisibleModalShare]);

  const handleFollowAction = useCallback(() => {
    handleFollowToggle({
      userId: user._id,
      follow,
      setFollow,
      dispatch,
    });
  }, [user._id, follow, dispatch]);

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
    handleOpenModalShare,
    handleFollowAction,
    handleBookmarkAction,
  };
};
