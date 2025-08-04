import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchReelsWithMedia} from '@services/postRedux/postSlice';
import {AppDispatch, RootState} from '@services/store';
import {
  addLikedPost,
  removeLikedPost,
} from '@services/reactionRedux/reactionReducer';

export const useReels = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {reels, loading, page, hasNextPage} = useSelector(
    (state: RootState) => state.post,
  );

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [skipReload, setSkipReload] = useState(false);

  useEffect(() => {
    reels.forEach(post => {
      if (post.isLike) {
        dispatch(addLikedPost(post._id));
      } else {
        dispatch(removeLikedPost(post._id));
      }
    });
  }, [reels]);

  useEffect(() => {
    if (!loading && page >= 1 && isInitialLoad) setIsInitialLoad(false);
    if (!loading && isLoadingMore) {
      setIsLoadingMore(false);
      setTimeout(() => setCanLoadMore(true), 1000);
    }
  }, [loading, page, isInitialLoad, isLoadingMore]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage && !isLoadingMore && canLoadMore) {
      setIsLoadingMore(true);
      setCanLoadMore(false);
      dispatch(fetchReelsWithMedia({page: page + 1}));
    }
  }, [loading, hasNextPage, isLoadingMore, canLoadMore, dispatch, page]);

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const id = visibleItem?.item?._id;
      const index = visibleItem?.index;

      if (id && index !== undefined) {
        setCurrentVisible(id);

        const totalItems = reels.length;
        const isNearEnd = index >= totalItems - 2;

        if (
          isNearEnd &&
          !loading &&
          !isLoadingMore &&
          hasNextPage &&
          canLoadMore
        ) {
          setIsLoadingMore(true);
          setCanLoadMore(false);
          dispatch(fetchReelsWithMedia({page: page + 1}));
        }
      }
    }
  });

  return {
    reels,
    loading,
    page,
    hasNextPage,
    currentVisible,
    isInitialLoad,
    handleLoadMore,
    onViewRef,
    setIsInitialLoad,
    setCanLoadMore,
    setSkipReload,
    skipReload,
  };
};
