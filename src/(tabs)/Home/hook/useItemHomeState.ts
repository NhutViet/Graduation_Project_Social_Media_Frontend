import {useEffect, useMemo, useState} from 'react';
import {ItemHomeProps} from '../types';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../../services/store';

export const useItemHomeState = (props: ItemHomeProps) => {
  const {_id, isLike, likeCount, isFollow, isBookmarked} = props;

  const [muted, setMuted] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visibleModalShare, setVisibleModalShare] = useState(false);
  const [follow, setFollow] = useState(isFollow);
  const [isLiked, setIsLiked] = useState(isLike);
  const [numLike, setNumLike] = useState(likeCount);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookmark, setIsBookmark] = useState(isBookmarked);

  const {
    likePosts,
    refreshToken,
    userID,
    followers,
    following,
    loading,
    itemsByPlaylist,
    playlists,
  } = useSelector(
    (state: RootState) => ({
      likePosts: state.reactions.likePosts,
      refreshToken: state.user.refreshToken,
      userID: state.user.user?._id,
      followers: state.relation.followers,
      following: state.relation.following,
      loading: state.relation.loading,
      itemsByPlaylist: state.bookmark.itemsByPlaylist,
      playlists: state.bookmark.playlists,
    }),
    shallowEqual,
  );

  return {
    muted,
    setMuted,
    isModalVisible,
    setIsModalVisible,
    visibleModalShare,
    setVisibleModalShare,
    follow,
    setFollow,
    isLiked,
    setIsLiked,
    numLike,
    setNumLike,
    currentIndex,
    setCurrentIndex,
    isBookmark,
    setIsBookmark,
    likePosts,
    refreshToken,
    userID,
    followers,
    following,
    loading,
    itemsByPlaylist,
    playlists,
  };
};
