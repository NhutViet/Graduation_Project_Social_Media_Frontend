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
import {
  addLikedPost,
  removeLikedPost,
} from '../../../../services/reactionRedux/reactionReducer';
import { useNavigation } from '@react-navigation/native';
import { fetchMyRooms } from '@services/roomRedux/roomSlice';
import { ModalShareHandle } from '../components/ModalShare';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

export const useItemHomeActions = (props: ItemHomeProps, state: any, modalShareRef: React.RefObject<ModalShareHandle>) => {
  const dispatch = useDispatch<AppDispatch>();
  const {_id, user, likeCount} = props;
  const navigation: any = useNavigation();

  const {
    isLiked,
    setIsLiked,
    numLike,
    setNumLike,
    likePosts,
    refreshToken,
    userID,
    loading,
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

  const handleOpenModalShare = useCallback(() => {
    if (loading) return;

    if (userID) {
      Promise.all([
        dispatch(fetchMyRooms()),
        // dispatch(fetchFollowers({userId: userID})),
        // dispatch(fetchFollowing({userId: userID})),
      ])
        .then(() => {modalShareRef.current?.open();})
        .catch(() => {
          GlobalAlertManager.show(
            'Thất bại',
            'Không thể tải danh sách bạn bè. Vui lòng thử lại.',
          );
        });
    }
  }, [dispatch, userID, loading, modalShareRef]);

  const handleFollowAction = useCallback(() => {
    if (user._id === userID) {
      navigation.navigate('Account');
      return;
    }
    handleFollowToggle({
      userId: user._id,
      follow,
      setFollow,
      dispatch,
    });
  }, [user._id, userID, follow, setFollow, dispatch, navigation]);

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
