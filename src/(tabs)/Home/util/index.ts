import {Alert} from 'react-native';
import {relationAction} from '../../../../services/relationRedux/relationSlice';
import {AppDispatch} from '../../../../services/store';
import {
  removeBookmark,
  saveBookmark,
} from '../../../../services/bookmarkRedux/bookmarkSlice';
import {HandleBookmarkParams} from '../types';
import {
  fetchStoriesByIds,
  seenStory,
} from '../../../../services/StoryRedux/StorySlice';

export const handleBookmark = async ({
  isBookmarked,
  _id,
  refreshToken,
  setIsBookmarked,
  dispatch,
}: HandleBookmarkParams) => {
  if (!isBookmarked) {
    setIsBookmarked(true);
    try {
      await dispatch(
        saveBookmark({
          postId: _id,
          refreshToken,
        }),
      ).unwrap();
    } catch (res) {
      setIsBookmarked(false);
    }
  } else {
    setIsBookmarked(false);
    try {
      await dispatch(
        removeBookmark({
          postId: _id,
          refreshToken,
        }),
      ).unwrap();
    } catch (res) {
      setIsBookmarked(true);
    }
  }
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} năm trước`;
  if (months > 0) return `${months} tháng trước`;
  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (minutes > 0) return `${minutes} phút trước`;
  return `Vừa xong`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num?.toString();
};

export const handleFollowToggle = async ({
  userId,
  follow,
  setFollow,
  dispatch,
}: {
  userId: string;
  follow: boolean;
  setFollow: (follow: boolean) => void;
  dispatch: AppDispatch;
}) => {
  const isFollowing = follow;
  const actionType = isFollowing ? 'unfollow' : 'follow';
  setFollow(!isFollowing);
  try {
    await dispatch(
      relationAction({
        targetId: userId,
        action: actionType,
      }),
    ).unwrap();
  } catch (error) {
    Alert.alert(
      `${actionType === 'follow' ? 'Theo dõi' : 'Bỏ theo dõi'} thất bại`,
      'Vui lòng thử lại sau.',
    );
    setFollow(isFollowing);
  }
};

export const handleUserPress = async (
  item: any,
  dispatch: any,
  navigation: any,
) => {
  if (!item.stories.length) return;
  const firstStoryId = item.stories[0];

  try {
    const res = await dispatch(fetchStoriesByIds([firstStoryId])).unwrap();
    const storyDetail = res[0];

    await dispatch(seenStory({storyId: firstStoryId, userId: item._id}));
    navigation.navigate('SeenStory', {
      selectedItem: {
        _id: storyDetail._id,
        uriVideo: storyDetail.mediaUrl.endsWith('.m3u8')
          ? storyDetail.mediaUrl
          : null,
        image: storyDetail.mediaUrl.endsWith('.m3u8')
          ? null
          : storyDetail.mediaUrl,
        likedByUsers: storyDetail.likedByUsers,
      },
    });
  } catch (err) {
    console.error('❌ Error viewing story:', err);
  }
};
