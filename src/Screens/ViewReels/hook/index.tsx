// useReelLike.ts
import {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {likePost, unlikePost} from '@services/reactionRedux/reactionSlice';

export function useReelLike(sampleReels: any[]) {
  const dispatch = useDispatch<AppDispatch>();
  const {likePosts} = useSelector((state: RootState) => state.reactions);
  const {refreshToken} = useSelector((state: RootState) => state.user);

  const [likeStates, setLikeStates] = useState(sampleReels.map(r => r.isLike));
  const [likeCounts, setLikeCounts] = useState(
    sampleReels.map(r => r.likeCount),
  );

  const handleLike = useCallback(
    (index: number) => {
      setLikeStates(prev => {
        const newStates = [...prev];
        newStates[index] = !prev[index];
        return newStates;
      });

      setLikeCounts(prev => {
        const newCounts = [...prev];
        // Sử dụng prev[index] để biết trạng thái trước khi nhấn
        newCounts[index] = prev[index] ? prev[index] - 1 : prev[index] + 1;
        return newCounts;
      });

      const postId = sampleReels[index]._id;
      const originalLikeCount = sampleReels[index].likeCount;

      // Lấy trạng thái like hiện tại từ sampleReels hoặc likeStates (không closure)
      const isCurrentlyLiked = likeStates[index];

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
    [sampleReels, dispatch, refreshToken, likePosts, likeStates],
  );

  return {likeStates, likeCounts, handleLike};
}
