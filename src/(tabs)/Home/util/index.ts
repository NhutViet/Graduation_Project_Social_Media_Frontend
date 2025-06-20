import {Alert} from 'react-native';
import {relationAction} from '../../../../services/relationRedux/relationSlice';
import {AppDispatch} from '../../../../services/store';
import {
  removeBookmark,
  saveBookmark,
} from '../../../../services/bookmarkRedux/bookmarkSlice';
import {HandleBookmarkParams} from '../types';
import {seenStory} from '../../../../services/StoryRedux/StorySlice';
import {
  checkStorySeenInStorage,
  markStoryAsSeen,
} from '../../../../services/storage/storage';

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
          postIds: [_id],
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
  storyDetails: any[],
  user: any,
) => {
  const isCurrentUser = item._id === user?._id;

  // Nếu là người dùng hiện tại và không có story, chuyển sang màn hình up story
  if (!item.stories.length && isCurrentUser) {
    navigation.navigate('UpStory');
    return;
  }

  // Lấy tất cả story của người dùng
  const stories = item.stories
    .map(storyId => storyDetails.find(s => s._id === storyId))
    .filter(story => story); // Lọc bỏ story không tìm thấy

  if (!stories.length) {
    Alert.alert('Không tìm thấy story để hiển thị');
    return;
  }

  // Gọi API seenStory và chuẩn bị dữ liệu
  const selectedItems = await Promise.all(
    stories.map(async story => {
      try {
        const res = await dispatch(seenStory({storyId: story._id})).unwrap();
        const storyData = res?.data;

        if (!storyData || !storyData.mediaUrl) {
          return null;
        }

        // Kiểm tra và lưu trạng thái seen
        const hasSeen = await checkStorySeenInStorage(
          story._id,
          story.createdAt,
        );
        if (!hasSeen) {
          await markStoryAsSeen(story._id, storyData.createdAt);
        }

        return {
          ...storyData,
          uriVideo: storyData.mediaUrl.endsWith('.m3u8')
            ? storyData.mediaUrl
            : null,
          image:
            storyData.mediaUrl.endsWith('.jpg') ||
            storyData.mediaUrl.endsWith('.png')
              ? storyData.mediaUrl
              : null,
          createdAt: storyData.createdAt,
        };
      } catch (error) {
        console.error('❌ seenStory error', error);
        return null;
      }
    }),
  );

  // Lọc bỏ các story không hợp lệ
  const validStories = selectedItems.filter(item => item);

  if (!validStories.length) {
    Alert.alert('Lỗi khi tải story');
    return;
  }

  const creator = {
    username: item.handleName,
    profilePic: item.profilePic,
  };

  navigation.navigate(isCurrentUser ? 'SeenStoryOwner' : 'SeenStory', {
    stories: validStories,
    creator,
  });
};
