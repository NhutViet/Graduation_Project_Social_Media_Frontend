// useReelLike.ts
import {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {likePost, unlikePost} from '@services/reactionRedux/reactionSlice';
import {Reel} from '@services/reelRedux/reelTypes';

export function useReelLike(Reels: Reel[]) {
  const dispatch = useDispatch<AppDispatch>();
  const {likePosts} = useSelector((state: RootState) => state.reactions);
  const {refreshToken} = useSelector((state: RootState) => state.user);

  const [likeCounts, setLikeCounts] = useState(Reels.map(r => r.likeCount));

  const handleLike = useCallback(
    (index: number) => {
      setLikeCounts(prev => {
        const newCounts = [...prev];
        // Sử dụng prev[index] để biết trạng thái trước khi nhấn
        newCounts[index] = prev[index] ? prev[index] - 1 : prev[index] + 1;
        return newCounts;
      });

      const postId = Reels[index]._id;
      const originalLikeCount = Reels[index].likeCount;

      if (isCurrentlyLiked) {
        dispatch(unlikePost({postId, refreshToken}))
          .unwrap()
          .catch(() => {
            setLikeCounts(prev => {
              const newCounts = [...prev];
              newCounts[index] = originalLikeCount;
              return newCounts;
            });
            setLikeStates(prev => {
              const newStates = [...prev];
              newStates[index] = likePosts.includes(postId);
              return newStates;
            });
          });
      } else {
        dispatch(likePost({postId, refreshToken}))
          .unwrap()
          .catch(() => {
            setLikeCounts(prev => {
              const newCounts = [...prev];
              newCounts[index] = originalLikeCount;
              return newCounts;
            });
            setLikeStates(prev => {
              const newStates = [...prev];
              newStates[index] = likePosts.includes(postId);
              return newStates;
            });
          });
      }
    },
    [Reels, dispatch, refreshToken, likePosts, likeStates],
  );

  return {likeStates, likeCounts, handleLike};
}
