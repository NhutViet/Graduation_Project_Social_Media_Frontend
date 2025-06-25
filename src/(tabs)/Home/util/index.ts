import {Alert} from 'react-native';
import {relationAction} from '../../../../services/relationRedux/relationSlice';
import {AppDispatch} from '../../../../services/store';
import {
  removeBookmark,
  saveBookmark,
} from '../../../../services/bookmarkRedux/bookmarkSlice';
import {HandleBookmarkParams} from '../types';
import {
  fetchStoryDetails,
  seenStory,
} from '../../../../services/StoryRedux/StorySlice';
import {
  checkStorySeenInStorage,
  markStoryAsSeen,
} from '../../../../services/storage/storage';
import {Story} from '@services/StoryRedux/StoryType';

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

  if (!item.stories.length && isCurrentUser) {
    navigation.navigate('UpStory');
    return;
  }

  try {
    //  Gọi API fetchStoryDetails để lấy thông tin đầy đủ các story
    const detailRes = await dispatch(
      fetchStoryDetails({storyIds: item.stories}),
    ).unwrap();

    if (!detailRes || !detailRes.length) {
      Alert.alert('Không tìm thấy story để hiển thị');
      return;
    }

    //  Gọi seenStory cho từng story
    const seenedStories = await Promise.all(
      detailRes.map(async story => {
        try {
          // Chỉ trigger, không dùng kết quả
          await dispatch(seenStory({storyId: story._id}));

          const hasSeen = await checkStorySeenInStorage(
            story._id,
            story.createdAt,
          );
          if (!hasSeen) {
            await markStoryAsSeen(story._id, story.createdAt);
          }

          return {
            ...story,
            uriVideo: story.mediaUrl.endsWith('.m3u8') ? story.mediaUrl : null,
            image:
              story.mediaUrl.endsWith('.jpg') || story.mediaUrl.endsWith('.png')
                ? story.mediaUrl
                : null,
          };
        } catch (err) {
          console.error('❌ seenStory error', err);
          return null;
        }
      }),
    );

    const validStories = seenedStories.filter(s => s);

    if (!validStories.length) {
      Alert.alert('Không có story hợp lệ để hiển thị');
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
  } catch (error) {
    console.error('❌ fetchStoryDetails or seenStory failed:', error);
    Alert.alert('Lỗi khi tải story');
  }
};

export const handleHighlightPress = async (
  story: any,
  dispatch: AppDispatch,
  navigation: any,
  viewerUser: any,
  isOwner: boolean,
) => {
  try {
    const detailRes = await dispatch(
      fetchStoryDetails({storyIds: story.storyId}),
    ).unwrap();

    const seenedStories = await Promise.all(
      detailRes.map(async (item: any) => {
        try {
          await dispatch(seenStory({storyId: item._id}));

          const hasSeen = await checkStorySeenInStorage(
            item._id,
            item.createdAt,
          );
          if (!hasSeen) {
            await markStoryAsSeen(item._id, item.createdAt);
          }

          return {
            ...item,
            uriVideo: item.mediaUrl?.endsWith('.m3u8') ? item.mediaUrl : null,
            image:
              item.mediaUrl?.endsWith('.jpg') || item.mediaUrl?.endsWith('.png')
                ? item.mediaUrl
                : null,
          };
        } catch (err) {
          console.error('seenStory error', err);
          return null;
        }
      }),
    );

    const validStories = seenedStories.filter(s => s);

    if (!validStories.length) {
      Alert.alert('Không có story hợp lệ để hiển thị');
      return;
    }

    const creator = {
      username: viewerUser?.handleName,
      profilePic: viewerUser?.profilePic,
    };

    navigation.navigate(isOwner ? 'SeenStoryOwner' : 'SeenStory', {
      stories: validStories,
      creator,
    });
  } catch (error) {
    console.error('handleHighlightPress error:', error);
    Alert.alert('Lỗi khi tải highlight');
  }
};
